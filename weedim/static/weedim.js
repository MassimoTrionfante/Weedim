// Beginning Jingle (this also tells you it's loading)
window.onload=function(){
MIDI.loadPlugin({
  soundfontUrl:"static/midijs/soundfont/",
  instrument: "acoustic_grand_piano",
  onprogress: function(state, progress) {
    console.log(state, progress);
  },
  onsuccess: function(){
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


// Play note at the click of the piano notes on the side
function playNote(elemento)
{
var nota = elemento.id;
MIDI.noteOn(0,nota,127,0);
MIDI.noteOff(0,nota,1);
}


