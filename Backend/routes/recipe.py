import json
from flask import Blueprint, request, jsonify 
from utils.supabase import supabase
from utils.auth import authorize_user
from utils.createRecipe import generate_recipe, generate_ai_instructions, categorize_protein_types, upload_image
from utils.import_videos import get_url_data
recipe_bp = Blueprint('recipe', __name__)

def default_quantity_to_one(value):
  try:
    return float(value)
  except (ValueError, TypeError):
    return 1.0
@recipe_bp.route('/add-recipe', methods=['POST'])
def add_recipe():
  try:
    user_id, error_response, status_code = authorize_user()
    if error_response:
      return error_response, status_code
    user_id='8089f0b3-48fd-484a-8ed5-081459c556e3'
    
    data_string = request.form.get('json_data')
    user_id = request.form.get('id')
    data = json.loads(data_string)
    title = data.get('title')
    description = data.get('description', '')
    instructions = data.get('instructions')
    prep_time = data.get('prep_time', 0)
    cook_time = data.get('cook_time', 0)
    dietary_tags = data.get('dietary_tags', [])
    type = data.get('type')
    ingredients = data.get('ingredients', [])
    try:
      image_url = upload_image()
    except Exception as e:
        return jsonify({"error": f"other error:{e.message}"}), 500

    if not title or not instructions or not type:
      return jsonify({'error' : 'title, instructions, and type are required'}), 400
    
    ai_instructions = generate_ai_instructions(instructions)
    print(str(instructions))
    if not ai_instructions:
      return jsonify({'error' : 'failed to generate AI instructions'}), 400
    print(ingredients)
    protein = categorize_protein_types(ingredients)
    if not protein:
      return jsonify({'error' : 'failed to generate protein list'}), 400
    print('protein done bruh')
    recipe = supabase.table('recipes').insert({
        'title' : title,
        'description' : description,
        'instructions' : instructions,
        'ai_instructions': ai_instructions,
        'prep_time' : prep_time,
        'cook_time' : cook_time,
        'dietary_tags' : dietary_tags,
        'protein' : protein,
        'type' : type,
        'image_url' : image_url,
        'created_by' : user_id
    }).execute()

    if not recipe.data:
      return jsonify({'error': 'failed to create recipe'}), 400
      
    recipe_id = recipe.data[0]['id']


    for ing in ingredients:
      supabase.table('ingredients').insert({
        'recipe_id' : recipe_id,
        'name' : ing.get('name'),
        'quantity' : default_quantity_to_one(ing.get('quantity')),
        'unit' : ing.get('unit'),
        'is_allergen' : False
      }).execute()

    return jsonify({
      'message' : 'recipe created and saved',
      'recipe_id' : recipe_id
    }), 200
  
  except Exception as e:
    print(str(e))
    return jsonify({'error' : 'internal server error', 'details' : str(e)}), 500

@recipe_bp.route('/import-recipe', methods=['POST'])
def import_recipe():
  try:
    # user_id, error_response, status_code = authorize_user()
    # if error_response:
    #   return error_response, status_code
    
    data = request.get_json()
    if not data or not all(key in data for key in ['content']):
      return jsonify({'error': 'missing data: content.'}), 400
    
    content = data.get('content')
    recipe_info = get_url_data(content)
    if not recipe_info:
      return jsonify ({'error' : 'failed to extract data from content'}), 400

    recipe_str = generate_recipe(recipe_info)
    recipeJson = json.loads(recipe_str)

    if not recipeJson:
      return jsonify({'error': 'failed to create recipe'}), 400
      
    return recipeJson, 200
  
  except Exception as e:
    print('error importing recipe', e)
    return jsonify({'error' : 'internal server error', 'details' : str(e)}), 500
    
