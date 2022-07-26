function BBLine(x1, y1, x2, y2) {
    return {
      "xmin": Math.min(x1, x2),
      "xmax": Math.max(x1, x2),
      "ymin": Math.min(y1, y2),
      "ymax": Math.max(y1, y2)
    };
  }

  module.exports={BBLine};
  