// Weedim.js
// Created and documented by Massimo Trionfante

// Beginning Jingle (this also tells you it finished loading)
window.onload=function(){
MIDI.loadPlugin({
  soundfontUrl:"static/midijs/soundfont/",  // Import the soundfont folder
  instrument: "acoustic_grand_piano",       // Import the instrument
  onprogress: function(state, progress) {   // Show progress on console
    console.log(state, progress);
  },
  onsuccess: function(){                   // Once it loaded succesfully...

    a = document.getElementById("loadclear") //... remove the loading screen...
    a.style.display="none";

    var delay=0; // ...set some variables used for the beginning jingle...
    var note=50; //
    var velocity=127;
    MIDI.setVolume(0,127);
    MIDI.noteOn(0, 55+12, velocity, 0.50); // ...and play the jingle!
    MIDI.noteOn(0, 57+12, velocity, 0.60);
    MIDI.noteOn(0, 59+12, velocity, 0.70);
    MIDI.noteOn(0, 60+12, velocity, 0.80);
  }
  });
};

document.oncontextmenu = function() { return false; } // Disable right-click menu

// GLOBAL VARIABLES -------------------------------------------
// (note that these are now inside the HTML, due to some Jinja stuff added)

//var music = [0]; // Here we store all the notes of the recorded music
//var lengths = [0,0]; // Here we store all the lengths (used as delay in MIDI.noteOn)
                     // Note that an extra value is needed for Midi.js to playback properly
//var numOfNotes = 0; // Counter that says how many notes our channel has
//var whereNextNote = 32; // Variable used for GFX, it says where to place next note horizontally
//var isRec = 0; // Toggle that tells if interface is in rec. mode


// FUNCTIONS COMING BELOW! ----------------------------------

// Play note at the click of the piano notes on the side
function playNote(elemento)
{
  var nota = elemento.id; // Id of element contains the value of the note to play
  MIDI.noteOn(0,nota,127,0); // Play the note...
  MIDI.noteOff(0,nota,1);  // ...then shut it one unit of time later (not sure if it's in seconds, probably it is)
}

// Function that adds a note on the notes sheet by pressing the piano buttons
function addNote(nota, event, isOnPiano)
{
  if(isRec){ // Go trough this only if REC. mode is enabled
    if (whereNextNote>38500)
    {
      alert("You exceeded the max size of the piano roll. Delete some note to add a new one.");
    }
    else
    {
      var noteSheet = document.getElementById("corpoPrincipale"); // Get the piano roll
      var nuovaNota = document.createElement("span");  // Create a new note element
      var noteLength = document.getElementById("noteLength").innerHTML; // Get the length from the span that contains the numerical length of note

      // Show the note graphically
      if (nota.id==0) // ID = 0 -> User pressed the red box that adds a rest, rather than a note...
      {
        nuovaNota.className = "rest";
        nuovaNota.style.top = 0;      // ....so yeah, add the note, put it vertically on top, so that it covers all the piano roll
      }
      else // If it wasn't a rest, then add a true note!
      {
        nuovaNota.className = "nota";
        if (!isOnPiano) // Place the note on the piano roll, but behave differently, depending on where user clicked the note from
        {
          nuovaNota.style.top = nota.offsetTop  + "px"; // This is the .top value of new note, if user clicked on the piano roll note...
        }
        else
        {
          var riga = document.getElementById(nota.id);
          nuovaNota.style.top = riga.offsetTop + "px";  // ...while this is the .top value if user clicks on the horizontal piano.
        }

        if (noteLength != 32) // Since 32th notes are tiny, I have no room to add text inside them...
        {
          nuovaNota.innerHTML = nota.innerHTML; // ...so, write note's value and octave IF it's not a 32th.
        }
      }
      nuovaNota.id = nota.id; // Set ID of new note (we said that ID of notes contain the value of the note they play)
      nuovaNota.name = noteLength; // Put the length in the note's name
      nuovaNota.setAttribute("onclick","javascript: playNote(this)"); // Every inputted note on the piano roll can be played if touched
      nuovaNota.style.left = whereNextNote + "px";  // Place the new note horizontally

      // Now... fun begins: set the width of the note depending on its length.
      // I really tried making this in a for cycle rather than having this dumb chain of ifs, but visually, notes always looked off.
      // So yeah, tl;dr: give a fixed width depending on note length...
      if (noteLength == 1)
      {
        nuovaNota.style.width = 472 + "px";
        whereNextNote += 472 + 8 ;
      }
      else if (noteLength == 2)
      {
        nuovaNota.style.width = 232 + "px";
        whereNextNote += 232 + 8;
      }
      else if (noteLength == 4)
      {
        nuovaNota.style.width = 112 + "px";
        whereNextNote += 112 + 8;
      }
      else if (noteLength == 8)
      {
        nuovaNota.style.width = 52 + "px";
        whereNextNote += 52 + 8;
      }
      else if (noteLength == 16)
      {
        nuovaNota.style.width = 22 + "px";
        whereNextNote += 22 + 8;
      }
      else if (noteLength == 32)
      {
        nuovaNota.style.width = 9 + "px";
        whereNextNote += 7 + 8;
      }
      // ...till here.

      // Finally, append new note in body
      noteSheet.appendChild(nuovaNota);

      // Put the music values in our global arrays
      music.push(nota.id); // Push the note value
      lengths.push(32/noteLength); // Push the length. Mind the 32/x: thanks to this, we can smartly revert big numbers as short lengths.
                                 // For example, 32/16th -> 2, this means 16th notes have a length in seconds of 2....
                                 // ... 32/1th -> 32, aka 1th note has a length of 32.
                                 // If we don't do this division, a 16th would last more than a 1th, and this isn't true!
      numOfNotes++; // Increase note counter
    }
  }
}

