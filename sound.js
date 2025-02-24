let started = false;
let soundBg, soundG1, soundG2, soundEvolve;

function preload() {
  /*
  DSGNRmbl_Ground rumble.Low And wide_EM by newlocknew -- https://freesound.org/s/724998/ -- License: Attribution NonCommercial 4.0
  */
  soundBg = loadSound('ground-rumble.wav');
  /*
  Shrimps and Crustaceans by iainmccurdy -- https://freesound.org/s/744210/ -- License: Attribution 4.0
  */
  soundG1 = loadSound('shrimps-and-crustaceans.mp3');
  soundG2 = loadSound('shrimps-and-crustaceans.mp3');
  /*
  stitching flesh at midnight in the lab.wav by HowardV -- https://freesound.org/s/646015/ -- License: Creative Commons 0
  */
  soundEvolve = loadSound('stitching-flesh-at-midnight-in-the-lab_fragment.mp3');
}

newSound = (sound) => {
  if (sound) {
    if (typeof sound === 'string') {
      sound = loadSound(sound);
    }
    sound.amp(0);
  }
  return sound;
}

startSound = () => {
  if (!started) {
    userStartAudio();
    if (soundBg && soundBg.isLoaded()) {
      soundBg.amp(0.1);
      soundBg.loop(true);
    }
    if (g1.sound && g1.sound.isLoaded()) {
      g1.sound.amp(0);
      g1.sound.loop(true);
    }
    if (g2.sound && g2.sound.isLoaded()) {
      g2.sound.amp(0);
      g2.sound.loop(true);
    }
    if (soundEvolve && soundEvolve.isLoaded()) {
      soundEvolve.amp(0);
    }
    started = true
  }
}
  
stopSound = () => {
  if (started) {
    if (g1.sound && g1.sound.isLoaded()) {
      g1.sound.amp(0);
    }
    if (g2.sound && g2.sound.isLoaded()) {
      g2.sound.amp(0);
    }
  }
}
