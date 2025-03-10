newNode = (x, y) => {;
  return { x, y, vx: 0, vy: 0, fx: 0, fy: 0, hx: 0, hy: 0, d: 0 };
}

newEdge = (n0, n1) => {
  return { l: n0, r: n1, size: 0 };
}

createGraph = (edgeList, sound) => {
  sound = newSound(sound);
  const edges = [];
  const nodeMap = new Map();
  for (let i = 0; i < edgeList.length; i++) {
    const [a, b] = edgeList[i];
    if (!nodeMap.has(a)) nodeMap.set(a, newNode(random(width * fScale), random(height * fScale)));
    if (!nodeMap.has(b)) nodeMap.set(b, newNode(random(width * fScale), random(height * fScale)));
    edges.push(newEdge(nodeMap.get(a), nodeMap.get(b)));
  }
  const nodes = [...nodeMap.values()];
  return { nodes, edges, sound };
}

nodeDiameter = (n) => {
  return Math.min(n.d, maxNodeDiameter);
}

edgeThickness = (e) => {
  return Math.min(nodeDiameter(e.l), nodeDiameter(e.r)) * edgeNodeRatio;
}

dist2 = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
}

startCountInteractions = (g) => {
  if (!g._timeInteraction) {
    g._timeInteraction = millis();
    g._interactions = 0;
    g._xInteractions = 0;
    g.interactions = 0;
    g.xInteractions = 0;
  }
}

addCountInteractions = (g, interactions, x) => {
  g._interactions += interactions;
  g._xInteractions += x;
}

updateCountInteractions = (g) => {
  if (g._timeInteraction) {
    const currTime = millis();
    if (currTime - g._timeInteraction > samplingTime) {
      g.interactions = g._interactions;
      g.xInteractions = 0;
      if (g._interactions > 0)
        g.xInteractions = g._xInteractions / g._interactions;
      g._timeInteraction = currTime;
      g._interactions = 0;
      g._xInteractions = 0;
    }
  }
}

updateNodesForces = (g) => {
  const n = g.nodes;
  const e = g.edges;
  // reset
  for (let i = 0; i < n.length; i++) {
    let ni = n[i];
    ni.fx = ni.hx;
    ni.fy = ni.hy;
    ni.hx = 0;
    ni.hy = 0;
    ni.d = 0;
  }
  // mouse interaction
  for (let i = 0; i < n.length; i++) {
    let ni = n[i];
    if (mouseIsPressed) {
      let d2 = dist2(ni.x, ni.y, mouseX * fScale, mouseY * fScale);
      if (d2 > 1) {
        ni.hx = 1000 * (ni.x - mouseX * fScale) / d2;
        ni.hy = 1000 * (ni.y - mouseY * fScale) / d2;
      }
    }
  }
  // node interaction
  for (let i = 0; i < n.length - 1; i++) {
    const ni = n[i];
    for (let j = i + 1; j < n.length; j++) {
      const nj = n[j];
      const d2 = dist2(ni.x, ni.y, nj.x, nj.y);
      const d = sqrt(d2);
      if (1 < d && d < 3 * maxNodeDiameter) {
        const f = 100 / d2;
        const fx = f * (ni.x - nj.x) / d;
        const fy = f * (ni.y - nj.y) / d;
        ni.fx += fx;
        nj.fx -= fx;
        ni.fy += fy;
        nj.fy -= fy;
      }
    }
  }
  // edge interaction
  for (let i = 0; i < e.length; i++) {
    const ei = e[i];
    const l = ei.l;
    const r = ei.r;
    if (l != r) {
      ei.size = sqrt(dist2(l.x, l.y, r.x, r.y));
      if (ei.size > 1) {
        const f = (edgeRestLength - ei.size) * 0.1;
        const fx = f * (l.x - r.x) / ei.size
        const fy = f * (l.y - r.y) / ei.size;
        l.fx += fx;
        r.fx -= fx;
        l.fy += fy;
        r.fy -= fy;
        l.hx += r.x;
        l.hy += r.y;
        r.hx += l.x;
        r.hy += l.y;
      }
      l.d++;
      r.d++;
    } else {
      ei.size = edgeRestLength;
    }
  }
}