// Small function that changes length of inputted notes. Gets called by pressing the red minus and the green plus
function changeLength(elem) // "elem" is the pressed icon. It's either the red minus or the green plus.
{
  var miaLength = document.getElementById("noteLength"); // The red minus has ID 1, while the green plus has ID 2.
                                                         // This means I can use the same function for both, and make a check in ID field
  if (elem.id == 1 && miaLength.innerHTML != 32) // ID 1 -> I pressed on the minus -> shorten note -> multiply content by 2
  {
    miaLength.innerHTML = miaLength.innerHTML * 2;
  }
  else if (elem.id == 2 && miaLength.innerHTML != 1) // ID 2 -> I pressed on the plus -> widen note -> divide content by 2
  {
    miaLength.innerHTML = miaLength.innerHTML / 2;
  }
}

// Function that plays the song inside the sheet
function playMusic()
{
  var i=0;  // Start some variables used in the for loop
  var delay = 0.0;
  var totalDelay= 0.0;
  for (i=0;i<music.length;i++) // Keep playing till "i" reaches length of the array containing the notes (yes I could've used the counter but w/e)
  {
    delay = parseFloat( (lengths[i])/16 ) ; // Grab the length, divide it by 16 so that it can be listened at an okay tempo
                                            // (originally, the value lengths[i] wasn't short enough, and it played very long)
    totalDelay = totalDelay + delay;        // Sadly, delays aren't summed up automatically, so I have to give to each note a "total delay" of
                                            // everything that played till there. If I don't sum with the rest, notes would just play all at
                                            // once (example: all 1th would play after x seconds, all 2th would play after y seconds, etc...)
    MIDI.noteOn(0, parseInt(music[i]), 127, totalDelay );  // Play the note!
    MIDI.noteOff(0, parseInt(music[i]), totalDelay + 1);   // Shut the note off after 1 second. This doesn't really work for low pitched 32th tho..
  }
}

