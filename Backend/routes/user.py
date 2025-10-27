from flask import Blueprint, request, jsonify
from utils.auth import authorize_user
from utils.supabase import supabase
from postgrest.exceptions import APIError as AuthApiError

user_bp = Blueprint('main', __name__)
@user_bp.route('/user/create-user', methods=['POST'])
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

@user_bp.route('/user/update-name', methods=['PUT'])
def update_name():
  try:
    user_id, error_response, status_code = authorize_user()
    if error_response:
      return error_response, status_code
    
    data = request.get_json()
    if not data or not all(key in data for key in ['first_name', 'last_name']):
      return jsonify({'message': 'Missing data: first_name, last_name'}), 400
    
    first_name = data.get('first_name')
    last_name = data.get('last_name')

    supabase.table('users').update({
      'first_name' : first_name,
      'last_name' : last_name
    }).eq('id', user_id).execute()

    return jsonify ({
      'message' : 'Name updated successfully',
      'first_name' : first_name,
      'last_name' : last_name
    }), 200
  
  except Exception as e:
    print('Error updating name', e)
    return jsonify({
      'error' : 'Internal server error',
      'details' : str(e)
    }), 500

@user_bp.route('/user/update-email', methods=['PUT'])
def update_email():
  try:
    user_id, error_response, status_code = authorize_user()
    if error_response:
      return error_response, status_code
    
    data = request.get_json()
    if not data or not all(key in data for key in ['email']):
      return jsonify({'message': 'Missing data: email'}), 400
    
    email = data.get('email')

    supabase.table('users').update({
      'email' : email,
    }).eq('id', user_id).execute()

    return jsonify ({
      'message' : 'Email updated successfully',
      'email' : email
    }), 200
  
  except Exception as e:
    print('Error updating email', e)
    return jsonify({
      'error' : 'Internal server error',
      'details' : str(e)
    }), 500

@user_bp.route('/user/set-preference', methods=['POST'])
def set_preference():

  data = request.get_json()
  if not data or not all(key in data for key in ['diet_restriction','food_preference', 'id']):
    return jsonify({'message': 'Missing preference data'}), 400
  user_id = data.get('id')
  dietary_restrictions = data.get('diet_restriction')
  food_preferences = data.get('food_preference')
  print(user_id)
  print(dietary_restrictions)

  authorize_user()

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
  
@user_bp.route('/user/dietary-restrictions', methods=['PUT'])
def update_dietary_restrictions():
  try: 
    user_id, error_response, status_code = authorize_user()
    if error_response:
      return error_response, status_code
    
    data = request.get_json()
    new_restrictions = data.get('dietary_restrictions')

    if not isinstance(new_restrictions, list):
      return jsonify({'error' : 'dietary_restrictions must be an array of strings.'}), 400
    
    user_response = (
      supabase.table('users')
      .select('dietary_restrictions')
      .eq('id', user_id)
      .single()
      .execute()
    )

    cur_restrictions = user_response.data.get('dietary_restrictions') or []
    updated_restrictions = list(set(cur_restrictions + new_restrictions))

    supabase.table('users').update({
      'dietary_restrictions' : updated_restrictions
    }).eq('id', user_id).execute()

    return jsonify ({
      'message' : 'Dietary restrictions updated successfully.',
      'updated_restrictions' : new_restrictions
    }), 200
  
  except Exception as e:
    print('Error updating dietary restrictions', e)
    return jsonify({
      'error' : 'Internal server error',
      'details' : str(e)
    }), 500
  
@user_bp.route('/user/dietary-restrictions', methods=['GET'])
def get_dietary_restrictions():

  try:
    user_id, error_response, status_code = authorize_user()
    if error_response:
      return error_response, status_code
    
    response = (
      supabase.table('users')
      .select('dietary_restrictions')
      .eq('id', user_id)
      .single()
      .execute()
    )

    if not response.data:
      return jsonify({'message' : 'User not found.'}), 404
    
    restrictions = response.data.get('dietary_restrictions') or []

    return jsonify({
      'user_id' : user_id,
      'dietary_restrictions' : restrictions
    }), 200
  
  except Exception as e:
      print('Error fetching dietary restrictions: ', e)
      return jsonify({
        'error' : 'Internal Server Error',
        'details' : str(e)
      })
  
