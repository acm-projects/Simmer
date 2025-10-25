from flask import Blueprint, request, jsonify
from utils.supabase import supabase
from utils.auth import authorize_user
from utils.createRecipe import createRecipe
import json
recipe_bp = Blueprint('recipe', __name__)


@recipe_bp.route("/create_recipe", methods=["POST"])
def create_recipe():
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
    ingredients = data.get('ingredients', [])

    if not title or not instructions:
      return jsonify({'error' : 'title and instructions are requried'}), 400

    recipe = supabase.table('recipes').insert({
      'title' : title,
      'description' : description,
      'instructions' : instructions,
      'prep_time' : prep_time,
      'cook_time' : cook_time,
      'dietary_tags' : dietary_tags,
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
    })
  
  except Exception as e:
    print('ERROR', e)
    return jsonify({'error' : 'Internal Server Error', 'details' : str(e)}), 500
  
@recipe_bp.route("/ai_create_recipe", methods=["POST"])
def ai_create_recipe():
  data = request.get_json()
  if not data or not all(key in data for key in ['content']):
    return jsonify({'message': 'Missing data: content.'}), 400
  content=data.get('content')
  recipeStr=createRecipe(content)
  print(recipeStr)
  recipeJson=json.loads(recipeStr)
  ingredients=recipeJson['ingredients']
  recipeJson.pop('ingredients')

  title = recipeJson.get('title')
  description = recipeJson.get('description', '')
  instructions = recipeJson.get('instructions')
  ai_instructions = recipeJson.get('ai_instructions')
  prep_time = recipeJson.get('prep_time', 0)
  cook_time = recipeJson.get('cook_time', 0)
  dietary_tags = recipeJson.get('dietary_tags', [])

  recipe = supabase.table('recipes').insert({
      'title' : title,
      'description' : description,
      'instructions' : instructions,
      'ai_instructions': ai_instructions,
      'prep_time' : prep_time,
      'cook_time' : cook_time,
      'dietary_tags' : dietary_tags,
      'created_by' : '5bf7dcc0-0f2b-4d9f-a601-d3d92b72d02d' #temporoary id
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


  return jsonify({'message': recipeJson}), 200
    
    
@recipe_bp.route("/toggle_favorite", methods=["POST"])
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