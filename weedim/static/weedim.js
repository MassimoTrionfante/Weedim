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
  }
  });
};

document.oncontextmenu = function() { return false; } // Disable right-click menu

// GLOBAL VARIABLES

var music = [0]; // here we store all the notes of the music
var lengths = [0,0]; // here we store all the lengths (used as delay in MIDI.noteOn)
                     // Note that an extra value is needed for Midi.js to playback properly
var numOfNotes = 0; // how many notes our channel has
var whereNextNote = 32; // where to place next note horizontally
var isRec = 0; // Tells if it's in rec. mode

// Play note at the click of the piano notes on the side
function playNote(elemento)
{
  var nota = elemento.id;
  MIDI.noteOn(0,nota,127,0);
  MIDI.noteOff(0,nota,1);
}

// Function that adds a note on the notes sheet by pressing the piano buttons
function addNote(nota, event, isOnPiano)
{
  if(isRec){

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
      if (!isOnPiano)
      {
        nuovaNota.style.top = nota.offsetTop  + "px";
      }
      else
      {
        var riga = document.getElementById(nota.id);
        nuovaNota.style.top = riga.offsetTop + "px";
      }

      if (noteLength != 32)
      {
        nuovaNota.innerHTML = nota.innerHTML;
      }
    }
    nuovaNota.id = nota.id;
    nuovaNota.name = noteLength;
    nuovaNota.setAttribute("onclick","javascript: playNote(this)");
    nuovaNota.style.left = whereNextNote + "px";

    // Calculate note length graphically
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

    // Finally, append new note in body
    noteSheet.appendChild(nuovaNota);

    // Put the music values in out global arrays
    music.push(nota.id)  //music.push(nota.id); // Add note
      
    lengths.push(32/noteLength); // Add length
  
    numOfNotes++; // Increase note counter
  }
}

// Small function that changes length of inputted notes
function changeLength(elem)
{
  var miaLength = document.getElementById("noteLength");

  if (elem.id == 1 && miaLength.innerHTML != 32) // shorten note
  {
    miaLength.innerHTML = miaLength.innerHTML * 2;
  }
  else if (elem.id == 2 && miaLength.innerHTML != 1) // widen note
  {
    miaLength.innerHTML = miaLength.innerHTML / 2;
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
    delay = parseFloat( (lengths[i])/16 ) ;
    totalDelay = totalDelay + delay;
    MIDI.noteOn(0, parseInt(music[i]), 127, totalDelay );
    MIDI.noteOff(0, parseInt(music[i]), totalDelay + 1);
  }
}

// Function that does the UNDO, aka, remove last inputted note
function doUndo()
{
  if (numOfNotes>0)
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
    else if (noteLength == 32)
    {
      whereNextNote -= 7 + 8;
    }
    // Nuke last note's gfx
    notaDaCanc.remove();
  }
}

// Function that toggles REC. value
function toggleRec(elem)
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
  if (numOfNotes==0)
  {
    alert("You didn't input any note!");
  }
  else
  {
    var doubleCheck = confirm("Are you sure you want to delete ALL the notes you inputted?");
    if (doubleCheck==true)
    {
      while (numOfNotes!=0) //Nuke all notes visually
      {
        var notaDaCanc = document.getElementById("corpoPrincipale").lastElementChild;
        notaDaCanc.remove();
        numOfNotes--;
      }  
      music = [0];       // Restore all global values as they were on startup
      lengths = [0,0];
      whereNextNote = 32; 
    }
  }
}

// Function that explains how site works shortly
function showHelp()
{
  alert("Welcome to Weedim, your trusted Web Midi Maker!\n\nUse either the piano on the bottom of the screen or the note buttons inside the piano roll to play notes.\nYou can record a sequence by pressing on the \"Rec\" circle. Pressing it will toggle between a free mode, and the recording mode.\nOnce you recorded something, you can play the result by clicking the \"Play\" button.\nPress on the red minus circle or on the green plus circle to change the recorded notes length: lengths vary from 32th (the shortest) to 1th (the longest).\nIf you need to record a pause between notes, simply click on the \"Add rest\" box.\nLastly, you can remove the last recorded note or rest by clicking on the red \"Undo\" arrow; although, if you want to delete everything at once, no need to refresh the window: simply click on the bin icon, and click OK on the dialogue box.\n\nThe layout was designed for 1920x1080 screens; it may look buggy on smaller resolutions.\n\nEnjoy your time!\n- Massimo Trionfante ");

}


// Unused function that enabled midi exporting. I abandoned the idea after facing too many issues
/*
function getMidi(){

  var arrasdi = [0x50,0x43,0x22];
  var mioFile = document.createElement('a');

  mioFile.setAttribute('href', 'data:audio/mid;charset=utf-8,' + String.fromCharCode(arrasdi[0]));
  mioFile.setAttribute('download', "Midi.mid");
  mioFile.style.display = "none";
  document.body.appendChild(mioFile);
  mioFile.click();
  mioFile.remove();

}*/
