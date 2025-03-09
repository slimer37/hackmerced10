import json
import requests
from flask import Flask, request, jsonify
from functools import wraps
import jwt
from jwt.algorithms import RSAAlgorithm

from ai import get_ai_response

AUTH0_DOMAIN = "dev-g764byi3mgr8fsp2.us.auth0.com"
API_AUDIENCE = "https://dev.slimer37.me"
ALGORITHMS = ["RS256"]

app = Flask(__name__)

def get_auth0_public_key():
    """Fetch and cache Auth0 public key for verifying tokens."""
    jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
    jwks = requests.get(jwks_url).json()
    return {key["kid"]: RSAAlgorithm.from_jwk(json.dumps(key)) for key in jwks["keys"]}

PUBLIC_KEYS = get_auth0_public_key()

def verify_jwt(token):
    """Decode and verify an Auth0 access token."""
    try:
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = PUBLIC_KEYS.get(unverified_header["kid"])
        if not rsa_key:
            raise Exception("Invalid Key ID")

        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=ALGORITHMS,
            audience=API_AUDIENCE,
            issuer=f"https://{AUTH0_DOMAIN}/",
        )
        return payload  # The decoded payload contains the user's information
    except jwt.ExpiredSignatureError:
        return {"error": "Token expired"}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}

def requires_auth(f):
    """Decorator to protect routes with Auth0 authentication."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", None)
        if not auth_header:
            return jsonify({"error": "Missing authorization header"}), 401

        parts = auth_header.split()
        if parts[0].lower() != "bearer" or len(parts) != 2:
            return jsonify({"error": "Invalid authorization header"}), 401

        token = parts[1]
        payload = verify_jwt(token)
        if "error" in payload:
            return jsonify(payload), 401

        request.user = payload  # Attach user data to the request object
        return f(*args, **kwargs)

    return decorated

@app.route("/api/myid", methods=["GET"])
@requires_auth
def myid():
    """Example route that requires authentication."""
    user_id = request.user.get("sub")  # Auth0 User ID (sub claim)
    print(user_id + " requested")
    return jsonify({"user_id": user_id})

@app.route("/api/ai-msg", methods=["POST"])
@requires_auth
def aimsg():
    user_id = request.user.get("sub")  # Auth0 User ID (sub claim)
    data = request.get_json()
    user_message = data.get("message", "")

    print(data)

    if data is None:
        return jsonify({"error": "Invalid JSON payload"}), 400
    
    if user_message == "":
        return jsonify({"error": "Message cannot be empty."}), 400
    
    response = get_ai_response(user_message)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
