newNode = (x, y) => {
  return {x: x, y: y, vx: 0, vy: 0, fx: 0, fy: 0, hx: 0, hy: 0, d: 0};
}

newEdge = (n0, n1) => {
  return {l: n0, r: n1};
}

updateNodesForces = (e, n) => {
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
      // d-squared
      let d = dist(ni.x, ni.y, mouseX, mouseY);
      ni.fx = 1000 * (ni.x - mouseX) / (d * d);
      ni.fy = 1000 * (ni.y - mouseY) / (d * d);
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
    let l = n[e[i].l - 1], r = n[e[i].r - 1];
    if (l != r) {
      let d = dist(l.x, l.y, r.x, r.y);
      if (d > 0) {
        let f = (sLen - d) * 0.1;
        let fx = f * (l.x - r.x) / d, fy = f * (l.y - r.y) / d;
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
  // // center mass
  // let mx = 0, my = 0;
  // for (let i = 0; i < n.length - 1; i++) {
  //   let ni = n[i];
  //   mx += ni.x;
  //   my += ni.y;
  // }
  // mx /= n.length;
  // my /= n.length;
  // for (let i = 0; i < n.length; i++) {
  //   let ni = n[i];
  //   let d = dist(ni.x, ni.y, mx, my);
  //   if (d > 0) {
  //     let f = 1000 * ni.d / (d * d);
  //     let fx = f * (ni.x - mx) / d;
  //     let fy = f * (ni.y - my) / d;
  //     ni.fx += fx;
  //     ni.fy += fy;
  //   }
  // }
}

updateNodesPos = (n) => {
  for (let i = 0; i < n.length; i++) {
    let ni = n[i];
    // update velocity
    ni.vx += ni.fx * dt;
    ni.vy += ni.fy * dt;
    // update velocity loss
    ni.vx *= vLoss;
    ni.vy *= vLoss;
    // update position
    ni.x += ni.vx * dt;
    ni.y += ni.vy * dt;
    // check bouncing - update position and velocity
    if (ni.x < 0 || ni.x > width) {
      ni.vx *= -2;
      ni.x += ni.vx * dt;
    }
    if (ni.y < 0 || ni.y > height) {
      ni.vy *= -2;
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
  let patt = r[0];
  if (patt.length > e.length) return false;
  let nodes = {};
  for (let i = 0; i < patt.length; i++) {
    let il = patt[i][0];
    let ir = patt[i][1];
    if (!nodes[il]) nodes[il] = e[i].l
    else if (nodes[il] != e[i].l) return false;
    if (!nodes[ir]) nodes[ir] = e[i].r
    else if (nodes[ir] != e[i].r) return false;
  }
  return nodes;
}

replaceNodes = (r, nodes) => {
  let res = [];
  let repl = r[1];
  for (let i = 0; i < repl.length; i++) {
    let il = repl[i][0];
    let ir = repl[i][1];
    if (!nodes[il]) {
      nodes[il] = n.length + 1;
      n.push(newNode(random(width), random(height)));
    }
    if (!nodes[ir]) {
      nodes[ir] = n.length + 1;
      n.push(newNode(random(width), random(height)));
    }
    res.push(newEdge(nodes[il], nodes[ir]));
  }
  return res;
}

ruleApply = (r, e) => {
  let res = e.slice(0); // copy
  for (let i = 0; i < e.length - 1; i++) {
    for (let j = i + 1; j < e.length; j++) {
      let nodes = matchNodes(r, [e[i], e[j]]);
      if (!nodes) continue;
      let edges  = replaceNodes(r, nodes);
      res[i] = edges[0];
      res[j] = edges[1];
      for (let k = 2; k < edges.length; k++) res.push(edges[k]);
    }
  }
  return(res);
}

