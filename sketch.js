const dt = 0.1;
const vLoss = 0.95;
const edgeRestLength = 20;
const maxNodeDiameter = 2.5 * edgeRestLength;
const edgeNodeRatio = 1 / 1.61803398875; // 1 / golden ratio
const samplingTime = 200;
const safeNodesLimit = 300;
const xBounce = 1.1;
const yBounce = 1.1;
const rWalk = 2;
let fScale;
let g1, g2;
let r1, r2;

function setup() {
  // create canvas
  let canvasContainer = document.getElementById('canvasContainer');
  let canvas = createCanvas(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
  canvas.parent('canvasContainer');
  frameRate(60);
  fScale = 4 * maxNodeDiameter / min(width, height);
  // create graphs
  let k = int(random(rr.length));
  g1 = createGraph(ee[k], soundG1);
  r1 = rr[k];
  k = int(random(rr.length));
  g2 = createGraph(ee[k], soundG2);
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
  background(0);
  updateNodesForces(g1);
  updateNodesForces(g2);
  updateNodesPositions(g1, rWalk);
  updateNodesPositions(g2, rWalk);
  updateNodesBouncing(g1);
  updateNodesBouncing(g2);
  updateNodesCollisions(g1, g2);
  updateNodesHeading(g1);
  updateNodesHeading(g2);
  drawNodes(g1);
  drawNodes(g2);
  drawEdges(g1);
  drawEdges(g2);
  playGraph(g1);
  playGraph(g2);
}

evolveCreatures = (g1, g2, r1, r2) => {
  if (g1.nodes.length <= g2.nodes.length) {
    playEvolve(g1);
    ruleApply(r1, g1);
  } else {
    playEvolve(g2);
    ruleApply(r2, g2);
  }
}

newCreaturesClicked = (event) => {
  stopSound();
  setup();
}

evolveCreaturesClicked = (event) => {
  if (g1.nodes.length + g2.nodes.length < safeNodesLimit) {
    evolveCreatures(g1, g2, r1, r2);
  } else {
    document.getElementById('warningModal').style.display = 'block';
  }
}

confirmEvolutionClicked = (event) => {
  evolveCreatures(g1, g2, r1, r2);
  document.getElementById('warningModal').style.display = 'none';
}

cancelEvolutionClicked = (event) => {
  document.getElementById('warningModal').style.display = 'none';
}

startSoundClicked = (event) => {
  startSound();
}

drawEdges = (g) => {
  const e = g.edges;
  noFill();
  for (let i = 0; i < e.length; i++) {
    const ei = e[i];
    const l = ei.l;
    const r = ei.r;
    strokeWeight(edgeThickness(ei));
    const edgeLength = abs(ei.size - edgeRestLength);
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

playGraph = (g) => {
  if (started) {
    if (g.sound && g.sound.isLoaded()) {
      const amp = map(g.interactions, 0, 400, 0, 0.2, true);
      const pan = (g.xInteractions - width * fScale / 2) / (width * fScale / 2);
      g.sound.amp(amp);
      g.sound.pan(pan);
    }
  }
}

playEvolve = (g) => {
  if (started) {
    if (soundEvolve && soundEvolve.isLoaded) {
      const amp = map(g.nodes.length, 3, 50, 0.05, 0.5, true);
      soundEvolve.amp(amp);
      soundEvolve.play();
    }
  }
}