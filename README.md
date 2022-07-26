
# Finding SVG Bounding-Box

A mathematical way to find the Bounding-Box for the complex SVG. Using the characteristic that curves have zero slope at their maximums.

## References

 - [SVG Basics](https://jenkov.com/tutorials/svg/index.html)
 - [The Beauty of Bézier Curves](https://youtu.be/aVwxzDHniEw)


## Methods


| Function name | Parameter |
| :-------- | :------- |
| `BBArc` | `x1, y1, rx, ry, phi, largeArc, sweep, x2, y2` |
| `BBCubic_Bezier` | `x1, y1, c1x, c1y, c2x, c2y, x2, y2` |
| `BBEllipse` | `cx, cy, rx, ry, phi` |
| `BBQuadratic_Bezier` | `x1, y1, c1x, c1y, x2, y2` |
| `BBLine` | `x1, y1, x2, y2` |





## Results

| Input SVG | Output  |
| :-------- | :------- |
| ![App Screenshot](https://github.com/shirbhate2002/svg-bounding-box/blob/master/ss/ss1.png)| ![App Screenshot](https://github.com/shirbhate2002/svg-bounding-box/blob/master/ss/ss_r1.png)|
| ![App Screenshot](https://github.com/shirbhate2002/svg-bounding-box/blob/master/ss/ss2.png)| ![App Screenshot](https://github.com/shirbhate2002/svg-bounding-box/blob/master/ss/ss_r2.png)|




## Required Packages


- [svgo](https://www.npmjs.com/package/@xmldom/xmldom)
- [@xmldom/xmldom](https://github.com/svg/svgo)


