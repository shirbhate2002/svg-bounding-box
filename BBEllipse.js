var M_PI;
M_PI = 3.141592653589793;

function BBEllipse(cx, cy, rx, ry, phi) {
  var txmax, txmin, tymax, tymin, xmax, xmin, ymax, ymin;

  if (rx < 0.0) {
    rx *= -1.0;
  }

  if (ry < 0.0) {
    ry *= -1.0;
  }

  if (rx === 0.0 || ry === 0.0) {
    return {
      "xmin": 0,
      "xmax": 0,
      "ymin": 0,
      "ymax": 0
    };
  }

  if (phi === 0 || phi === M_PI) {
    xmin = cx - rx;
    txmin = getAngle(-rx, 0);
    xmax = cx + rx;
    txmax = getAngle(rx, 0);
    ymin = cy - ry;
    tymin = getAngle(0, -ry);
    ymax = cy + ry;
    tymax = getAngle(0, ry);
  } else {
    if (phi === M_PI / 2.0 || phi === 3.0 * M_PI / 2.0) {
      xmin = cx - ry;
      txmin = getAngle(-ry, 0);
      xmax = cx + ry;
      txmax = getAngle(ry, 0);
      ymin = cy - rx;
      tymin = getAngle(0, -rx);
      ymax = cy + rx;
      tymax = getAngle(0, rx);
    } else {
      txmin = -1 * Math.atan(ry * Math.tan(phi) / rx);
      txmax = M_PI - Math.atan(ry * Math.tan(phi) / rx);
      xmin = cx + rx * Math.cos(txmin) * Math.cos(phi) - ry * Math.sin(txmin) * Math.sin(phi);
      xmax = cx + rx * Math.cos(txmax) * Math.cos(phi) - ry * Math.sin(txmax) * Math.sin(phi);

      if (xmin > xmax) {
        [xmin, xmax] = [xmax, xmin];
        [txmin, txmax] = [txmax, txmin];
      }

      tymin = Math.atan(ry / (Math.tan(phi) * rx));
      tymax = Math.atan(ry / (Math.tan(phi) * rx)) + M_PI;
      ymin = cy + rx * Math.cos(tymin) * Math.sin(phi) + ry * Math.sin(tymin) * Math.cos(phi);
      ymax = cy + rx * Math.cos(tymax) * Math.sin(phi) + ry * Math.sin(tymax) * Math.cos(phi);

      if (ymin > ymax) {
        [ymin, ymax] = [ymax, ymin];
        [tymin, tymax] = [tymax, tymin];
      }
    }
  }

  return {
    "xmin": xmin,
    "xmax": xmax,
    "ymin": ymin,
    "ymax": ymax
  };
}

module.exports={BBEllipse};