updateNodesCollisions = (g1, g2) => {
  const n1 = g1.nodes;
  const n2 = g2.nodes;
  startCountInteractions(g1);
  startCountInteractions(g2);
  for (let i = 0; i < n1.length; i++) {
    const ni = n1[i];
    const niDiameter = nodeDiameter(ni);
    for (j = 0; j < n2.length; j++) {
      const nj = n2[j];
      const dx = nj.x - ni.x;
      const dy = nj.y - ni.y;
      const d = sqrt(dx * dx + dy * dy);
      if (1 < d && d < (niDiameter + nodeDiameter(nj)) / 2) {
        // Normal vector
        const nx = dx / d;
        const ny = dy / d;
        // Tangent vector
        const tx = -ny;
        const ty = nx;
        // Dot product tangent
        const dpTan1 = ni.vx * tx + ni.vy * ty;
        const dpTan2 = nj.vx * tx + nj.vy * ty;
        // Dot product normal
        const dpNorm1 = ni.vx * nx + ni.vy * ny;
        const dpNorm2 = nj.vx * nx + nj.vy * ny;
        // Conservation of momentum in 1D
        const m1 = ni.d;
        const m2 = nj.d;
        const v1 = dpNorm1 * (m1 - m2) / (m1 + m2) + dpNorm2 * 2 * m2 / (m1 + m2);
        const v2 = dpNorm2 * (m2 - m1) / (m1 + m2) + dpNorm1 * 2 * m1 / (m1 + m2);
        // Update velocities
        ni.vx = tx * dpTan1 + nx * v1;
        ni.vy = ty * dpTan1 + ny * v1;
        nj.vx = tx * dpTan2 + nx * v2;
        nj.vy = ty * dpTan2 + ny * v2;
        // push nodes apart slightly to prevent sticking
        const overlap = ((nodeDiameter(ni) + nodeDiameter(nj)) / 2 - d) / 2;
        const angle = atan2(dy, dx);
        ni.x -= cos(angle) * overlap;
        ni.y -= sin(angle) * overlap;
        nj.x += cos(angle) * overlap;
        nj.y += sin(angle) * overlap;
        // count interactions
        addCountInteractions(g1, 1, ni.x);
        addCountInteractions(g2, 1, nj.x);
      }
    }
  }
  updateCountInteractions(g1);
  updateCountInteractions(g2);
}

updateNodesBouncing = (g) => {
  const n = g.nodes;
  startCountInteractions(g);
  for (let i = 0; i < n.length; i++) {
    const ni = n[i];
    const left = nodeDiameter(ni) / 2;
    const right = width * fScale - nodeDiameter(ni) / 2;
    if (ni.x < left || ni.x > right) {
      ni.vx *= abs(ni.vx) < 100 ? -xBounce : -1/xBounce;
      ni.x = ni.x < left ? left : right;
      ni.x += ni.vx * dt;
      g.bounces++;
      g.xBouncing += ni.x;
    }
    const top = nodeDiameter(ni) / 2;
    const bottom = height * fScale - nodeDiameter(ni) / 2;
    if (ni.y < top || ni.y > bottom) {
      ni.vy *= abs(ni.vy) < 100 ? -yBounce : -1/yBounce;
      ni.y = ni.y < top ? top : bottom;
      ni.y += ni.vy * dt;
      addCountInteractions(g, 1, ni.x);
    }
  }
  updateCountInteractions(g);
}

updateNodesPositions = (g, rWalk) => {
  const n = g.nodes;
  startCountInteractions(g);
  for (let i = 0; i < n.length; i++) {
    const ni = n[i];
    // update velocity
    ni.vx += ni.fx * dt;
    ni.vy += ni.fy * dt;
    // noise walk
    if (ni.d < 2) {
      ni.vx += (random(rWalk) - rWalk / 2);
      ni.vy += (random(rWalk) - rWalk / 2);
    }
    // update velocity loss
    ni.vx *= vLoss;
    ni.vy *= vLoss;
    // update position
    ni.x += ni.vx * dt;
    ni.y += ni.vy * dt;
    // check velocity
    const v = sqrt(ni.vx * ni.vx + ni.vy * ni.vy);
    addCountInteractions(g, v / edgeRestLength, ni.x);
  }
  updateCountInteractions(g);
}

updateNodesHeading = (g) => {
  const n = g.nodes;
  for (let i = 0; i < n.length; i++) {
    const ni = n[i];
    if (ni.d == 0)
      ni.d = 1;
    ni.hx /= ni.d;
    ni.hy /= ni.d;
    ni.hx -= ni.x;
    ni.hy -= ni.y;
  }
}

matchNodes = (r, e) => {
  const pattern = r[0];
  if (pattern.length > e.length) return false;
  const nodes = {};
  for (let i = 0; i < pattern.length; i++) {
    let il = pattern[i][0];
    let ir = pattern[i][1];
    if (!nodes[il]) nodes[il] = e[i].l
    else if (nodes[il] != e[i].l) return false;
    if (!nodes[ir]) nodes[ir] = e[i].r
    else if (nodes[ir] != e[i].r) return false;
  }
  return nodes;
}

replaceNodes = (r, nodes, g) => {
  const n = g.nodes;
  const res = [];
  const repl = r[1];
  let node;
  for (let i = 0; i < repl.length; i++) {
    const il = repl[i][0];
    const ir = repl[i][1];
    if (!nodes[il]) {
      node = newNode(nodes[ir].x + nodes[ir].hx, nodes[ir].y + nodes[ir].hy);
      nodes[il] = node;
      n.push(node);
    }
    if (!nodes[ir]) {
      node = newNode(nodes[il].x + nodes[il].hx, nodes[il].y + nodes[il].hy);
      nodes[ir] = node;
      n.push(node);
    }
    res.push(newEdge(nodes[il], nodes[ir]));
  }
  return res;
}

ruleApply = (r, g) => {
  const e1 = g.edges;
  const e2 = g.edges.slice(0);
  for (let i = 0; i < e1.length - 1; i++) {
    for (let j = i + 1; j < e1.length; j++) {
      let nodes = matchNodes(r, [e1[i], e1[j]]);
      if (!nodes) continue;
      let edges  = replaceNodes(r, nodes, g);
      e2[i] = edges[0];
      e2[j] = edges[1];
      for (let k = 2; k < edges.length; k++) e2.push(edges[k]);
    }
  }
  g.edges = e2;
}

