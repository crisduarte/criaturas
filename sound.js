
startSound = () => {
    if (!started) {
      if (soundBg && soundBg.isLoaded()) {
        soundBg.amp(0.02);
        soundBg.loop(true);
        soundBg.play();
      }
      if (soundG1 && soundG1.isLoaded()) {
        soundG1.amp(0);
        soundG1.loop(true);
        soundG1.play();
      }
      if (soundG2 && soundG2.isLoaded()) {
        soundG2.amp(0);
        soundG2.jump(20);
        soundG2.loop(true);
        soundG2.play();
      }
      if (soundBounce1 && soundBounce1.isLoaded()) {
        soundBounce1.amp(0);
      }
      if (soundBounce2 && soundBounce2.isLoaded()) {
        soundBounce2.amp(0);
      }
      if (osc1) {
        osc1.amp(0);
        osc1.start();
      }
      if (osc2) {
        osc2.amp(0);
        osc2.start();
      }
      started = true
    }
  }
  
  stopSound = () => {
    if (started) {
      if (soundBg && soundBg.isLoaded()) {
        soundBg.amp(0);
        soundBg.stop();
      }
      if (soundG1 && soundG1.isLoaded()) {
        soundG1.amp(0);
        soundG1.stop();
      }
      if (soundG2 && soundG2.isLoaded()) {
        soundG2.amp(0);
        soundG2.stop();
      }
      if (soundBounce1 && soundBounce1.isLoaded()) {
        soundBounce1.amp(0);
      }
      if (soundBounce2 && soundBounce2.isLoaded()) {
        soundBounce2.amp(0);
      }
      if (osc1) {
        osc1.amp(0);
      }
      if (osc2) {
        osc2.amp(0);
      }
      started = false
    }
  }
  
  playGraph = (g) => {
    if (started) {
      if (g.sound && g.sound.isLoaded()) {
        const n = g.nodes;
        let xm = 0;
        for (let i = 0; i < n.length; i++) {
          xm += n[i].x;
        }
        xm /= n.length;
        const amp = map(n.length, 0, 200, 0, 0.2, true);
        const pan = (xm - width * fScale / 2) / (width * fScale / 2);
        g.sound.amp(amp);
        g.sound.pan(pan);
      }
    }
  }

  playEdge = (e) => {
    if (started) {
      if (e.sound) {
        if (e.thickness > 7) {
          // console.log(e.thickness, e.size);
          // const freq = map(e.thickness, edgeNodeRatio * 4, edgeNodeRatio * maxNodeDiameter, 200, 40, true);
          // const amp = map(e.size, edgeRestLength, 3 * edgeRestLength, 0, 0.1, true);
          // const pan = ((e.l.x + e.r.x) / 2 - width * fScale / 2) / (width * fScale / 2);
          // e.sound.freq(freq);
          // e.sound.amp(amp);
          // e.sound.pan(pan);
        }
      }
    }
  }

  playCollision = (n0, n1) => {
    if (started) {
        // const ke0 = kineticEnergy(n0);
        // const ke1 = kineticEnergy(n1);
        // const amp = map(ke0 + ke1, 5, 100, 0.01, 0.3, true);
        // soundBg2.amp(amp);
    }
  }
  
  playBounce = (n) => {
    if (started) {
      const soundBounce = random([soundBounce1, soundBounce2]);
      if (soundBounce && soundBounce.isLoaded()) {
        const v = sqrt(n.vx * n.vx + n.vy * n.vy);
        const amp = map(v, 0, 200, 0, 0.1, true);
        const pan = (n.x - width * fScale / 2) / (width * fScale / 2);
        soundBounce.amp(amp);
        soundBounce.pan(pan);
        soundBounce.play();
      }
    }
  }