newNode = (x, y) => {
  // sound = new p5.Noise("white");
  // sound.amp(0);
  // env = new p5.Envelope();
  // env.setExp(true);
  return {x: x, y: y, vx: 0, vy: 0, fx: 0, fy: 0, hx: 0, hy: 0, d: 0};//, sound: sound, env: env};
}

newEdge = (n0, n1) => {
  return {l: n0, r: n1};
}

createGraph = (edgeList) => {
  const edges = [];
  const nodeMap = new Map();
  for (let i = 0; i < edgeList.length; i++) {
    const [a, b] = edgeList[i];
    if (!nodeMap.has(a)) nodeMap.set(a, newNode(random(width / fScale), random(height / fScale)));
    if (!nodeMap.has(b)) nodeMap.set(b, newNode(random(width / fScale), random(height / fScale)));
    edges.push(newEdge(nodeMap.get(a), nodeMap.get(b)));
  }
  const nodes = [...nodeMap.values()];
  return { nodes, edges};
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
      let d = dist(ni.x, ni.y, mouseX / fScale, mouseY / fScale);
      ni.hx = 1000 * (ni.x - mouseX / fScale) / (d * d);
      ni.hy = 1000 * (ni.y - mouseY / fScale) / (d * d);
    }
  }
  // node interaction
  for (let i = 0; i < n.length - 1; i++) {
    for (let j = i + 1; j < n.length; j++) {
      let ni = n[i], nj = n[j];
      let d = dist(ni.x, ni.y, nj.x, nj.y);
      if (1 < d && d < 180) {
        let f = 100 / (d * d);
        let fx = f * (ni.x - nj.x) / d;
        let fy = f * (ni.y - nj.y) / d;
        ni.fx += fx;
        nj.fx -= fx;
        ni.fy += fy;
        nj.fy -= fy;
      }
    }
  }
  // edge interaction
  for (let i = 0; i < e.length; i++) {
    const l = e[i].l;
    const r = e[i].r;
    if (l != r) {
      const d = dist(l.x, l.y, r.x, r.y);
      if (d > 0) {
        const f = (sLen - d) * 0.1;
        const fx = f * (l.x - r.x) / d
        const fy = f * (l.y - r.y) / d;
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
    }
  }
}

checkCollisions = (g1, g2) => {
  const n1 = g1.nodes;
  const n2 = g2.nodes;
  for (let i = 0; i < n1.length; i++) {
    for (j = 0; j < n2.length; j++) {
      const ni = n1[i];
      const nj = n2[j];
      const dx = nj.x - ni.x;
      const dy = nj.y - ni.y;
      const d = sqrt(dx * dx + dy * dy);
      if (d < (ni.d + nj.d) / 2) {
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
        playCollisions(ni, nj);
        // push nodes apart slightly to prevent sticking
        const overlap = ((ni.d + nj.d) / 2 - d) / 2;
        const angle = atan2(dy, dx);
        ni.x -= cos(angle) * overlap;
        ni.y -= sin(angle) * overlap;
        nj.x += cos(angle) * overlap;
        nj.y += sin(angle) * overlap;
      }
    }
  }
}

updateNodesPos = (g) => {
  const n = g.nodes;
  for (let i = 0; i < n.length; i++) {
    let ni = n[i];
    // update velocity
    ni.vx += ni.fx * dt;
    ni.vy += ni.fy * dt;
    // update velocity loss
    ni.vx *= vLoss;
    ni.vy *= vLoss;
    // update position
    ni.x += (ni.vx + (random(rWalk) - rWalk / 2) / ni.d) * dt;
    ni.y += (ni.vy + (random(rWalk) - rWalk / 2) / ni.d) * dt;
    // check bouncing - update position and velocity
    if (ni.x < 0 || ni.x > width / fScale) {
      ni.vx *= abs(ni.vx) < 100 ? -xBounce : -1/xBounce;
      ni.x = ni.x < 0 ? 0 : width / fScale;
      ni.x += ni.vx * dt;
    }
    if (ni.y < 0 || ni.y > height / fScale) {
      ni.vy *= abs(ni.vy) < 100 ? -yBounce : -1/yBounce;
      ni.y = ni.y < 0 ? 0 : height / fScale;
      ni.y += ni.vy * dt;
    }
    // update heading
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