// Function that does the UNDO, aka, remove last inputted note
function doUndo()
{
  if (numOfNotes>0) // Do this only if there is atleast 1 note in the sheet.
  {
    music.pop();  // Pop a note, a length and decrease. Bless Javascript for having push/pop methods <3
    numOfNotes--;  // Decrease notes number
    lengths.pop();  // Pop a length.
    var notaDaCanc = document.getElementById("corpoPrincipale").lastElementChild; // Get the last child of the piano roll body...
    var noteLength = notaDaCanc.name; // ...though before removing it, we have to set the horizontal spawn value of next note.
 
    // Calculate next position of new inserted note. We'll subtract an amount of pixels depending on the length of the note we want to kill.
    // ...do I have to repeat again that I attempted to "for" all this?
    if (noteLength == 1)
    {
      whereNextNote -= 472 + 8;
    }
    else if (noteLength == 2)
    {
      whereNextNote -= 232 + 8;
    }
    else if (noteLength == 4)
    {
      whereNextNote -= 112 + 8;
    }
    else if (noteLength == 8)
    {
      whereNextNote -= 52 + 8;
    }
    else if (noteLength == 16)
    {
      whereNextNote -= 22 + 8;
    }
    else if (noteLength == 32)
    {
      whereNextNote -= 7 + 8;
    }
    notaDaCanc.remove(); // Goodbye last note.
  }
}

// Function that toggles REC. value
function toggleRec(elem) // "elem" is the REC button
{
  if (isRec) // It's in rec. mode?
  {
    isRec = 0; //...then disable it
    elem.style.color = "#4040A0";
  }
  else // Else enable rec
  {
    isRec = 1;
    elem.style.color = "#F04080";
  }
}

// Function that removes everything the user wrote
function nuclearNuke()
{
  if (numOfNotes==0) // Warn users they can't remove void, function won't work if there are no notes in the sheet.
  {
    alert("You didn't input any note!");
  }
  else // If there are notes, instead....
  {
    // Ask for a confirm first. We don't want to nuke everything for a misclick on the bin.
    var doubleCheck = confirm("Are you sure you want to delete ALL the notes you inputted?");
    if (doubleCheck==true) // If user truly wants to nuke all the notes inputted so far...
    {
      while (numOfNotes!=0) // ...then nuke all notes visually
      {
        var notaDaCanc = document.getElementById("corpoPrincipale").lastElementChild; // Remove each single last child
        notaDaCanc.remove();  // ..in here....
        numOfNotes--;  // ...and decrease notes number.
      }  
      music = [0];       // Restore all global values as they were on startup
      lengths = [0,0];
      whereNextNote = 32; 
    }
  }
}

// Function that explains how site works shortly. Not really much to comment here...
function showHelp()
{
  alert("Welcome to Weedim, your trusted Web Midi Maker!\n\nUse either the piano on the bottom of the screen or the note buttons inside the piano roll to play notes.\nYou can record a sequence by pressing on the \"Rec\" circle. Pressing it will toggle between a free mode, and the recording mode.\nOnce you recorded something, you can play the result by clicking the \"Play\" button.\nPress on the red minus circle or on the green plus circle to change the recorded notes length: lengths vary from 32th (the shortest) to 1th (the longest).\nIf you need to record a pause between notes, simply click on the \"Add rest\" box.\nLastly, you can remove the last recorded note or rest by clicking on the red \"Undo\" arrow; although, if you want to delete everything at once, no need to refresh the window: simply click on the bin icon, and click OK on the dialogue box.\n\nThe layout was designed for 1920x1080 screens; it may look buggy on smaller resolutions. If the bottom piano overlaps with the piano roll, know that you can resize the former horizontally, and you can resize the latter both horizontally and vertically.\n\nEnjoy your time!\n- Massimo Trionfante ");

}

// Unused function that enabled midi exporting. I abandoned the idea after facing too many issues, and exam date was coming quickly..
/*
function getMidi(){
  var arrasdi = [0x50,0x43,0x22]; // Generic array that had hex values
  var mioFile = document.createElement('a'); // This is a nice trick: add an <a>, click on it via javascript, and then nuke.
                                             // Best way to download files in pure Javascript, lol.
  mioFile.setAttribute('href', 'data:audio/mid;charset=utf-8,' + String.fromCharCode(arrasdi[0])); //String.fromCharCode writes a litteral hex
                                                                                                   //value in the file. Sadly, I have no idea
                                                                                                   //how I should iterate this to accept an
                                                                                                   //array of hex values.
  mioFile.setAttribute('download', "Midi.mid");
  mioFile.style.display = "none";
  document.body.appendChild(mioFile);
  mioFile.click();  // Click the created invisible link, so that download window gets prompted.
  mioFile.remove(); // Originally, this function let you download a legit MIDI containing the only byte I passed to it from String.fromCharCode
}*/

// End of Weedim.js
