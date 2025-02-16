
startSound = (g) => {
    if (!started) {
      // const n = g.nodes;
      // for (let i = 0; i < n.length; i++) {
      //   let ni = g.nodes[i];
      //   ni.sound.start();
      // }
      // const e = g.edges;
      // for (let i = 0; i < e.length; i++) {
      //   let ei = e[i];
      //   ei.osc.start();
      // }
    }
  }
  
  stopSound = (g) => {
    if (started) {
    //   const n = g.nodes;
    //   for (let i = 0; i < n.length; i++) {
    //     let ni = g.nodes[i];
    //     ni.sound.amp(0);
    //     ni.sound.stop();
    //   }
    //   const e = g.edges;
    //   for (let i = 0; i < e.length; i++) {
    //     let ei = e[i];
    //     ei.osc.amp(0);
    //     ei.osc.stop();
    //   }
    }
  }
  
  playNodes = (g) => {
    if (started) {
      // const n = g.nodes;
      // for (let i = 0; i < n.length; i++) {
      //   const ni = g.nodes[i];
      //   const f = sqrt(ni.fx * ni.fx + ni.fy * ni.fy);
      //   const v = sqrt(ni.vx * ni.vx + ni.vy * ni.vy);
      //   let freq = map(f, 0, 500, 20, 1200, false);
      //   let amp = map(v, 0, 100, 0, 1 / n.length, true);
      //   if (!isFinite(freq)) freq = 440;
      //   if (!isFinite(amp)) amp = 0;
      //   ni.osc.freq(freq);
      //   ni.osc.amp(amp);
      // }
    }
  }
  
  playEdges = (g) => {
    if (started) {
      // const e = g.edges;
      // for (let i = 0; i < e.length; i++) {
      //   const l = e[i].l;
      //   const r = e[i].r;
      //   const d = min(l.d, r.d);
      //   const edgeLength = dist(l.x, l.y, r.x, r.y);
      //   console.log(d);
      //   let freq = map(edgeLength, 0, sLen * 10, 20, 1000, false);//map(d, 0, 6, 80, 440, true);
      //   let amp = map(edgeLength, 0, sLen * 20, 0, 0.01, false);
      //   if (!isFinite(freq)) freq = 440;
      //   if (!isFinite(amp)) amp = 0;
      //   e[i].osc.freq(freq);
      //   e[i].osc.amp(amp, 0.1);
      // }
    }
  }
  
  function kineticEnergy(node) {
    const velocity = sqrt(node.vx * node.vx + node.vy * node.vy);
    return 0.5 * node.d * velocity * velocity;
  }
  
  playCollision = (n0, n1) => {
    if (started) {
        // const ke0 = kineticEnergy(n0);
        // const amp0 = map(ke0, 80, 1000, 0, 0.1, false);
        // n0.sound.amp(amp0 / 10);
        // n0.env.play(n0.sound, 0, 0.01, 0.01);
        // const ke1 = kineticEnergy(n1);
        // const amp1 = map(ke1, 80, 1000, 0, 0.1, false);
        // n1.sound.amp(amp1 / 10);
        // n1.env.play(n1.sound, 0, 0.01, 0.01);
    }
  }
  