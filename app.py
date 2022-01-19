# IMPORTING THE MODULES
import os
import random
from flask import Flask, render_template, redirect, url_for, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import check_password_hash, generate_password_hash
import json

from werkzeug.utils import header_property

# INITIALIZING THE APP
app = Flask(__name__)
app.config["SECRET_KEY"] = "jkshdfkafkanvjjgbajlgbsldfgjlfngbjhlsbfgjsbgjlsbdfgjklsbdfgjklsjklgjkl"

# CONFIGURING THE DEVELOPMENT AND PRODUCTION ENVIRONMENT SETTINGS
ENV = "dev"

if ENV == "dev":
    app.debug = True
    app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:12345@localhost/dev-uncertainty-db"
else:
    # the postgres link here is the heroku deployment link

    # as the postgres link might be changed by heroku, it is better to use the os.environ to extract the DATABASE_URL
    DATABASE_URL = os.environ['DATABASE_URL']
    # os.environ() gives the link with "postgres://blahblahblah" so replacing it with "postgresql://blahblahblah"
    db_url_split = DATABASE_URL.split("://")
    db_url_split[0] = db_url_split[0] + "ql"
    DATABASE_URL = "://".join(db_url_split)

    # configuring the app's DATABASE URI using the DATABASE_URL formed above
    app.config["SQLALCHEMY_DATABASE_URI"] =  DATABASE_URL

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# CREATING A DATABASE OBJECT
db = SQLAlchemy(app)

# SETTING THE DEFAULT VIEW AS THE LOGIN VIEW (which needs to be changed to index in this case)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "admin_login"

# DATABASE MODELS

# db model for userdata
class Userdata(db.Model):
    __tablename__ = "userdata"

    # id is just the serial number and is used as a primary key
    id = db.Column(db.Integer, primary_key = True)
    userId = db.Column(db.String(75), unique = True)
    gender = db.Column(db.String(6))
    age = db.Column(db.String(3))
    trainingData = db.Column(db.String())
    gameData = db.Column(db.String())
    userAnswers = db.Column(db.String(75))
    
    # @todo put length and uniqueness constraints on the submission code
    submissionCode = db.Column(db.String(), unique = True)

    def __init__(self, userId, gender, age, trainingData, gameData, userAnswers, submissionCode):
        self.userId = userId
        self.gender = gender
        self.age = age
        self.trainingData = trainingData
        self.gameData = gameData
        self.userAnswers = userAnswers
        self.submissionCode = submissionCode

