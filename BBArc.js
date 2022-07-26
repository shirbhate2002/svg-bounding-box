//import * as Math from 'Math';
var M_PI;
M_PI = 3.141592653589793;
Math.fmod = function (a,b) { return Number((a - (Math.floor(a / b) * b)).toPrecision(8)); };

function getAngle(bx, by) {
  return Math.fmod(2 * M_PI + (by > 0.0 ? 1.0 : -1.0) * Math.acos(bx / Math.pow(bx * bx + by * by, 0.5)), 2 * M_PI);
}

function BBArc(x1, y1, rx, ry, phi, largeArc, sweep, x2, y2) {
  var angle1, angle2, cx, cxprime, cy, cyprime, factor, otherArc, radicant, ratio, tmpX, tmpY, txmax, txmin, tymax, tymin, x1prime, xmax, xmin, y1prime, ymax, ymin;

  if (rx < 0.0) {
    rx *= -1.0;
  }

  if (ry < 0.0) {
    ry *= -1.0;
  }

  if (rx === 0.0 || ry === 0.0) {
    return {
      "xmin": x1 < x2 ? x1 : x2,
      "xmax": x1 > x2 ? x1 : x2,
      "ymin": y1 < y2 ? y1 : y2,
      "ymax": y1 > y2 ? y1 : y2
    };
  }

  x1prime = Math.cos(phi) * (x1 - x2) / 2 + Math.sin(phi) * (y1 - y2) / 2;
  y1prime = -1 * Math.sin(phi) * (x1 - x2) / 2 + Math.cos(phi) * (y1 - y2) / 2;
  radicant = rx * rx * ry * ry - rx * rx * y1prime * y1prime - ry * ry * x1prime * x1prime;
  radicant /= rx * rx * y1prime * y1prime + ry * ry * x1prime * x1prime;
  cxprime = 0.0;
  cyprime = 0.0;

  if (radicant < 0.0) {
    ratio = rx / ry;
    radicant = y1prime * y1prime + x1prime * x1prime / (ratio * ratio);

    if (radicant < 0.0) {
      return {
        "xmin": x1 < x2 ? x1 : x2,
        "xmax": x1 > x2 ? x1 : x2,
        "ymin": y1 < y2 ? y1 : y2,
        "ymax": y1 > y2 ? y1 : y2
      };
    }

    ry = Math.pow(radicant, 0.5);
    rx = ratio * ry;
  } else {
    factor = (largeArc === sweep ? -1.0 : 1.0) * Math.pow(radicant, 0.5);
    cxprime = factor * rx * y1prime / ry;
    cyprime = -factor * ry * x1prime / rx;
  }

  cx = cxprime * Math.cos(phi) - cyprime * Math.sin(phi) + (x1 + x2) / 2;
  cy = cxprime * Math.sin(phi) + cyprime * Math.cos(phi) + (y1 + y2) / 2;

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

      tmpY = cy + rx * Math.cos(txmin) * Math.sin(phi) + ry * Math.sin(txmin) * Math.cos(phi);
      txmin = getAngle(xmin - cx, tmpY - cy);
      tmpY = cy + rx * Math.cos(txmax) * Math.sin(phi) + ry * Math.sin(txmax) * Math.cos(phi);
      txmax = getAngle(xmax - cx, tmpY - cy);
      tymin = Math.atan(ry / (Math.tan(phi) * rx));
      tymax = Math.atan(ry / (Math.tan(phi) * rx)) + M_PI;
      ymin = cy + rx * Math.cos(tymin) * Math.sin(phi) + ry * Math.sin(tymin) * Math.cos(phi);
      ymax = cy + rx * Math.cos(tymax) * Math.sin(phi) + ry * Math.sin(tymax) * Math.cos(phi);

      if (ymin > ymax) {
        [ymin, ymax] = [ymax, ymin];
        [tymin, tymax] = [tymax, tymin];
      }

      tmpX = cx + rx * Math.cos(tymin) * Math.cos(phi) - ry * Math.sin(tymin) * Math.sin(phi);
      tymin = getAngle(tmpX - cx, ymin - cy);
      tmpX = cx + rx * Math.cos(tymax) * Math.cos(phi) - ry * Math.sin(tymax) * Math.sin(phi);
      tymax = getAngle(tmpX - cx, ymax - cy);
    }
  }

  angle1 = getAngle(x1 - cx, y1 - cy);
  angle2 = getAngle(x2 - cx, y2 - cy);

  if (!sweep) {
    [angle1, angle2] = [angle2, angle1];
  }

  otherArc = false;

  if (angle1 > angle2) {
    [angle1, angle2] = [angle2, angle1];
    otherArc = true;
  }

  if (!otherArc && (angle1 > txmin || angle2 < txmin) || otherArc && !(angle1 > txmin || angle2 < txmin)) {
    xmin = x1 < x2 ? x1 : x2;
  }

  if (!otherArc && (angle1 > txmax || angle2 < txmax) || otherArc && !(angle1 > txmax || angle2 < txmax)) {
    xmax = x1 > x2 ? x1 : x2;
  }

  if (!otherArc && (angle1 > tymin || angle2 < tymin) || otherArc && !(angle1 > tymin || angle2 < tymin)) {
    ymin = y1 < y2 ? y1 : y2;
  }

  if (!otherArc && (angle1 > tymax || angle2 < tymax) || otherArc && !(angle1 > tymax || angle2 < tymax)) {
    ymax = y1 > y2 ? y1 : y2;
  }

  return {
    "xmin": xmin,
    "xmax": xmax,
    "ymin": ymin,
    "ymax": ymax
  };
}

module.exports={BBArc};