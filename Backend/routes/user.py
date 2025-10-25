from flask import Blueprint, request, jsonify
from utils.auth import authorize_user
from utils.supabase import supabase
from postgrest.exceptions import APIError as AuthApiError

user_bp = Blueprint('main', __name__)
@user_bp.route("/create_user", methods=["POST"])
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

@user_bp.route('/user/update_diet', methods=['PUT'])
def update_dietary_restrictions():
  try: 
    user_id, error_response, status_code = authorize_user()
    if error_response:
      return error_response, status_code
    
    data = request.get_json()
    new_restrictions = data.get('dietary_restrictions')

    if not isinstance(new_restrictions, list):
      return jsonify({'error' : 'dietary_restrictions must be an array of strings.'}), 400
    
    response = (
      supabase.table('users')
      .update({'dietary_restrictions' : new_restrictions})
      .eq('id', user_id)
      .execute()
    )

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

@user_bp.route('/set-preference', methods=['POST'])
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