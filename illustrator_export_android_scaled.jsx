
// Export script for Illustrator
// Creates scaled images for Android apps
// runScaleUp()   - scales up from a mdpi image
// runScaleDown() - scales down from a xxxhdpi image
// filename is taken from the first artboard name
// -------------------

var export_path = 'c:/_export/';
var docRef = app.activeDocument;


// ----- Utils -----
function createFolder(path) {
  var folder = new Folder(path);
  if (!folder.exists) folder.create();
}

function getDocName() {
  var docNameExt = docRef.name;
  var docName = /^(.+)\.[^.]+$/.exec(docNameExt)[1];
  return docName;
}


// ----- Main -----
function scaleImage(scaleUp) {
  if (app.documents.length == 0) return;
  var folder_path = export_path + getDocName() + '/';
  
  var art_id = 0;
  
  var artboard = docRef.artboards[art_id];
  docRef.artboards.setActiveArtboardIndex(art_id);
  
  var file_name = artboard.name;
  var prefix = 'drawable-';
  
  var opt = new ExportOptionsPNG24();
  var type = ExportType.PNG24;
  
  var scales = [
    ['xxxhdpi', 1],
    ['xxhdpi',  0.75],
    ['xhdpi',   0.5],
    ['hdpi',    0.375],
    ['mdpi',    0.25],
  ];
  
  if (scaleUp) {
    scales = [
      ['mdpi',    1],
      ['hdpi',    1.5],
      ['xhdpi',   2],
      ['xxhdpi',  3],
      ['xxxhdpi', 4],
    ];
  }
  
  createFolder(folder_path);
  
  for (var i in scales) {
    var scale = scales[i];
    var suffix = scale[0];
    var factor = scale[1];
    
    var imageFolder = folder_path + prefix + suffix;
    createFolder(imageFolder);
    
    var fp = imageFolder + '/' + file_name;
    var spec = new File(fp);
    
    opt.artBoardClipping = true;
    opt.transparency = true;
    
    opt.horizontalScale = factor * 100.0;
    opt.verticalScale = factor * 100.0;
    
    docRef.exportFile(spec, type, opt);
  }
  
  alert('Images Exported to: "' + folder_path + '"');
}

function runScaleUp() {
  scaleImage(true);
}
function runScaleDown() {
  scaleImage(false);
}


// ----------------------------
// runScaleUp();
runScaleDown();
