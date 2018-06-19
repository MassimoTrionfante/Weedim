import os

from flask import Flask, g, flash, request, render_template, send_from_directory
import pymongo
import random
import json
from pymongo import MongoClient
from json import dump

# Method to get the DB, here we store all the sessions
def get_db():
  client = MongoClient('localhost',27017)
  db = client.weedim
  return db

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='xXx_trustedWebMidiMaker_xXx'
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route('/favicon.ico')
    def favicon():
        return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

    @app.route('/',methods=["GET","POST"])
    def mainPage():
        #If user inputted a session number...
        if request.method=="POST":
            error = None
            db = get_db()
            inputtedSesNum = int(request.form['sessionNumber'])
            mioDoc = db.weedim.find_one({'sesnum':inputtedSesNum}) #...check if it exists in the database
            if mioDoc is None:
              error = "Session not found!"
              flash(error)
            else:
              #Collect the JSONs
              g.notes = json.loads(mioDoc["notes"]) # We can access to each elem of the array with a for cycle (for elem in g.notes: print(elem) )
              g.delays = json.loads(mioDoc["delays"])
              
        return render_template('weedim.html')

    #This method stores a music inside our DB
    @app.route('/saveSession/<notes>/<delays>',methods=["POST"])
    def saveSession(notes,delays):
      sessionNum = random.randint(0,9999999999) # Generate a random int
      g.notes = json.loads(notes)  # Store notes and delays
      g.delays = json.loads(delays)# in the global object g

      db = get_db() # Add the new document in our database
      db.weedim.insert({"sesnum":sessionNum,"notes":notes,"delays":delays})
      return str(sessionNum) # Return the session number for our android app to use

    return app

