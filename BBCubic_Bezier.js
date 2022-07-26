function BBCubic_Bezier(x0, y0, x1, y1, x2, y2, x3, y3) {
    var a, b, b2ac, bounds, c, j, mt, sqrtb2ac, t, t1, t2, tvalues, x, y;
    tvalues = [];
    bounds = [[], []];
  
    for (var i = 0, _pj_a = 2; i < _pj_a; i += 1) {
      if (i === 0) {
        b = 6 * x0 - 12 * x1 + 6 * x2;
        a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
        c = 3 * x1 - 3 * x0;
      } else {
        b = 6 * y0 - 12 * y1 + 6 * y2;
        a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
        c = 3 * y1 - 3 * y0;
      }
  
      if (Math.abs(a) < 1e-12) {
        if (Math.abs(b) < 1e-12) {
          continue;
        }
  
        t = -c / b;
  
        if (0 < t && t < 1) {
          tvalues.push(t);
        }
  
        continue;
      }
  
      b2ac = b * b - 4 * c * a;
  
      if (b2ac < 0) {
        continue;
      }
  
      sqrtb2ac =Math.pow(b2ac, 0.5);
      t1 = (-b + sqrtb2ac) / (2 * a);
  
      if (0 < t1 && t1 < 1) {
        tvalues.push(t1);
      }
  
      t2 = (-b - sqrtb2ac) / (2 * a);
  
      if (0 < t2 && t2 < 1) {
        tvalues.push(t2);
      }
    }
  
    j = tvalues.length - 1;
  
    while (j >= 0) {
      t = tvalues[j];
      mt = 1 - t;
      x = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3;
      bounds[0].push(x);
      y = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
      bounds[1].push(y);
      j -= 1;
    }
  
    bounds[0].push(x0);
    bounds[1].push(y0);
    bounds[0].push(x3);
    bounds[1].push(y3);
    
    return {
      "xmin": Math.min.apply(null, bounds[0]),
      "ymin": Math.min.apply(null,bounds[1]),
      "xmax": Math.max.apply(null,bounds[0]),
      "ymax": Math.max.apply(null,bounds[1])
    };
}

module.exports={BBCubic_Bezier};