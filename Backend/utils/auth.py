from postgrest.exceptions import APIError as AuthApiError
from utils.supabase import supabase
from flask import request, jsonify
def authorize_user():
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

  