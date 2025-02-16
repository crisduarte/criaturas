let dt = 0.1;
let vLoss = 0.95;
let fScale = 5;
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
  // create canvas
  let canvasContainer = document.getElementById('canvasContainer');
  let canvas = createCanvas(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
  canvas.parent('canvasContainer');
  frameRate(30);
  // create graphs
  let k = int(random(rr.length));
  g1 = createGraph(ee[k]);
  r1 = rr[k];
  k = int(random(rr.length));
  g2 = createGraph(ee[k]);
  r2 = rr[k];
  // Add event listener to the button
  document.getElementById('startSound').addEventListener('click', startSoundClicked);
  document.getElementById('newCreatures').addEventListener('click', newCreaturesClicked);
  document.getElementById('evolveCreatures').addEventListener('click', evolveCreaturesClicked);
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

function newCreaturesClicked(event) {
  event.stopPropagation();
  stopSound(g1);
  stopSound(g2);
  started = false;
  setup();
}

function evolveCreaturesClicked(event) {
  event.stopPropagation();
  if (g1.edges.length + g2.edges.length < 160) {
    ruleApply(r1, g1);
    ruleApply(r2, g2);
  }
}

function startSoundClicked(event) {
  event.stopPropagation();
  startSound(g1);
  startSound(g2);
  started = true;
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
    strokeWeight(nodeDiameter(ni));
    point(ni.x, ni.y);
  }
}
