import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from supabase import create_client, Client

app = Flask(__name__)

load_dotenv()
supa_url: str = os.environ.get("SUPABASE_URL")
supa_key: str = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(supabase_url=supa_url, supabase_key=supa_key)

TEST_USER_ID = 'f8ed3ee1-359e-4e54-a301-3c7c77dcfbea'

@app.route("/")
def home():
  response = supabase.table('users').select('*').execute()
  return jsonify(response.data)

@app.route("/create_recipe", methods=["POST"])
def create_recipe():
  try:
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
      'created_by' : TEST_USER_ID
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

@app.route("/favorite_recipe", methods=["POST"])
def favorite_recipe():
  try:
    data = request.get_json()
    recipe_id = data.get('recipe_id')

    if not recipe_id:
      return jsonify({'error' : 'recipe_id is required'}), 400
    
    recipe_check = supabase.table('recipes').select('id').eq('id', recipe_id).execute()
    if not recipe_check:
      return jsonify({'error' : 'recipe_id does not exist'}), 404
    
    saved_check = supabase.table('user_saved_recipes').select('recipe_id').eq('user_id', TEST_USER_ID).eq('recipe_id', recipe_id).execute()
    if not saved_check:
      return jsonify({'error' : 'must save recipe before favoriting it'}), 403
    
    favorite = supabase.table('user_favorites').insert({
      'user_id' : TEST_USER_ID,
      'recipe_id' : recipe_id
    }).execute()

    if not favorite.data:
      return jsonify({'error' : 'failed to favorite recipe'}), 400
    
    return jsonify({'message' : 'Recipe favorited!', 'recipe_id' : favorite.data[0]['recipe_id']})
  
  except Exception as e:
    print('ERROR', e)
    return jsonify({"error": "Internal Server Error", "details": str(e)}), 500 

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=5000, debug=True)