
// Export script for Illustrator
// Creates scaled images for Android apps
// runImage() - for PNG drawables based on mdpi size (scale 1x)
// runIcon() - for app icon PNG based on xxxhdpi size (192x192 px, 1x), scales down for other sizes
// supports export from multiple artboards
// filename is taken from the artboard name
// -------------------

var export_path = 'e:/Documents/_export/';

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
function exportPngAndroid(file_name, folder_path) {
  if (app.documents.length > 0) {
    var opt = new ExportOptionsPNG24();
    var type = ExportType.PNG24;
    
    var prefix = 'drawable-';
    
    var scales = [
      ['ldpi', 0.75],
      ['mdpi', 1],
      ['hdpi', 1.5],
      ['xhdpi', 2],
      ['xxhdpi', 3],
      ['xxxhdpi', 4],
    ];
    
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
  }
}


function exportAppIconAndroid(file_name, folder_path) {
  if (app.documents.length > 0) {
    var opt = new ExportOptionsPNG24();
    var type = ExportType.PNG24;
    
    var prefix = 'mipmap-';
    
    var scales = [
      ['mdpi', 0.25],
      ['hdpi', 0.375],
      ['xhdpi', 0.5],
      ['xxhdpi', 0.75],
      ['xxxhdpi', 1],
    ];
    
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
  }
}

function exportOriginalAppIconAndroid(artboard_name, folder_path) {
  if (app.documents.length > 0) {
    var opt = new ExportOptionsPNG24();
    var type = ExportType.PNG24;
    
    var file_name = 'ic_launcher';
    var prefix = 'mipmap-';
    
    var scales = [
      ['48', 'mdpi'],
      ['72', 'hdpi'],
      ['96', 'xhdpi'],
      ['144', 'xxhdpi'],
      ['192', 'xxxhdpi'],
    ];
    
    var suffix = '';
    
    for (var i in scales) {
      var scale = scales[i];
      if (artboard_name.indexOf(scale[0]) != -1) {
        suffix = scale[1];
        break;
      }
    }
    if (!suffix) return;
    
    createFolder(folder_path);
    
    var imageFolder = folder_path + prefix + suffix;
    createFolder(imageFolder);
    
    var fp = imageFolder + '/' + file_name;
    var spec = new File(fp);
    
    opt.artBoardClipping = true;
    opt.transparency = true;
    
    docRef.exportFile(spec, type, opt);
  }
}


function runImage() {
  var folder_path = export_path + getDocName() + '/';
  
  var count = 0;
  var artboards = docRef.artboards;
  for (var i = 0; i < artboards.length; i++) {
    var artboard = artboards[i];
    docRef.artboards.setActiveArtboardIndex(i);
    
    var file_name = artboard.name;
    exportPngAndroid(file_name, folder_path);
    count++;
  }
  
  alert('PNG exported: ' + count + ' artboards');
}


function runIcon(scaleImage) {
  var folder_path = export_path + getDocName() + '/';
  
  var count = 0;
  var artboards = docRef.artboards;
  for (var i = 0; i < artboards.length; i++) {
    var artboard = artboards[i];
    docRef.artboards.setActiveArtboardIndex(i);
    
    var file_name = artboard.name;
    if (scaleImage) {
      exportAppIconAndroid(file_name, folder_path);
    }
    else {
      exportOriginalAppIconAndroid(file_name, folder_path);
    }
    
    count++;
  }
  
  alert('PNG exported: ' + count + ' artboards');
}

function test() {
  var docName = docRef.name;
  alert(docName);
  return;
  
  if (app.documents.length > 0) {
    var opt = new ExportOptionsPNG24();
    var type = ExportType.PNG24;
    var fp = 'e:/0/f1';
    var spec = new File(fp);
    
    // opt.antiAliasing = false;
    // opt.transparency = true;
    // opt.saveAsHTML = true;
    
    opt.artBoardClipping = true;
    opt.transparency = true;
    
    docRef.exportFile(spec, type, opt);
  }
}


// ----------------------------
// runImage();
// runIcon(true);
runIcon(false);
// test();
