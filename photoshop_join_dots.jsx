// Joins pairs of circles with lines in different layer groups
// In each top level layer group, takes 2 circle shape layers (named like "Ellipse..."),
// detects centers of each circle and draws and fills a rectangular path between the centers


var doc = app.activeDocument;

const LINE_WIDTH = 2;


function dump(o) {
  var text = '';
  for (var p in o) text += p + "\n";
  return text;
}


function getLineShapePoints(point1, point2, w) {
  var x1 = point1[0];
  var y1 = point1[1];
  var x2 = point2[0];
  var y2 = point2[1];
  
  var alpha = Math.atan((y2 - y1) / (x2 - x1));
  var dx = w/2 * Math.sin(alpha);
  var dy = w/2 * Math.cos(alpha);
  
  if (dx == Math.sin(Math.PI)) dx = 0;
  if (dy == Math.cos(Math.PI/2)) dy = 0;
  
  var p1 = [x1 + dx, y1 - dy];
  var p2 = [x1 - dx, y1 + dy];
  var p3 = [x2 - dx, y2 + dy];
  var p4 = [x2 + dx, y2 - dy];
  
  return [p1, p2, p3, p4];
}


function drawLine(parent, point1, point2) {
  parent.artLayers.add();
  
  var shapePoints = getLineShapePoints(point1, point2, LINE_WIDTH);
  
  var lineArray = [];
  for (var i = 0; i < 4; i++) {
    var info = new PathPointInfo();
    info.kind = PointKind.CORNERPOINT;
    info.anchor = shapePoints[i];
    info.leftDirection = shapePoints[i];
    info.rightDirection = shapePoints[i];
    lineArray.push(info);
  }
  
  var lineSubPathArray = new SubPathInfo();
  lineSubPathArray.closed = true;
  lineSubPathArray.operation = ShapeOperation.SHAPEADD;
  lineSubPathArray.entireSubPath = lineArray;
  
  var myPathItem = doc.pathItems.add(parent.name+"_path", [lineSubPathArray]);
  
  var colorRef = new SolidColor();
  colorRef.rgb.red   = 151;
  colorRef.rgb.green = 151;
  colorRef.rgb.blue  = 151;
  
  // myPathItem.strokePath(ToolType.PENCIL);
  myPathItem.fillPath(colorRef, ColorBlendMode.NORMAL, 100, false, 0, true, true);
  myPathItem.remove();
}


function connectCircles(layers) {
  var centers = [];
  
  for (var i = 0; i < layers.length; i++) {
    doc.activeLayer = layers[i];
    var shape = doc.pathItems[0].subPathItems[0];
    var points = shape.pathPoints;
    
    var xd = Math.abs(points[0].rightDirection[0] - points[0].leftDirection[0]) / 2;
    var yd = Math.abs(points[1].rightDirection[1] - points[1].leftDirection[1]) / 2;
    
    var minX = (points[0].leftDirection[0] < points[0].rightDirection[0]) ? points[0].leftDirection[0]: points[0].rightDirection[0];
    var minY = (points[1].leftDirection[1] < points[1].rightDirection[1]) ? points[1].leftDirection[1]: points[1].rightDirection[1];
    
    var cx = minX + xd;
    var cy = minY + yd;
    
    centers.push([cx, cy]);
  }
  
  drawLine(layers[0].parent, centers[0], centers[1]);
}


// -----------------------------------------------------------------------------
function main() {
  var connected = 0;
  var connect_groups = [];
  
  for (var i = 0; i < doc.layers.length; i++) {
    var L = doc.layers[i];
    if (!L.layers) continue;
    
    var circle_layers = [];
    
    for (var j = 0; j < L.layers.length; j++) {
      var LL = L.layers[j];
      if (LL.name.search('Ellipse') == -1 || !LL.visible) continue;
      
      text += LL.name + '\n';
      circle_layers.push(LL);
    }
    
    if (circle_layers.length != 2) continue;
    connect_groups.push(circle_layers);
  }
  
  for (var i = 0; i < connect_groups.length; i++) {
    connectCircles(connect_groups[i]);
  }
}


main();