# db model for admin logins
class Admin(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    username = db.Column(db.String(50), unique = True)
    password = db.Column(db.String(90))

    def __init__(self, username, password):
        self.username = username
        self.password = password

# method to load the user upon input of successful login credentials
@login_manager.user_loader
def load_user(admin_id):
    # this is used for user login but not for admin login
    if Admin.query.get(int(admin_id)):
        return Admin.query.get(int(admin_id))

@app.route("/admin_login", methods = ['GET', 'POST'])
def admin_login():
    if current_user.is_authenticated:
        return redirect(url_for("admin_dashboard"))
    
    if request.method == 'POST':
        admin_username = request.form['username']
        admin_password = request.form['password']

        admin = Admin.query.filter_by(username = admin_username).first()

        if admin:
            if check_password_hash(admin.password, admin_password):
                login_user(admin, remember = True)
                return redirect(url_for("admin_dashboard"))
            else:
                return render_template("admin_login.html", page_title = "Admin Login", header_text = "Admin Login", message = "Incorrect password")
        else:
            return render_template("admin_login.html", page_title = "Admin Login", header_text = "Admin Login", message = "Incorrect username")

    return render_template("admin_login.html", page_title = "Admin Login", header_text = "Uncertainty Experiment")

# create an admin page for controlling data visualization
@app.route("/admin_dashboard")
@login_required
def admin_dashboard():
    # submissions count
    no_of_submissions = Userdata.query.count()

    # male participants
    male_count = Userdata.query.filter(Userdata.gender == "Male").count()

    # no of female participants
    female_count = Userdata.query.filter(Userdata.gender == "Female").count()

    # no of other participants
    other_count = Userdata.query.filter(Userdata.gender == "Other").count()
    
    # all the data
    rows = Userdata.query.all()

    return render_template("admin_dashboard.html", page_title = "Admin", header_text = "Admin Dashboard", count = no_of_submissions, userdata = rows, male_count = male_count, female_count = female_count, other_count = other_count)


@app.route("/admin_data_download")
@login_required
def admin_data_download():
    # all the data
    if request.method == "GET":
        # getting all the user data from the database
        users = Userdata.query.all()

        # forming the result
        result = []
        for each_user in users:
            temp = [each_user.userId, each_user.gender, each_user.age, each_user.trainingData, each_user.gameData, each_user.userAnswers, each_user.submissionCode]
            # temp.append(each_user.userId)
            # temp.append(each_user.gender)
            # temp.append(each_user.age)
            # temp.append(each_user.trainingData)
            # temp.append(each_user.gameData)
            # temp.append(each_user.submissionCode)
            
            # appending the temp array (data that corresponds to one user) into the main array
            result.append(temp)

        # converting array data into json data for sending to the front end
        result = jsonify(result)
        return(result)

    # if the request is not GET request
    return redirect(url_for('admin_dashboard'))

@app.route("/admin_logout")
@login_required
def admin_logout():
    logout_user()
    return redirect(url_for("admin_login"))

# ROUTES
@app.route("/")
@app.route("/index")
def index():
    return render_template("index.html", page_title = "Index", header_text = "Uncertainty Experiment")

@app.route("/consent", methods = ['GET', 'POST'])  
def consent():
    if request.method == "POST":
        userId = request.form['userid']
        gender = request.form['gender']
        age = request.form['age']

        # ALL THE ABOVE FIELDS ARE RETURNED AS STRINGS
        # @todo need to perform some server side or client side data validation checks for the MTurk ID
        
        # ADD TO DATABASE
        if db.session.query(Userdata).filter(Userdata.userId == userId).count() == 0:
            # this means that the current userid does not exist in the database and this is a new user

            # at this point we dont store anything related to this user
            # all the user data is stored in one go when they reach the end of the experiment
            # this block of code only checks if the user is in the database already, if not they will be given access to the other pages

            # instead the data is stored in the database at the very last stage
            return render_template("consent.html", page_title = "Consent", header_text = "Uncertainty Experiment", user_id = userId, user_gender = gender, user_age = age)
        else:
            return redirect(url_for("duplicate", user_id = userId))
    else:
        # this is reached if the request is not of type POST 
        return redirect(url_for("index"))

@app.route("/training")
def training():
    return render_template("training.html", page_title = "Training", header_text = "Training Phase")

@app.route("/game")
def game():
    return render_template("game.html", page_title = "Game", header_text = "Welcome to Uncertainty Experiment")

@app.route("/thankyou", methods = ['GET', 'POST'])
def thankyou():
    if request.method == "POST":
        for key in request.form.keys():
            data = key
        
        fullData = json.loads(data)
        userId = fullData['userId']
        gender = fullData['userGender']
        age = fullData['userAge']
        trainingData = fullData['trainingData']
        gameData = fullData['gameData']
        userAnswers = fullData['userAnswers']
        
        if db.session.query(Userdata).filter(Userdata.userId == userId).count() == 0:
            # entering this if block, means the userId is a new user
            # this if condition double checks if the userId was already present or not

            submissionCode = generateSubmissionCode(userId)
            
            data = Userdata(userId, gender, age, trainingData, gameData, userAnswers, submissionCode)
            db.session.add(data)
            db.session.commit()

        # send the submission code as a response to the AJAX call
        resp_dic = {'submissionCode': str(submissionCode)}
        resp = jsonify(resp_dic)
        # return resp
        return resp
    
    # @todo - check if the current user has completed the study 
    # @todo - generate the submission code and add it to the database and send it to the front end
    # @todo - don't forget to the style the submission code div
    return render_template("thankyou.html", page_title = "Thank you")


# returns a random submission code generated in specific format
def generateSubmissionCode(userId):
    # a random number is chosen between 10000 and 99999 (both bounds are inclusive)
    randomNumber = random.randint(10000, 99999)
    randomCode = "FOWI-" + str(randomNumber) + "-CURTIN"

    # checking if the code is already present in the database or not
    if db.session.query(Userdata).filter(Userdata.submissionCode == randomCode).count() == 0:
        # entering this if block that the randomCode is not present in the database
        return randomCode
    else:
        generateSubmissionCode(userId)


@app.route("/duplicate/<user_id>")
def duplicate(user_id):
    if db.session.query(Userdata).filter(Userdata.userId == user_id).count() == 0:
        # invalid Mturk code
        # for now I am passing this but later I have to create an error page with invalid code
        return redirect(url_for('error'))
    userSubmissionCode = Userdata.query.filter_by(userId = user_id).first().submissionCode
    return render_template("duplicate.html", page_title = "Thanks", user_id = user_id, user_code = userSubmissionCode)


# # INVALID ROUTES - ERROR MESSAGE DISPLAY
# @app.route('/<page_name>')
# def error(page_name):
#     return render_template("error.html", page_title = "Error",  header_text = "Invalid Page")


# detecting 404 (page not found) errors and rendering the error.html template
@app.errorhandler(404)
def page_not_found(e):
    return render_template("error.html", page_title = "Page Not Found", header_text = "404: Page Not Found")

@app.errorhandler(500)
def internal_server_error(e):
    return render_template("error.html", page_title = "Internal Server Error", header_text = "500: Internal Server Error")

# RUNNING THE APP
if __name__ == "__main__":
    app.run()