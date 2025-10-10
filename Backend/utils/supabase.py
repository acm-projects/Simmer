from supabase import create_client, Client
from dotenv import load_dotenv
import os
def use_supabase():
  load_dotenv()
  supa_url: str = os.environ.get("SUPABASE_URL")
  supa_key: str = os.environ.get("SUPABASE_KEY")


  return create_client(supabase_url=supa_url, supabase_key=supa_key)
supabase: Client= use_supabase()