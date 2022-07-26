function pointOnCurve2(ax, ay, bx, by, cx, cy, t) {
  var c1, c2;

  if (t <= 0 || 1 <= t) {
    return -1;
  }

  c1 = [ax + (bx - ax) * t, ay + (by - ay) * t];
  c2 = [bx + (cx - bx) * t, by + (cy - by) * t];
  return [c1[0] + (c2[0] - c1[0]) * t, c1[1] + (c2[1] - c1[1]) * t];
}

function BBQuadratic_Bezier(ax, ay, bx, by, cx, cy) {
  var Ex, bounds, tvalues;
  tvalues = [];
  bounds = [[ax, cx], [ay, cy]];

  if (ax - 2 * bx + cx !== 0) {
    tvalues.append((ax - bx) / (ax - 2 * bx + cx));
  }

  if (ay - 2 * by + cy !== 0) {
    tvalues.append((ay - by) / (ay - 2 * by + cy));
  }

  for (var t, _pj_c = 0, _pj_a = tvalues, _pj_b = _pj_a.length; _pj_c < _pj_b; _pj_c += 1) {
    t = _pj_a[_pj_c];
    Ex = pointOnCurve2(ax, ay, bx, by, cx, cy, t);

    if (Ex !== -1) {
      bounds[0].append(Ex[0]);
      bounds[1].append(Ex[1]);
    }
  }

  return {
    "xmin": min(bounds[0]),
    "xmax": max(bounds[0]),
    "ymin": min(bounds[1]),
    "ymax": max(bounds[1])
  };
}

module.exports={BBQuadratic_Bezier};