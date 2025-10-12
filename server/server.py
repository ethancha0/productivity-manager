from flask import Flask, request, jsonify, session, Response, abort
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta
import os, requests
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.url_map.strict_slashes = False

# CORS origins (local + prod) 
allowed_origins = [
    "http://localhost:5173", "http://127.0.0.1:5173",
    "http://localhost:3000", "http://127.0.0.1:3000",
]
# add prod from env (optional)
if os.environ.get("FRONTEND_URL"):
    allowed_origins.append(os.environ["FRONTEND_URL"])
if os.environ.get("VERCEL_URL"):
    allowed_origins.append(f"https://{os.environ['VERCEL_URL']}")
# hard-code Vercel URL too (safer)
allowed_origins.append("https://productivity-manager-nine.vercel.app")

CORS(
    app,
    resources={r"/*": {"origins": allowed_origins}},
    supports_credentials=True,
    methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

app.secret_key = os.environ.get("ETHANSKEY", "dev-secret")
app.permanent_session_lifetime = timedelta(days=30)
app.config.update(
    SESSION_COOKIE_SAMESITE="None",
    SESSION_COOKIE_SECURE=True,    # must be True in prod HTTPS
)

# ----- DB config (single place, BEFORE db = SQLAlchemy(app)) -----
db_url = os.environ.get("DATABASE_URL")
if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)
app.config["SQLALCHEMY_DATABASE_URI"] = db_url or "sqlite:///users.sqlite3"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# Models
class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True, index=True)
    email = db.Column(db.String(100), unique=True, index=True, nullable=False)
    password = db.Column(db.String(255))
    time = db.Column(db.Integer, default=0, nullable=False)
    weeklyGoal = db.Column(db.Integer, default=0, nullable=False)

# Routes 
@app.route("/")
def home():
    return "hi"

@app.get("/stats")
def stats():
    sessionName = session.get("name")
    if not sessionName:
        return jsonify({"error": "not logged in - stats"}), 401
    user = Users.query.filter_by(name=sessionName).first()
    if not user:
        return jsonify({"error": "unable to find user in DB"}), 404
    return jsonify({"id": user.id, "name": user.name, "email": user.email, "weeklyGoal": user.weeklyGoal})

@app.route("/submit_accountinfo", methods=["POST", "OPTIONS"])
def submit_accountinfo():
    if request.method == "OPTIONS":
        return ("", 204)
    try:
        data = request.get_json(force=True)
        if Users.query.filter_by(email=data["email"]).first():
            return jsonify({"error": "User with this email already exists"}), 400
        pw_hash = generate_password_hash(data["password"])
        user = Users(name=data["userName"], email=data["email"], password=pw_hash, time=0)
        db.session.add(user)
        db.session.commit()

        # If  want signup => logged in:
         session.permanent = True
         session["name"] = user.name

        return jsonify({"message": "saved account data"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to save account data"}), 500

@app.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    username = (data.get("userName") or "").strip()
    pw = data.get("password") or ""
    user = Users.query.filter_by(name=username).first()
    if not user or not check_password_hash(user.password, pw):
        return jsonify({"error": "invalid credentials"}), 401
    session.permanent = True
    session["name"] = user.name
    return jsonify({"message": "logged in"}), 200

@app.route("/submit_weeklygoal", methods=["POST", "OPTIONS"])
def submit_weeklygoal():
    if request.method == "OPTIONS":
        return ("", 204)
    try:
        if "name" not in session:
            return jsonify({"error": "not logged in"}), 401
        data = request.get_json(force=True)
        weeklyGoal = int(data.get("weeklyGoal", 0))   # <-- fixed cast
        user = Users.query.filter_by(name=session["name"]).first()
        if not user:
            return jsonify({"error": "error finding user in database"}), 404
        user.weeklyGoal = weeklyGoal
        db.session.commit()
        return jsonify({"message": "weekly goal saved"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "failed to save weekly goal"}), 500


# ----- ICS passthrough (CORS-safe) -----
ICS_URL = "https://calendar.google.com/calendar/ical/ethantubegames%40gmail.com/private-0d95d039e66e1ebc49701d179fe3e04e/basic.ics"

@app.get("/api/test-ics")
def test_ics():
    try:
        r = requests.get(ICS_URL, timeout=10)
        r.raise_for_status()
    except requests.RequestException as e:
        abort(502, f"Upstream ICS fetch failed: {e}")
    resp = Response(r.content, mimetype="text/calendar; charset=utf-8")
    origin = request.headers.get("Origin")
    if origin in allowed_origins:
        resp.headers["Access-Control-Allow-Origin"] = origin
        resp.headers["Access-Control-Allow-Credentials"] = "true"
        resp.headers["Vary"] = "Origin"
    return resp

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="127.0.0.1", port=5000, debug=True)
