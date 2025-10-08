import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from supabase import create_client, Client
from postgrest.exceptions import APIError as AuthApiError
from flask_cors import CORS # Import the CORS extension



app = Flask(__name__)

CORS(app) 

load_dotenv()
supa_url: str = os.environ.get("SUPABASE_URL")
supa_key: str = os.environ.get("SUPABASE_KEY")


supabase: Client = create_client(supabase_url=supa_url, supabase_key=supa_key)

#TEST_USER_ID = 'f8ed3ee1-359e-4e54-a301-3c7c77dcfbea'

@app.route("/")
def home():
  response = supabase.table('users').select('*').execute()
  return jsonify(response.data)

@app.route("/create_recipe", methods=["POST"])
def create_recipe():
  try:

    user_id, error_response, status_code = get_current_user()
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

@app.route("/toggle_favorite", methods=["POST"])
def toggle_favorite():
  try:

    user_id, error_response, status_code = get_current_user()
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

@app.route("/create_user", methods=["POST"])
def create_user():
  data = request.get_json()
  auth_header = request.headers.get('Authorization')
  if not data or not all(key in data for key in ['id', 'first_name', 'last_name','email']):
    return jsonify({'message': 'Missing data: username, email, and password are required.'}), 400
  if not auth_header or not auth_header.startswith('Bearer '):
    return jsonify({'message': 'Authorization header is missing or invalid.'}), 401
  
  jwt_token = auth_header.split(' ')[1]

  first_name=data.get('first_name')
  last_name=data.get('last_name')
  id=data.get('id')
  email=data.get('email')

  try:
      user_response = supabase.auth.get_user(jwt_token)
      user = user_response.user
      
      if not user:
        return jsonify({'message': 'Invalid or expired token.'}), 401
      if user.id!=id:
        return jsonify({'message':'UID does not match session'})


  except AuthApiError as e:
      return jsonify({'message': 'Authentication failed.', 'error': e.message}), 401
  except Exception:
      return jsonify({'message': 'Invalid token.'}), 401



  newUser={
    'first_name':first_name,
    'last_name': last_name,
    'id': id,
    'email':email
  }

  try:
    response = (
      supabase.table("users")
      .insert(newUser)
      .execute()
    )

    if response.data:
      return jsonify({'message': 'User successfuly created','data':response.data[0]}), 200
    else:
      return jsonify({'message': 'failed to create user'}), 400

      
  except Exception as e:
    print(str(e))
    return jsonify({'message': 'An error occured trying to add a user'}), 500
@app.route('/set-preference', methods=['POST'])
def set_preference():

  data = request.get_json()
  if not data or not all(key in data for key in ['diet_restriction','food_preference', 'id']):
    return jsonify({'message': 'Missing preference data'}), 400
  user_id = data.get('id')
  dietary_restrictions = data.get('diet_restriction')
  food_preferences = data.get('food_preference')
  print(user_id)
  print(dietary_restrictions)

  get_current_user()

  try:
    update_data = {
      'diet_restriction': dietary_restrictions,
      'food_preference': food_preferences
    }
    response = supabase.table('users').update(update_data).eq('id', user_id).execute()
    if not response.data:
      return jsonify({"error": "User not found"}), 404

    return jsonify({
      "message": "User preferences updated successfully.",
      "updated_data": response.data[0] 
    }), 200
  except Exception as e:
    return jsonify({"error": "An error occurred while updating preferences.", "details": str(e)}), 500



def get_current_user():
  auth_header = request.headers.get('Authorization')
  if not auth_header or not auth_header.startswith('Bearer '):
    return None, jsonify({'message': 'Authorization header is missing or invalid.'}), 401
  
  jwt_token = auth_header.split(' ')[1]

  try:
    user_response = supabase.auth.get_user(jwt_token)
    user = user_response.user
    if not user:
      return None, jsonify({'message' : 'Invalid or expired token.'}), 401
    return user.id, None, None

  except AuthApiError as e:
    return None, jsonify({'message' : 'Authentication failed.', 'error' : e.message}), 401
  except Exception:
    return None, jsonify({'message' : 'Invalid token.'}), 401

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=5000, debug=True)