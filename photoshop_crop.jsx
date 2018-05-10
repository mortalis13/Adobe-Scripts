
// Crop image

var doc = app.activeDocument;

var w = 850;
var h = doc.height;

doc.crop(Array(0, 0, w, h));