@user_bp.route('/user/collections/create', methods=['POST'])
def create_collection():
  try:
    user_id, error_response, status_code = authorize_user()
    if error_response:
      return error_response, status_code
    
    data = request.get_json()
    title = data.get('title')
    description = data.get('description', '')

    if not data or not title:
      return jsonify({'error' : 'title of collection is required.'}), 400
    
    response = (
      supabase.table('collections')
      .insert({'user_id': user_id, 'title': title, 'description': description})
      .execute()
    )

    return jsonify({'message' : 'Collection created successfully!', 'collection_id' : response.data[0]}), 201

  except Exception as e:
    print('Error creating collection', e)
    return jsonify({
      'error' : 'Internal server error',
      'details' : str(e)
    }), 500
  
@user_bp.route('/user/collections/add-recipe', methods=['POST'])
def add_recipe_to_collection():
  try:
    user_id, error_response, status_code = authorize_user()
    if error_response:
      return error_response, status_code
    
    data = request.get_json()
    collection_id = data.get('collection_id')
    recipe_id = data.get('recipe_id')

    if not collection_id or not recipe_id:
      return jsonify({'error' : 'collection_id and recipe_id are required.'}), 400
    
    response = (
      supabase.table('collection_recipes')
      .insert({'collection_id' : collection_id, 'recipe_id' : recipe_id})
      .execute()
    )

    return jsonify({"message": "Recipe added to collection", 'recipe_id' : recipe_id}), 200

  except Exception as e:
    print('Error adding recipe to collection', e)
    return jsonify({
      'error' : 'Internal server error',
      'details' : str(e)
    }), 500
  
@user_bp.route('/collections/remove-recipe', methods=['DELETE'])
def remove_recipe_from_collection():
  try:
    user_id, error_response, status_code = authorize_user()
    if error_response:
      return error_response, status_code
    
    data = request.get_json()
    collection_id = data.get('collection_id')
    recipe_id = data.get('recipe_id')

    if not collection_id or not recipe_id:
      return jsonify({'error' : 'collection_id and recipe_id are required.'}), 400
    
    response = (
      supabase.table('collection_recipes')
      .delete()
      .eq('collection_id', collection_id)
      .eq('recipe_id', recipe_id)
      .execute()
    )

    return jsonify({"message": "Recipe removed from collection", 'recipe_id' : recipe_id}), 200
    
  except Exception as e:
    print('Error removing recipe from collection', e)
    return jsonify({
      'error' : 'Internal server error',
      'details' : str(e)
    }), 500
  
@user_bp.route('/collections', methods=['GET'])
def get_user_collections():
  try:
    user_id, error_response, status_code = authorize_user()
    if error_response:
      return error_response, status_code

    response = (
        supabase.table('collections')
        .select('*, collection_recipes(recipe_id, recipes(id, title, prep_time, cook_time, image_url))')
        .eq('user_id', user_id)
        .execute()
    )

    if not response.data:
      return jsonify({"message": "No collections found.", "collections": []}), 200

    formatted_collections = []
    for collection in response.data:
      recipes = []
      for entry in collection.get("collection_recipes", []):
        recipe = entry.get("recipes")
        if recipe:
          recipes.append({
            "recipe_id": recipe["id"],
            "title": recipe["title"],
            "prep_time": recipe.get("prep_time"),
            "cook_time": recipe.get("cook_time"),
            "image_url": recipe.get("image_url")
          })
            
        formatted_collections.append({
          "collection_id": collection["id"],
          "name": collection["name"],
          "description": collection.get("description"),
          "created_at": collection.get("created_at"),
          "recipes": recipes
        })
        
    return jsonify({"collections": formatted_collections}), 200
    
  except Exception as e:
    print('Error retrieving user collections', e)
    return jsonify({
      'error' : 'Internal server error',
      'details' : str(e)
    }), 500
  
@user_bp.route('/collections/delete', methods=['DELETE'])
def delete_collection():
  try:
    user_id, error_response, status_code = authorize_user()
    if error_response:
      return error_response, status_code
    
    data = request.get_json()
    collection_id = data.get('collection_id')

    response = (
        supabase.table('collections')
        .delete()
        .eq('id', collection_id)
        .execute()
    )

    return jsonify({'message': 'Collection deleted successfully', 'collection_id' : collection_id}), 200
    
  except Exception as e:
    print('Error retrieving user collections', e)
    return jsonify({
      'error' : 'Internal server error',
      'details' : str(e)
    }), 500 