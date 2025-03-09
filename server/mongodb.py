from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# PARAMS
uri = "mongodb+srv://mramirez282:hackmerced10@hackmerced10.xqw2k.mongodb.net/?retryWrites=true&w=majority&appName=hackmerced10"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

def get_database(db_name):
    return client[db_name]