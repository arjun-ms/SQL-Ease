from httpx_oauth.clients.google import GoogleOAuth2
from dotenv import load_dotenv
import os
import streamlit as st
import asyncio

load_dotenv('.env')

CLIENT_ID = os.environ['CLIENT_ID']
CLIENT_SECRET = os.environ['CLIENT_SECRET']
REDIRECT_URI = os.environ['REDIRECT_URI']

client = GoogleOAuth2(CLIENT_ID, CLIENT_SECRET)

async def get_authorization_url(client,REDIRECT_URI):
    return await client.get_authorization_url(REDIRECT_URI,scope=["profile","email"])

async def get_access_token(client,REDIRECT_URI,code):
    token = await client.get_access_token(code,REDIRECT_URI)
    return token 

async def get_email(client,token):
    user_id,user_email = await client.get_id_email(token)
    return user_id,user_email

def redirect_login():
    authoirzation_url = asyncio.run(get_authorization_url(client,REDIRECT_URI))
    button = f'''<a target="_self" href="{authoirzation_url}">
        <button>
            Login
        </button>
    </a>
    '''
    return button

def display_user():
    code = st.experimental_get_query_params()['code']
    token = asyncio.run(get_access_token(client,REDIRECT_URI,code))
    user_id,user_email = asyncio.run(get_email(client,token['access_token']))
    st.write(f"You're logged in as {user_email} and id is {user_id}")
    
