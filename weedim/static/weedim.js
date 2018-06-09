// Beginning Jingle (this also tells you it's loading)
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

var mouseDown = 0; // 0 = not clicking; 1 = left click;
var blockAdd = 0; // Set to 1 if you're moving a note

//DEBUG DEBUG DEBUG DEBUG DEBUG
function getMouseX(event)
{ 
  var a = document.getElementById("corpoPrincipale");
  //document.getElementById("debugX").innerHTML = a.scrollLeft + event.clientX;
}
function getMouseY(event)
{
  var a = document.getElementById("corpoPrincipale");
  //document.getElementById("debugY").innerHTML = a.scrollTop + event.clientY;
}
//DEBUG DEBUG DEBUG ---------------------------------------------------------


document.oncontextmenu = function() { return false; } // Disable right-click menu

// Play note at the click of the piano notes on the side
function playNote(elemento)
{
var nota = elemento.id;
MIDI.noteOn(0,nota,127,0);
MIDI.noteOff(0,nota,1);
}

// ---- Group of functions that allows dragging a note ------
function setMouseDown(elemento,event){
blockAdd = 1;
  if (event.button == 0){
    mouseDown = 1;
  }
  else if (event.button == 2)
  {
    blockAdd = 0;
    elemento.style.display="none";
  }
}
function setMouseUp(){
  mouseDown = 0;
  blockAdd = 0;
}
function moveNote(elemento,event)
{
  var noteSheet = document.getElementById("corpoPrincipale");
  if (mouseDown==1){
    if (event.clientX > 231) // Prevent note from going out to the left
    {
      elemento.style.top= (event.clientY + noteSheet.scrollTop - 215) +  "px";
      elemento.style.left=  (event.clientX + noteSheet.scrollLeft - 200) + "px";
    }
  }
}
// -------------------------

// Function that adds a note on the notes sheet by pressing the piano buttons
function addNote()
{
  var noteSheet = document.getElementById("corpoPrincipale");
  var nuovaNota = document.createElement("span");
  nuovaNota.className = "nota";
  nuovaNota.innerHTML = "nota";
  nuovaNota.style.top = 2 + "px";
  nuovaNota.style.left = 32 + "px";
  noteSheet.appendChild(nuovaNota);
}

