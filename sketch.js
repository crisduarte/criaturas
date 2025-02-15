let dt = 0.1;
let vLoss = 0.95;
let fScale = 6;
let sLen = 20;
let xBounce = 1.5;
let yBounce = 1.5;
let rWalk = 2;
let g1, g2;
let r1, r2;
let ee = [];
let rr = [];
let started = false;

// -----Bio-01-----//
ee.push([[1, 2], [2, 3], [3, 4], [2, 4]]);
rr.push([[["x", "y"], ["y", "z"]], [["x", "y"], ["x", "z"], ["y", "w"], ["z", "v"]]]);

//-----Bio-02-----//
ee.push([[1, 2], [1, 3], [3, 3]]);
rr.push([[["x", "y"], ["x", "z"]], [["x", "y"], ["x", "z"], ["y", "w"], ["z", "v"]]]);

//-----Bio-03-----//
ee.push([[1, 2], [1, 3], [3, 4]]);
rr.push([[["x", "y"], ["y", "z"]], [["x", "y"], ["x", "z"], ["y", "w"], ["z", "v"]]]);

//-----Bio-04-----//
ee.push([[1, 2], [1, 3], [3, 2]]);
rr.push([[["x", "y"], ["y", "z"]], [["x", "y"], ["x", "z"], ["y", "w"], ["z", "v"]]]);

//-----Bio-05-----//
ee.push([[1, 2], [1, 3], [3, 2]]);
rr.push([[["x", "y"], ["x", "z"]], [["x", "a"], ["x", "b"], ["y", "a"], ["y", "b"]]]);

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  let k = int(random(rr.length));
  g1 = createGraph(ee[k]);
  r1 = rr[k];
  k = int(random(rr.length));
  g2 = createGraph(ee[k]);
  r2 = rr[k];

  // Add event listener to the button
  document.getElementById('startSound').addEventListener('click', startSoundClicked);
  document.getElementById('newCreatures').addEventListener('click', newCreaturesClicked);
}

function draw() {
  scale(fScale);
  background(45);
  updateNodesForces(g1);
  updateNodesForces(g2);
  checkCollisions(g1, g2);
  updateNodesPos(g1);
  updateNodesPos(g2);
  drawNodes(g1);
  drawNodes(g2);
  drawEdges(g1);
  drawEdges(g2);
}

function mouseClicked(event) {
  if (g1.edges.length < 30) ruleApply(r1, g1);
  if (g2.edges.length < 30) ruleApply(r2, g2);
}

function newCreaturesClicked(event) {
  event.stopPropagation();
  stopSound(g1);
  stopSound(g2);
  started = false;
  setup();
}

function startSoundClicked(event) {
  event.stopPropagation();
  startSound(g1);
  startSound(g2);
  started = true;
}

function startSound(g) {
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

function stopSound(g) {
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

// playNodes = (g) => {
//   const n = g.nodes;
//   for (let i = 0; i < n.length; i++) {
//     const ni = g.nodes[i];
//     const f = sqrt(ni.fx * ni.fx + ni.fy * ni.fy);
//     const v = sqrt(ni.vx * ni.vx + ni.vy * ni.vy);
//     let freq = map(f, 0, 500, 20, 1200, false);
//     let amp = map(v, 0, 100, 0, 1 / n.length, true);
//     if (!isFinite(freq)) freq = 440;
//     if (!isFinite(amp)) amp = 0;
//     ni.osc.freq(freq);
//     ni.osc.amp(amp);
//   }
// }

// playEdges = (g) => {
//   const e = g.edges;
//   for (let i = 0; i < e.length; i++) {
    // const l = e[i].l;
    // const r = e[i].r;
    // const d = min(l.d, r.d);
    // const edgeLength = dist(l.x, l.y, r.x, r.y);
    //console.log(d);
    // let freq = map(edgeLength, 0, sLen * 10, 20, 1000, false);//map(d, 0, 6, 80, 440, true);
    // let amp = map(edgeLength, 0, sLen * 20, 0, 0.01, false);
    // if (!isFinite(freq)) freq = 440;
    // if (!isFinite(amp)) amp = 0;
    //e[i].osc.freq(freq);
    // e[i].osc.amp(amp, 0.1);
//   }
// }

function kineticEnergy(node) {
  const velocity = sqrt(node.vx * node.vx + node.vy * node.vy);
  return 0.5 * node.d * velocity * velocity;
}

playCollisions = (n0, n1) => {
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

drawEdges = (g) => {
  const e = g.edges;
  //stroke(150, 150, 230, 80);
  noFill();
  for (let i = 0; i < e.length; i++) {
    const l = e[i].l;
    const r = e[i].r;
    strokeWeight(edgeThickness(e[i]));
    const edgeLength = abs(dist(l.x, l.y, r.x, r.y) - sLen);
    const blue = map(edgeLength, 0, sLen, 230, 0);
    const red = map(edgeLength, 0, sLen, 0, 255);
    stroke(red, 150, blue, 80);
    if (l !== r) {
      line(l.x, l.y, r.x, r.y);
    } else {
      let d = dist(l.x, l.y, l.hx, l.hy);
      let hx = 0, hy = 0;
      if (d > 0) {
        hx = (l.hx - l.x) / d;
        hy = (l.hy - l.y) / d;
      }
      arc(l.x + hx * 7.5, l.y + hy * 7.5, 15, 15, 0, TWO_PI);
    }
  }
}

drawNodes = (g) => {
  const n = g.nodes;
  stroke(250, 60);
  noFill();
  for (let i = 0; i < n.length; i++) {
    const ni = n[i];
    // strokeWeight(nodeDiameter(ni));
    strokeWeight(ni.d);
    point(ni.x, ni.y);
  }
}
