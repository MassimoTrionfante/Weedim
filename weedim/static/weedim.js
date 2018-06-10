// Beginning Jingle (this also tells you it finished loading)
window.onload=function(){
MIDI.loadPlugin({
  soundfontUrl:"static/midijs/soundfont/",
  instrument: "acoustic_grand_piano",
  onprogress: function(state, progress) {
    console.log(state, progress);
  },
  onsuccess: function(){

    a = document.getElementById("loadclear")
    a.style.display="none";

    var delay=0;
    var note=50; // 50 is D4
    var velocity=127; // ?? how hard the note plays ??
    MIDI.setVolume(0,127);
    MIDI.noteOn(0, 55+12, velocity, 0.50); // ??, note, velocity, delay
    MIDI.noteOn(0, 57+12, velocity, 0.60);
    MIDI.noteOn(0, 59+12, velocity, 0.70);
    MIDI.noteOn(0, 60+12, velocity, 0.80);
   // MIDI.noteOff(0, 55, delay + 0.70);
   // MIDI.noteOff(0, 55, delay + 0.80);
   // MIDI.noteOff(0, 55, delay + 0.90);
   // MIDI.noteOff(0, 55, delay + 1.10);

// Star Wars Theme
// notes list
//var notes = [48,55,53,52,50,60,55,53,52,50,60,55,53,52,53,50];
// delay. Watch out: you have to count an extra beginning number
//var delays = [1, 1, 1, 0.2, 0.2, 0.2, 1, 0.5, 0.2, 0.2, 0.2, 1, 0.5, 0.2, 0.2, 0.2];
//var i=0;
//var delay =0;
//for (i=0;i<notes.length;i++)
//{
//  delay = delay + delays[i];
//  MIDI.noteOn(0, notes[i], velocity, delay);
//  MIDI.noteOff(0, notes[i], delay + 1);
//}
  }
  });
};

document.oncontextmenu = function() { return false; } // Disable right-click menu

// GLOBAL VARIABLES
var music = [0]; // here we store all the notes of the music
var lengths = [0,0]; // here we store all the lengths (used as delay in MIDI.noteOn)
var numOfNotes = 0; // how many notes out channel has
var whereNextNote = 32; // where to place next note horizontally
var chordEnabled = 0; // says if added note is a chord
var lastAddedLength = 0; // used for chording, remembers last length (graphically)

// Play note at the click of the piano notes on the side
function playNote(elemento)
{
  var nota = elemento.id;
  MIDI.noteOn(0,nota,127,0);
  MIDI.noteOff(0,nota,1);
}

// Function that adds a note on the notes sheet by pressing the piano buttons
function addNote(nota, event)
{
  var noteSheet = document.getElementById("corpoPrincipale");
  var nuovaNota = document.createElement("span");
  var noteLength = document.getElementById("noteLength").innerHTML;

  // Show the note graphically
  if (nota.id==0)
  {
    nuovaNota.className = "rest";
    nuovaNota.style.top = 0;
  }
  else
  {
    nuovaNota.className = "nota";
    nuovaNota.style.top = nota.offsetTop  + "px";
    nuovaNota.innerHTML = nota.innerHTML;
  }
  nuovaNota.id = nota.id;
  nuovaNota.name = noteLength;
  nuovaNota.setAttribute("onclick","javascript: playNote(this)");
  nuovaNota.style.left = whereNextNote + "px";

  // Calculate note length graphically
  if (noteLength == 1)
  {
    nuovaNota.style.width = 472 + "px";
    if (!chordEnabled)
    { whereNextNote += 472 + 8; }
    else
    { lastAddedLength = 472 + 8; }
  }
  else if (noteLength == 2)
  {
    nuovaNota.style.width = 232 + "px";
    if (!chordEnabled)
    { whereNextNote += 232 + 8; }
    else
    { lastAddedLength = 232 + 8; }
  }
  else if (noteLength == 4)
  {
    nuovaNota.style.width = 112 + "px";
    if (!chordEnabled)
    { whereNextNote += 112 + 8; }
    else
    { lastAddedLength = 112 + 8; }
  }
  else if (noteLength == 8)
  {
    nuovaNota.style.width = 52 + "px";
    if (!chordEnabled)
    { whereNextNote += 52 + 8; }
    else
    { lastAddedLength = 52 + 8; }
  }
  else if (noteLength == 16)
  {
    nuovaNota.style.width = 22 + "px";
    if (!chordEnabled)
    { whereNextNote += 22 + 8; }
    else
    { lastAddedLength = 22 + 8; }
  }

  // Finally, append new note in body
  noteSheet.appendChild(nuovaNota);

  // Put the music values in out global arrays
  music.push(nota.id); // Add note
  if (chordEnabled)
  {
    lengths.push(0); // If chording is enabled, no pause happens
  }
  else
  {
    lengths.push(32/noteLength); // Add length
  }
  
  numOfNotes++; // Increase note counter
}

// Small function that changes length of inputted notes
function changeLength(elem)
{
  var miaLength = document.getElementById("noteLength");

  if (elem.id == 1 && miaLength.innerHTML != 16) // shorten note
  {
    miaLength.innerHTML = miaLength.innerHTML * 2;
  }
  else if (elem.id == 2 && miaLength.innerHTML != 1) // widen note
  {
    miaLength.innerHTML = miaLength.innerHTML / 2;
  }
}

// Function that toggles chording
function enableChording(toggle)
{
  if (toggle.innerHTML == "OFF")
  {
    toggle.innerHTML = "ON";
    chordEnabled = 1;
  }
  else
  {
    toggle.innerHTML = "OFF";
    chordEnabled = 0;
    whereNextNote += lastAddedLength;
  }
}

// Function that plays the song inside the sheet
function playMusic()
{
  var i=0;
  var delay = 0.0;
  var totalDelay= 0.0;
  for (i=0;i<music.length;i++)
  {
    delay = parseFloat( (lengths[i])/16 );
    totalDelay = totalDelay + delay;
    MIDI.noteOn(0, parseInt(music[i]), 127, totalDelay );
    MIDI.noteOff(0, parseInt(music[i]), totalDelay + 1);
  }
}

// Function that does the UNDO, aka, remove last inputted note
function doUndo()
{
  music.pop();  // Pop a note, a length and decrease
  numOfNotes--;  // notes number
  lengths.pop();  //
  var notaDaCanc = document.getElementById("corpoPrincipale").lastElementChild;
  var noteLength = notaDaCanc.name;  
 
  // Calculate next position of new inserted note 
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
  // Nuke last note's gfx
  notaDaCanc.remove();
}
