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
    "http://localhost:5174", "http://127.0.0.1:5174",  # Vite alternate port
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
is_prod = bool(os.environ.get("RENDER")) or os.environ.get("FLASK_ENV") == "production"
app.config.update(
    SESSION_COOKIE_SAMESITE="None" if is_prod else "Lax",
    SESSION_COOKIE_SECURE=True if is_prod else False    # must be True in prod HTTPS
)

# ----- DB config 
db_url = os.environ.get("DATABASE_URL")
if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)
app.config["SQLALCHEMY_DATABASE_URI"] = db_url or "sqlite:///users.sqlite3"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# Models
class Users(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True, index=True)
    email = db.Column(db.String(100), unique=True, index=True, nullable=False)
    password = db.Column(db.String(255))
    time = db.Column(db.Integer, default=0, nullable=False)
    weeklyGoal = db.Column(db.Integer, default=0, nullable=False)

    # relationship to events
    events = db.relationship(
        "Event", 
        back_populates="owner",
        cascade="all, delete-orphan"
    )

class Event(db.Model):
    __tablename__ = "events"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), index=True, nullable=False)
                   
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(100), default="")
    start_at = db.Column(db.String(100), nullable=True)
    end_at = db.Column(db.String(100), nullable=True) # nullable for all day events
    all_day = db.Column(db.Boolean, default=True)
   # color = db.Column(db.String(16), default="")

    owner = db.relationship("Users", back_populates="events")

    

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
    print(session) #debugging
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

@app.route("/submit_new_event", methods=["POST", "OPTIONS"])
def submit_new_event():
    # CORS Preflight
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        # reqired a logged in user 
        user_name = session.get("name")
        if not user_name:
            return jsonify({"error": "user is not logged in "}), 401

        #match user in database
        user = Users.query.filter_by(name=user_name).first()
        if not user:
            return jsonify({"error": "error finding user in database"})

        #retrieve data from react
        data = request.get_json(force=True)

        print("ABOUT TO STORE EVENT: ",data )

        #create temp event to save 
        ev = Event(
            user_id = user.id,
            title = data.get("draftTitle"),
            description = data.get("draftDescription"),
            all_day = bool(data.get("draftAllDay") or False),
            start_at = data.get("startISO"),
            end_at = data.get("endISO"),
           # all_day = bool(data.get("draftEndTime") or False)
        )

        if not ev.title:
            return jsonify({"error": "missing title "})
        
        #adds + commits to database
        db.session.add(ev)
        db.session.commit()

        print(ev)
        return jsonify({"message": "successfully added event: "})
    
    except Exception as e:
        return jsonify({"error" : "error saving event data"})
    

   



# ----- CALENDAR EVENTS
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

# User created calendar events
@app.get("/api/events")
def events():
    #print('sending hardcoded event data')
    """  return jsonify([{
        "id" : 99,
        "title" : "HARDCODED",
        "start" : "2025-10-04T06:00:00",
        "end" : "2025-10-04T07:00:00",
        "allDay" : False,
    }])
    """
    try:
        #debug session info
        print(f"Session data: ", session)
        print(f"Session name: {session.get('name')}")
        
         # reqired a logged in user 
        user_name = session.get("name")
        if not user_name:
            print("didn't find user")
            return jsonify({"error": "user is not logged in "}), 401

        #match user in database
        user = Users.query.filter_by(name=user_name).first()
        if not user:
            return jsonify({"error": "error finding user in database"})



        #match user to event DB 
        rows = Event.query.filter_by(user_id=user.id).order_by(Event.start_at.asc()).all()

        #loop through all events in user's DB 
        print("looping through event data")
        allEvents = []
        for ev in rows:
            allEvents.append(
                {
                    "id" : ev.id,
                    "title" : ev.title,
                    "start" : ev.start_at,
                    "end" : ev.end_at or None,
                    "allDay" : bool(ev.all_day),
                }
            )
       # print("all events: ", allEvents)
        return jsonify(allEvents), 200
    except Exception as e:
        print(f"Error fetching events: {e}")
        return jsonify([]), 200






if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="127.0.0.1", port=5000, debug=True)


