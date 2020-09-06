
// Export script for Illustrator
// Creates images for app icon using first 5 artboards
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
function exportOriginalAppIconAndroid(folder_path, scale, file_name) {
  if (app.documents.length > 0) {
    var opt = new ExportOptionsPNG24();
    var type = ExportType.PNG24;
    
    createFolder(folder_path);
    
    var imageFolder = folder_path + scale;
    createFolder(imageFolder);
    
    var fp = imageFolder + '/' + file_name;
    var spec = new File(fp);
    
    opt.artBoardClipping = true;
    opt.transparency = true;
    
    docRef.exportFile(spec, type, opt);
  }
}


function runDrawable() {
  var folder_path = export_path + getDocName() + '/';
  
  var file_name = 'ic_launcher';
  var prefix = 'mipmap-';
  var scales = [
    'xxxhdpi',
    'xxhdpi',
    'xhdpi',
    'hdpi',
    'mdpi',
  ];
  
  var i = 0;
  for (i = 0; i < scales.length; i++) {
    var artboard = docRef.artboards[i];
    docRef.artboards.setActiveArtboardIndex(i);
    exportOriginalAppIconAndroid(folder_path, prefix+scales[i], file_name);
  }
  
  alert('PNG exported: ' + i + ' artboards to: "' + folder_path + '"');
}


// ----------------
runDrawable();
