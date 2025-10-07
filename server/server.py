from flask import Flask, request, jsonify, session, redirect, url_for, render_template
from flask_cors import CORS # allows React to talk to Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta

from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
#CORS(app)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173","http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"]}}, supports_credentials=True)

app.secret_key = "hello"
app.permanent_session_lifetime = timedelta(minutes = 5) #login session duration


#setup SQLALchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Users(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, index=True, nullable=False)
    password = db.Column(db.String(255))
    time= db.Column(db.Integer, default = 0, nullable = False)

    def __init__(self, name, email, password, time):
        self.name = name
        self.email = email
        self.password = password
        self.time = time


@app.route("/")
def home():
    return "hi"




@app.route("/login", methods = ["POST", "GET"])
def login():
    if request.method == "POST":
        session.permanent = True
        username = request.form.get("nm", "").strip()
        #lookup user, verify password, etc.
        session["user"] = username
        return redirect(url_for("welcome"))
    else:
        return render_template("login.html")
    

@app.route("/welcome")
def welcome():
    if "user" in session: 
        return f'Welcome: {session["user"]}'
    return "Not logged in foo"


@app.post("/submit_accountinfo") #app.post, not app.route
def submit_accountinfo():
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

        db.session.add(user)
        db.session.commit()
        print("User saved successfully")

        return jsonify({"message": "saved account data"}), 200
    except Exception as e:
        print(f"Error saving account: {e}")
        db.session.rollback()
        return jsonify({"error": "Failed to save account data"}), 500




if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)