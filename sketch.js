let dt = 0.1;
let vLoss = 0.95; //0.95
let sLen = 20; //20
let n = [];
let rr = [];
let r;

//-----Bio-01-----//
// let e = [newEdge(1, 2), newEdge(2, 3), newEdge(3, 4), newEdge(2, 4)];
rr.push([[["x", "y"], ["y", "z"]], [["x", "y"], ["x", "z"], ["y", "w"], ["z", "v"]]]);

//-----Bio-02-----//
// let e = [newEdge(1, 2), newEdge(1, 3), newEdge(3, 3)];
rr.push([[["x", "y"], ["x", "z"]], [["x", "y"], ["x", "z"], ["y", "w"], ["z", "v"]]]);

//-----Bio-03-----//
// let e = [newEdge(1, 2), newEdge(1, 3), newEdge(3, 4)];
rr.push([[["x", "y"], ["y", "z"]], [["x", "y"], ["x", "z"], ["y", "w"], ["z", "v"]]]);

//-----Bio-04-----//
// let e = [newEdge(1, 2), newEdge(1, 3), newEdge(3, 2)];
rr.push([[["x", "y"], ["y", "z"]], [["x", "y"], ["x", "z"], ["y", "w"], ["z", "v"]]]);

//-----Bio-05-----//
// let e = [newEdge(1, 2), newEdge(1, 3), newEdge(3, 2)];
rr.push([[["x", "y"], ["x", "z"]], [["x", "a"], ["x", "b"], ["y", "a"], ["y", "b"]]]);

//-----Bio-06-----//
// let e = [newEdge(1, 2), newEdge(1, 3)];
rr.push([[["x", "y"], ["x", "z"]], [["x", "a"], ["y", "a"], ["x", "y"], ["a", "w"]]]);

//-----Bio-06-----//
let e = [newEdge(1, 2), newEdge(2, 1), newEdge(1, 3)];
rr.push([[["x", "y"], ["y", "x"]], [["x", "a"], ["y", "a"], ["x", "y"], ["y", "x"]]]);

function setup() {
  createCanvas(windowWidth, windowHeight);
  let m = 0;
  for (let i = 0; i < e.length; i++) {
    if (m < e[i].l) m = e[i].l; 
    if (m < e[i].r) m = e[i].r;
  }
  for (let i = 0; i < m; i++) {
    n.push(newNode(random(width), random(height)));
  }
}

function draw() {
  background(255);
  updateNodesForces(e, n);
  updateNodesPos(n);
  drawNodes(n);
  drawEdges(e, n);
}

function mouseClicked(event) {
  r = rr[int(random(rr.length))];
  if (e.length < 80) e = ruleApply(r, e);
}

drawEdges = (e, n) => {
  for (let i = 0; i < e.length; i++) {
    let l = n[e[i].l - 1];
    let r = n[e[i].r - 1];
    stroke(0, 60);
    strokeWeight(1);
    noFill();
    strokeWeight((min(l.d, r.d)));
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

drawNodes = (n) => {
  stroke(0, 60);
  strokeWeight(10);
  noFill();
  for (let i = 0; i < n.length; i++) {
    strokeWeight((n[i].d));
    point(n[i].x, n[i].y);
  }
}