@recipe_bp.route('/toggle-favorite', methods=['POST'])
def toggle_favorite():
  try:

    user_id, error_response, status_code = authorize_user()
    if error_response:
      return error_response, status_code

    data = request.get_json()
    recipe_id = data.get('recipe_id')

    if not recipe_id:
      return jsonify({'error' : 'recipe_id is required'}), 400
    
    recipe_check = supabase.table('recipes').select('id').eq('id', recipe_id).execute()
    if not recipe_check:
      return jsonify({'error' : 'recipe_id does not exist'}), 404
    
    saved_check = supabase.table('user_saved_recipes').select('recipe_id').eq('user_id', user_id).eq('recipe_id', recipe_id).execute()
    if not saved_check:
      return jsonify({'error' : 'must save recipe before toggling favorite'}), 403
    
    favorite_check = supabase.table('user_favorites').select('recipe_id').eq('user_id', user_id).eq('recipe_id', recipe_id).execute()
    if favorite_check.data:
      supabase.table('user_favorites').delete().eq('user_id', user_id).eq('recipe_id', recipe_id).execute()
      return jsonify ({'message' : 'recipe unfavorited'})
    
    else:
      favorite = supabase.table('user_favorites').insert({
        'user_id' : user_id,
        'recipe_id' : recipe_id
      }).execute()

      if not favorite.data:
        return jsonify({'error' : 'failed to favorite recipe'}), 400
      
      return jsonify({'message' : 'recipe favorited', 'recipe_id' : favorite.data[0]['recipe_id']})
  
  except Exception as e:
    print('error toggling favorite', e)
    return jsonify({"error": "internal server error", "details": str(e)}), 500
  
@recipe_bp.route('/saved-recipes', methods=['GET'])
def get_saved_recipes():
  try:
    user_id, error_response, status_code = authorize_user()
    if error_response:
      return error_response, status_code
    
    saved_recipes_response = (
      supabase.table('user_saved_recipes')
      .select('recipe_id')
      .eq('user_id', user_id)
      .execute()
    )

    if not saved_recipes_response.data:
      return jsonify({'message' : 'no saved recipes found.', 'recipes' : [] }), 200
    
    recipe_ids = [r['recipe_id'] for r in saved_recipes_response.data]

    favorites_response = (
      supabase.table('user_favorites')
      .select('recipe_id')
      .eq('user_id', user_id)
      .execute()
    )

    favorited_ids = {f['recipe_id'] for f in favorites_response.data}

    recipes_response = (
      supabase.table('recipes')
      .select('id, title, description, prep_time, cook_time, created_at, image_url')
      .in_('id', recipe_ids)
      .execute()
    )

    recipes = recipes_response.data
    for r in recipes:
      r['is_favorited'] = r['id'] in favorited_ids
  
    return jsonify({'saved_recipes' : recipes}), 200
  
  except Exception as e:
    print('error retreiving saved recipes', e)
    return jsonify({'error' : 'internal server error', 'details' : str(e)}), 500

@recipe_bp.route('/favorited-recipes', methods=['GET'])
def get_favorited_recipes():
  try:
    user_id, error_response, status_code = authorize_user()
    if error_response:
      return error_response, status_code
    
    favorited_recipes_response = (
      supabase.table('user_favorites')
      .select('recipe_id')
      .eq('user_id', user_id)
      .execute()
    )

    if not favorited_recipes_response.data:
      return jsonify({'message' : 'no favorited recipes found.', 'recipes' : [] }), 200
    
    recipe_ids = [r['recipe_id'] for r in favorited_recipes_response.data]

    recipes = (
      supabase.table('recipes')
      .select('id, title, description, prep_time, cook_time, created_at, image_url')
      .in_('id', recipe_ids)
      .execute()
    )
    return jsonify({'favorited_recipes' : recipes.data}), 200
  
  except Exception as e:
    print('error retrieving favorited recipes', e)
    return jsonify({'error' : 'internal server error', 'details' : str(e)}), 500

@recipe_bp.route("/recipes", methods=["GET"])
def get_recipes():
  # data = request.get_json()
  # dietary_restrictions=data.get('dietary_tags')
  # time=data.get('time')
  # type=data.get('type')
  # protein=data.get('protein')
  try:
    user_id, error_response, status_code = authorize_user()
    if error_response:
      return error_response, status_code
    # query= supabase.table("recipes").select("*")
    # if(type):
    #   query=query.eq("type", type)
    # if(dietary_restrictions):
    #   query=query.overlaps("dietary_tags", dietary_restrictions)
    # if(protein):
    #   query=query.overlaps("protein", protein)
    #   response = query.execute()
        # .eq("type", type)
        # .overlaps("dietary_tags", dietary_restrictions)
        # .overlaps("protein", protein)
    response= supabase.table("recipes").select("*,ingredients(*), user_favorites(*)").eq('created_by',user_id).execute()

  except Exception as e:
    return jsonify({"error": "An error occurred while updating preferences.", "details": str(e)}), 500
  # print('bye')
  # print(response.data)
  data=response.data
  # if not time == -1:
  #   data=[
  #     item for item in data
  #     if isinstance(item.get('cook_time'), (int, float)) and \
  #       isinstance(item.get('prep_time'), (int, float)) and \
  #       (item.get('cook_time') + item.get('prep_time')) <= time
  #   ]
  return jsonify({'result' : data}), 200

