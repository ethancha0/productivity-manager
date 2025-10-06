from flask import Flask, request, jsonify, session, redirect, url_for, render_template
from flask_cors import CORS # allows React to talk to Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta

app = Flask(__name__)
CORS(app)

app.secret_key = "hello"
app.permanent_session_lifetime = timedelta(minutes = 5) #login session duration


#setup SQLALchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Users(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    day_session = db.Column(db.Integer)

    def __init__(self, name, email, day_session):
        self.name = name
        self.email = email
        self.day_session = day_session


@app.route("/")
def home():
    return "hi"


#store the data 




@app.post("/api/log-study")
def log_study():
    data = request.get_json() # parse JSON body
    print("recieved from react", data)
    
    #create guest user
    
    
    db.session.commit()

    return jsonify({"message": "Session logged"})



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




if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)