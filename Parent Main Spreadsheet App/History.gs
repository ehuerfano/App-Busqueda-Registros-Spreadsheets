function getHistoryLink(){
  var [url] = getDocumentProperties(['historyLink'])
  if(!url) {
    var url = createBlankSpreadsheet();
    SpreadsheetApp.openByUrl(url).setName('Historial ' + ss.getName());
    setDocumentProperties(['historyLink'],[url]);
    return url;
  }
  else return url;
}

function moveToHistory() {  
  var name = Browser.inputBox('Escribe un nombre para la nueva en el historial:');
  if(name == 'cancel') return;
  name += ` (${new Date().toISOString().split('T')[0]})`;
  showLoadingDialog();

  var historyUrl = getHistoryLink();
  var ss1 = SpreadsheetApp.openByUrl(historyUrl);

  ss.getActiveSheet().copyTo(ss1).setName(name).deleteRows(2,3);
  ss1.getSheetByName(name).activate();
  ss1.moveActiveSheet(1);

  var ogSheet = ss1.getSheetByName('View only');
  if(ogSheet) ss1.deleteSheet(ogSheet);
  seeHistoryLink();
}

function seeHistoryLink(){
  var url = getHistoryLink();
  var name = SpreadsheetApp.openByUrl(url).getName();
  showUrl(url, `Archivo historial: "${name}"`);
}

// function createHistorySheet(){
//   var destFolder = DriveApp.getFolderById(historyFolderId); 
//   var title = "Historial programa";
//   var programSheetId = SpreadsheetApp.getActive().getId();
//   var url = DriveApp.getFileById(programSheetId).makeCopy(title, destFolder).getUrl();
//   // SpreadsheetApp.openByUrl(url).getSheets();
//   setDocumentProperties(['historyLink'],[url]);
//   return url;
//   // showCreatedProgramSheet(title, url);
// }