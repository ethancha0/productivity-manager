from flask import Flask, request, jsonify, session, redirect, url_for, render_template
from flask_cors import CORS # allows React to talk to Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta

from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
#CORS(app)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173","http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"]}}, supports_credentials=True)

app.secret_key = "hello"
app.permanent_session_lifetime = timedelta(days = 30) #login session duration

app.config.update(
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=False,   # True when you serve HTTPS
)


#setup SQLALchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Users(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100), nullable=False, unique=True, index=True)
    email = db.Column(db.String(100), unique=True, index=True, nullable=False)
    password = db.Column(db.String(255))
    time= db.Column(db.Integer, default = 0, nullable = False)
    weeklyGoal = db.Column(db.Integer, default = 0, nullable = False)

    def __init__(self, name, email, password, time):
        self.name = name
        self.email = email
        self.password = password
        self.time = time


@app.route("/")
def home():
    return "hi"

@app.get("/stats")
def stats():
    sessionName = session.get("name")
    if not sessionName:
        return jsonify({"error": "not logged in - stats"}), 401
    
    #find user in DB 
    user = Users.query.filter_by(name=sessionName).first()
    if not user:
        return jsonify({"error": "unable to find user in DB"}), 404
    
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "weeklyGoal": user.weeklyGoal,
    })


@app.route("/submit_accountinfo", methods=["POST", "OPTIONS"]) #app.post, not app.route
def submit_accountinfo():
    if request.method == "OPTIONS":
        # OK preflight
        return ("", 204)

    try:
        data = request.get_json(force=True) # parse JSON 
        print("received account data", data)

        # Check if user already exists
        existing_user = Users.query.filter_by(email=data["email"]).first()
        if existing_user:
            print(f"User with email {data['email']} already exists")
            return jsonify({"error": "User with this email already exists"}), 400

        #save to DB
        pw_hash = generate_password_hash(data["password"]) #hash password
        user = Users(name=data["userName"], email=data["email"], password=pw_hash, time=0)


        #try creating a session 
      #  session.permanent = True
       # session["user"] = {"id": 123, "email": data["email"], "name": "Ethan"}

        db.session.add(user)
        db.session.commit()
        print("User saved successfully")

        return jsonify({"message": "saved account data"}), 200
    except Exception as e:
        print(f"Error saving account: {e}")
        db.session.rollback()
        return jsonify({"error": "Failed to save account data"}), 500


@app.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    username = (data.get("userName") or "").strip()
    pw = data.get("password") or ""

    user = Users.query.filter_by(name=username).first() #check if user in DB 
    if not user or not check_password_hash(user.password, pw): #check if password matches user
        return jsonify({"error": "invalid credentials"}), 401

    session.permanent = True
    session["name"] = user.name   # <-- key used by /welcome
    return jsonify({"message": "logged in"}), 200

    





@app.route("/submit_weeklygoal", methods=["POST", "OPTIONS"])
def submit_weeklygoal():
    if request.method == "OPTIONS":
        return "", 200
    try:
        if "name" not in session:
            print("DEBUG: No user in session!")
            return jsonify({"error": "not logged in"}), 401

        data = request.get_json(force=True) # parse JSON

        weeklyGoal = (data.get("weeklyGoal") or "").strip()

       # user = Users.query.filter_by(name=username).first()
       # if not user:
        #    return jsonify({"error": "unable to find user"}), 404

        #get user name from session 
        sessionName = session.get("name")
        if not sessionName:
            return jsonify({"error": "cannot find user in session"}), 404
        #query DB for user
        user = Users.query.filter_by(name=sessionName).first()
        if not user:
            return jsonify({"error": "error finding user in database"}), 404
        
        #found user, update goal
        user.weeklyGoal = weeklyGoal

        db.session.commit()
        print("weekly goal saved: ", data["weeklyGoal"])
        return jsonify({"message": "weekly goal saved"}), 200
        
    
    except Exception as e:
        print(f"error saving weekly goal: {e}")
        db.session.rollback()
        return jsonify({"error": "failed to save weekly goal"})



if __name__ == "__main__":

    with app.app_context():
        db.create_all()
    app.run(host="127.0.0.1", port=5000, debug=True)
