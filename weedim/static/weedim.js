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
//DEBUG DEBUG DEBUG


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

// Function that adds a note on the notes sheet
function addNote(noteSheet,event)
{
  // If you're clicking down + aren't moving a note + not outside sheet...
  if (event.button == 0 && blockAdd == 0 && event.clientX > 231)
  {
    // ...add new note!
    var nuovaNota = document.createElement("span");
    var pitch = event.clientY + noteSheet.scrollTop;
    var scarto = 0;

    // Calculate note value (scarto + diff(19) - 4)
    for (var i=0;i<7;i++)
    {
      if (pitch > (scarto + 210 + 200*i) && pitch <= (scarto + 230 + 200*i)  )
      {
        nuovaNota.innerHTML = "B" + (7-i);
        nuovaNota.id = 11 + 12*(7 - (i));
        MIDI.noteOn(0,nuovaNota.id,127,0);
      }
      else if (pitch > (scarto + 230 + 200*i) && pitch <= (scarto + 245 + 200*i) )
      {
        nuovaNota.innerHTML = "A+" + (7-i);
        nuovaNota.id = 10 + 12*(7 - (i));
        MIDI.noteOn(0,nuovaNota.id,127,0);
      }
      else if (pitch > (scarto + 245 + 200*i) && pitch <= (scarto + 260 + 200*i) )
      {
        nuovaNota.innerHTML = "A" + (7-i);
        nuovaNota.id = 9 + 12*(7 - (i));
        MIDI.noteOn(0,nuovaNota.id,127,0);
      }
      else if (pitch > (scarto + 260 + 200*i) && pitch <= (scarto + 276 + 200*i) )
      {
        nuovaNota.innerHTML = "G+" + (7-i);
        nuovaNota.id = 8 + 12*(7 - (i));
        MIDI.noteOn(0,nuovaNota.id,127,0);
      }
       else if (pitch > (scarto + 276 + 200*i) && pitch <= (scarto + 291 + 200*i) )
      {
        nuovaNota.innerHTML = "G" + (7-i);
        nuovaNota.id = 7 + 12*(7 - (i));
        MIDI.noteOn(0,nuovaNota.id,127,0);
      }
        else if (pitch > (scarto + 291 + 200*i) && pitch <= (scarto + 316 + 200*i) )
      {
        nuovaNota.innerHTML = "F+" + (7-i);
        nuovaNota.id = 6 + 12*(7 - (i));
        MIDI.noteOn(0,nuovaNota.id,127,0);
      }
      




      scarto = scarto + 6;
    }
    //nuovaNota.innerHTML = "note";
    nuovaNota.setAttribute("onmousemove","javascript: moveNote(this,event)");
    nuovaNota.setAttribute("onmousedown","javascript: setMouseDown(this,event)");
    nuovaNota.setAttribute("onmouseup","javascript: setMouseUp()");
    nuovaNota.className = "nota";
    nuovaNota.style.top = (event.clientY + noteSheet.scrollTop - 215) + "px";
    nuovaNota.style.left = (event.clientX + noteSheet.scrollLeft - 200) + "px";
    noteSheet.appendChild(nuovaNota);
  }
}