@recipe_bp.route('/recipe/info', methods=['GET'])
def get_recipe_info():
  try:
    user_id, error_response, status_code = authorize_user()
    if error_response:
      return error_response, status_code
    
    data = request.get_json()
    recipe_id = data.get('recipe_id')

    if not recipe_id:
      return jsonify({'error' : 'recipe_id is required'}), 400
    
    recipe_response = (
      supabase.table('recipes')
      .select('id, title, description, instructions, prep_time, cook_time, dietary_tags, type, ingredients(*), image_url')
      .eq('id', recipe_id)
      .execute()
    )

    if not recipe_response.data:
      return jsonify({'error' : 'recipe not found'}), 404
    
    recipe = recipe_response.data[0]

    return jsonify({'recipe' : recipe}), 200
  except Exception as e:
    print('error retrieving recipe data', e)
    return jsonify({'error' : 'internal server error', 'details' : str(e)}), 500
  
@recipe_bp.route('/recipe/delete', methods=['DELETE'])
def delete_recipe():
  try:
    user_id, error_response, status_code = authorize_user()
    if error_response:
      return error_response, status_code
    
    data = request.get_json()
    recipe_id = data.get('recipe_id')

    if not recipe_id:
      return jsonify({'error' : 'recipe_id is required'}), 400
    
    recipe_check = (
      supabase.table('user_saved_recipes')
      .select('recipe_id, user_id')
      .eq('recipe_id', recipe_id)
      .eq('user_id', user_id)
      .execute()
    )

    if not recipe_check.data:
      return jsonify({'error' : 'unauthorized action: you do not own this recipe.'}), 403
    
    response = (
      supabase.table('recipes')
      .delete()
      .eq('id', recipe_id)
      .execute()
    )

    if hasattr(response, 'error') and response.error:
      return jsonify({'error': 'failed to delete recipe', 'details': response.error.message}), 400
    
    return jsonify({
      'message' : 'recipe deleted successfully',
      'deleted_recipe_id' : response.data[0]
    }), 200
  
  except Exception as e:
    print('error deleteing recipe ', e)
    return jsonify({'error' : 'internal server error', 'details' : str(e)}), 500
  
# @recipe_bp.route("/recipe/image", methods=["POST"])
# def upload_image():
#     if 'thumbnail' not in request.files:
#         return jsonify({"error": "no thumbnail"}), 400

#     thumbnail = request.files['thumbnail']

#     if thumbnail.filename == '':
#         return jsonify({"error": "No file selected"}), 400
    
#     if thumbnail:
#       thumbnail_name= secure_filename(thumbnail.filename)
#       thumbnail_bytes = thumbnail.read()

#       bucket_name = "recipe_images"
#       thumbnail_path = f"/{thumbnail_name}"
#     try:
#       supabase.storage.from_(bucket_name).upload(
#           file=thumbnail_bytes,
#           path=thumbnail_path,
#           file_options={"content-type": 'image/png'} 
#       )
#       public_url = supabase.storage.from_(bucket_name).get_public_url(thumbnail_path)
#       return jsonify({
#           "public_url": public_url
#       }), 200
#     except AuthApiError as e:
#             return jsonify({"error":  f"auth error:{e.message}"}), 500
#     except Exception as e:
#         return jsonify({"error": f"other error:{e.message}"}), 500

@recipe_bp.route('/recipe/image', methods=['PUT'])
def editImage():
  try:
      user_id, error_response, status_code = authorize_user()
      if error_response:
        return error_response, status_code
      rid=request.form.get('rid')
      image_url=upload_image()

      response = supabase.table("recipes").update({
          "image_url": image_url
      }).eq("id", rid).execute()

      if not response.data:
          return jsonify({"error": f"recipe not found"}), 404

      return jsonify(image_url), 200
  
  except Exception as e:
      return jsonify({"error": e.message}), 500