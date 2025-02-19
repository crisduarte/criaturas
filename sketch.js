const dt = 0.1;
const vLoss = 0.95;
const edgeRestLength = 20;
const maxNodeDiameter = 2.5 * edgeRestLength;
const edgeNodeRatio = 1 / 1.61803398875; // 1 / golden ratio
let xBounce = 1.5;
let yBounce = 1.5;
let rWalk = 2;
let fScale;
let g1, g2;
let r1, r2;
let ee = [];
let rr = [];
let started = false;
let sound;

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

function preload() {
  sound = loadSound('torch-click-1-48731.mp3');
}

function setup() {
  // create canvas
  let canvasContainer = document.getElementById('canvasContainer');
  let canvas = createCanvas(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
  canvas.parent('canvasContainer');
  frameRate(60);
  fScale = 3 * maxNodeDiameter / min(width, height);
  // create graphs
  let k = int(random(rr.length));
  g1 = createGraph(ee[k]);
  r1 = rr[k];
  k = int(random(rr.length));
  g2 = createGraph(ee[k]);
  r2 = rr[k];
  // Add event listener to the main buttons
  document.getElementById('startSound').addEventListener('click', startSoundClicked);
  document.getElementById('newCreatures').addEventListener('click', newCreaturesClicked);
  document.getElementById('evolveCreatures').addEventListener('click', evolveCreaturesClicked);
  // Add event listener to the modal dialog buttons
  document.getElementById('confirmEvolution').addEventListener('click', confirmEvolutionClicked);
  document.getElementById('cancelEvolution').addEventListener('click', cancelEvolutionClicked);
}

function draw() {
  scale(1/fScale);
  background(45);
  updateNodesForces(g1);
  updateNodesForces(g2);
  updateNodesPos(g1);
  updateNodesPos(g2);
  checkCollisions(g1, g2);
  drawNodes(g1);
  drawNodes(g2);
  drawEdges(g1);
  drawEdges(g2);
}

newCreaturesClicked = (event) => {
  event.stopPropagation();
  stopSound(g1);
  stopSound(g2);
  started = false;
  setup();
  return false;
}

evolveCreaturesClicked = (event) => {
  event.stopPropagation();
  if (g1.edges.length + g2.edges.length < 160) {
    if (g1.edges.length <= g2.edges.length) {
      ruleApply(r1, g1)
    } else {
      ruleApply(r2, g2);
    } 
  } else {
    // Show the modal dialog
    document.getElementById('warningModal').style.display = 'block';
  }
  return false;
}

confirmEvolutionClicked = (event) => {
  event.stopPropagation();
  if (g1.edges.length <= g2.edges.length) {
    ruleApply(r1, g1)
  } else {
    ruleApply(r2, g2);
  }
  document.getElementById('warningModal').style.display = 'none';
  return false;
}

cancelEvolutionClicked = (event) => {
  event.stopPropagation();
  document.getElementById('warningModal').style.display = 'none';
  return false;
}

startSoundClicked = (event) => {
  event.stopPropagation();
  startSound(g1);
  startSound(g2);
  started = true;
  return false;
}

drawEdges = (g) => {
  const e = g.edges;
  //stroke(150, 150, 230, 80);
  noFill();
  for (let i = 0; i < e.length; i++) {
    const l = e[i].l;
    const r = e[i].r;
    strokeWeight(edgeThickness(e[i]));
    const edgeLength = abs(dist(l.x, l.y, r.x, r.y) - edgeRestLength);
    const blue = map(edgeLength, 0, edgeRestLength, 230, 0);
    const red = map(edgeLength, 0, edgeRestLength, 0, 255);
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
