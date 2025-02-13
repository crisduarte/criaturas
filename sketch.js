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
  g1 = createGraph(ee[k], 1);
  r1 = rr[k];
  k = int(random(rr.length));
  g2 = createGraph(ee[k], -1);
  r2 = rr[k];
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
  if (g1.edges.length < 80) ruleApply(r1, g1);
  if (g2.edges.length < 80) ruleApply(r2, g2);
}

drawEdges = (g) => {
  const e = g.edges;
  stroke(150, 150, 230, 60);
  noFill();
  for (let i = 0; i < e.length; i++) {
    const l = e[i].l;
    const r = e[i].r;
    strokeWeight((min(l.d, r.d)) / 2);
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
  stroke(250, 40);
  noFill();
  for (let i = 0; i < n.length; i++) {
    const ni = n[i];
    strokeWeight((ni.d));
    point(ni.x, ni.y);
  }
}
