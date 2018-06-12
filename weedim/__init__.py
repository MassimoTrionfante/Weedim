import os

from flask import Flask, render_template, g

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
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

    @app.route('/')
    def mainPage():
        return render_template('weedim.html')

    @app.route('/output.mid')
    def getMidi():
       return bytearray.fromhex("4D 54 68 64 00 00 00 06 00 00 00 01 01 E0 4D 54 72 6B 00 00 00 38 00 FF 03 15 47 65 6E 65 72 61 74 65 64 20 66 72 6F 6D 20 57 65 65 64 69 6D 00 FF 58 04 04 02 18 08 00 FF 51 03 08 7A 23 00 C0 01 00 90 60 7F 8F 05 80 60 00 00 FF 2F 00")

    return app

