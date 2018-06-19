# Weedim, your trusted web midi maker

This small web service was designed as project for an exam.
Its aim is to give to users the ability to create simple mono-channel midis, with an user interface that was aimed to be as
simple as possible.
Despite being rather simple (aside the tiny bit of Python for the Flask app setup, it's full Javascript), it offers the basic functionalities required to both be a sort of "virtual web-based piano", and 
to be a service which is able to record and play single rows of notes.

The website uses some of the MIDI.js source code from mudcube. Many thanks to him for sharing his awesome library.
If you are interested, link of his repo here: https://github.com/mudcube/MIDI.js/

# How to run Weedim on your device

Clone the whole repository in your local folder, and, after installing Flask, execute the batch "go.sh".
Said bash will set the FLASK_APP's name and the FLASK_ENV to "development", and it'll run, by default, on
your localhost address, port 5000 (you could eventually set them manually if you wish).
Once it's running, visit http://localhost:5000 or http://0.0.0.0:5000 from your device to access to it.
