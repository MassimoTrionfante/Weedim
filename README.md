# Weedim, your trusted web midi maker

This small web service was designed as project for an exam.
Its aim is to give to users the ability to create simple mono-channel midis, with an user interface that was aimed to be as
simple as possible.
Despite being rather simple, with main support from Javascript, HTML and CSS, it offers the basic functionalities required
to both be a sort of "virtual web-based piano", and to be a service which is able to record and play single rows of notes.

The website uses some of the MIDI.js source code from mudcube. Many thanks to him for sharing his awesome library.
If you are interested, link of his repo here: https://github.com/mudcube/MIDI.js/

# How to run Weedim on your device

Clone the whole repository in your local folder, and, after installing Flask1.0.2, execute the batch "go.sh".
Said bash will set both the FLASK_APP and FLASK_ENV variables to the app's config names, and it'll run, by default, on
your localhost address, port 5000.
Once it's running, visit http://localhost:5000 or http://0.0.0.0:5000 from your device to access to it.

# Known bugs

The website layout was designed on a 1920x1080 screen. Despite it's supposed to work on every device, it's discouraged to use
smaller screens, as visual bugs (such as misalignment of notes) could happen.