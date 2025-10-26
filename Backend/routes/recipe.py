import json
from flask import Blueprint, request, jsonify
from utils.supabase import supabase
from utils.auth import authorize_user
from utils.createRecipe import generate_recipe, generate_ai_instructions, categorize_protein_types
from utils.import_videos import get_url_data

recipe_bp = Blueprint('recipe', __name__)

@recipe_bp.route('/add-recipe', methods=['POST'])
def add_recipe():
  try:
    user_id, error_response, status_code = authorize_user()
    if error_response:
      return error_response, status_code
    
    data = request.get_json()

    title = data.get('title')
    description = data.get('description', '')
    instructions = data.get('instructions')
    prep_time = data.get('prep_time', 0)
    cook_time = data.get('cook_time', 0)
    dietary_tags = data.get('dietary_tags', [])
    type = data.get('type')
    ingredients = data.get('ingredients', [])
    image_url = data.get('image_url', '')

    if not title or not instructions or not type:
      return jsonify({'error' : 'title, instructions, and type are required'}), 400
    
    ai_instructions = generate_ai_instructions(instructions)
    if not ai_instructions:
      return jsonify({'error' : 'failed to generate AI instructions'}), 401
    
    protein = categorize_protein_types(ingredients)
    if not protein:
      return jsonify({'error' : 'failed to generate protein list'}), 401

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
      return jsonify({'error': 'Failed to create recipe'}), 400
      
    recipe_id = recipe.data[0]['id']

    for ing in ingredients:
      supabase.table('ingredients').insert({
        'recipe_id' : recipe_id,
        'name' : ing.get('name'),
        'quantity' : ing.get('quantity'),
        'unit' : ing.get('unit'),
        'is_allergen' : ing.get('is_allergen', False)
      }).execute()

    return jsonify({
      'message' : 'Recipe created and saved!',
      'recipe_id' : recipe_id
    }), 200
  
  except Exception as e:
    print('ERROR', e)
    return jsonify({'error' : 'Internal Server Error', 'details' : str(e)}), 500

@recipe_bp.route("/import-recipe", methods=["POST"])
def import_recipe():
  try:
    user_id, error_response, status_code = authorize_user()
    if error_response:
      return error_response, status_code
    
    data = request.get_json()
    if not data or not all(key in data for key in ['content']):
      return jsonify({'message': 'Missing data: content.'}), 400
    
    content = data.get('content')
    recipe_info = get_url_data(content)
    if not recipe_info:
      return jsonify ({'message' : 'Failed to extract data from content'})

    recipe_str = generate_recipe(recipe_info)
    recipeJson = json.loads(recipe_str)

    if not recipeJson:
      return jsonify({'error': 'Failed to create recipe'}), 400
      
    return recipeJson, 200
  
  except Exception as e:
    print('ERROR', e)
    return jsonify({'error' : 'Internal Server Error', 'details' : str(e)}), 500
    
@recipe_bp.route("/toggle-favorite", methods=["POST"])
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
      return jsonify ({'message' : 'Recipe Unfavorited!'})
    
    else:
      favorite = supabase.table('user_favorites').insert({
        'user_id' : user_id,
        'recipe_id' : recipe_id
      }).execute()

      if not favorite.data:
        return jsonify({'error' : 'failed to favorite recipe'}), 400
      
      return jsonify({'message' : 'Recipe favorited!', 'recipe_id' : favorite.data[0]['recipe_id']})
  
  except Exception as e:
    print('ERROR', e)
    return jsonify({"error": "Internal Server Error", "details": str(e)}), 500
  
@recipe_bp.route("/user/saved-recipes", methods=["GET"])
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
      return jsonify({'message' : 'No saved recipes found.', 'recipes' : [] }), 200
    
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
      .select('id, title, description, instructions, prep_time, cook_time, dietary_tags, created_at, image_url, ingredients(*)')
      .in_('id', recipe_ids)
      .execute()
    )

    recipes = recipes_response.data
    for r in recipes:
      r['is_favorited'] = r['id'] in favorited_ids
  
    return jsonify({'saved_recipes' : recipes}), 200
  
  except Exception as e:
    print('ERROR', e)
    return jsonify({'error' : 'Internal Server Error', 'details' : str(e)}), 500

@recipe_bp.route("/user/favorited-recipes", methods=["GET"])
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
      return jsonify({'message' : 'No favorited recipes found.', 'recipes' : [] }), 200
    
    recipe_ids = [r['recipe_id'] for r in favorited_recipes_response.data]

    recipes = (
      supabase.table('recipes')
      .select('id, title, description, instructions, prep_time, cook_time, dietary_tags, created_at, ingredients(*)')
      .in_('id', recipe_ids)
      .execute()
    )
    return jsonify({'favorited_recipes' : recipes.data}), 200
  
  except Exception as e:
    print('ERROR', e)
    return jsonify({'error' : 'Internal Server Error', 'details' : str(e)}), 500