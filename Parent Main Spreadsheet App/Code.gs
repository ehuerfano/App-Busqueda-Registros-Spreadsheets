function createMirrorSheet(){
  var destFolder = DriveApp.getFolderById(mainFolderId); 
  var title = "Nueva hoja espejo";
  var url = DriveApp.getFileById(templateSheetId).makeCopy(title, destFolder).getUrl(); 
  showCreatedMirrorSheet(title, url);
}

function pasteMirrorSheetValues(){
  // var ss = SpreadsheetApp.getActiveSpreadsheet();
  var row = ss.getActiveCell().getRow();
  var col = ss.getActiveCell().getColumn();
  if(row > 5) return;

  let mirrorSheetUrl = Browser.inputBox('Copia el enlace de la hoja espejo que quieres mostrar acá')
  if(mirrorSheetUrl == 'cancel') return;
  
  var [titleFormula,rangeFormula] = getFormulasForMirrorSheet(mirrorSheetUrl);

  ss.getActiveSheet().getRange(1,col).setValue(titleFormula);
  ss.getActiveSheet().getRange(5,col).setValue(rangeFormula);
}

function writeColumnIndexes() {
  // var ss = SpreadsheetApp.getActiveSpreadsheet();
  var active = ss.getActiveSheet();

  var indicesObj = {};
  
  var columns = active.getMaxColumns();
  for(let col=1; col<=columns; col++){
    var columnName = active.getRange(1,col).getValue();
    var indexName = createColumnIndexName(columnName);

    if(!indicesObj[indexName]){
      indicesObj[indexName] = 1;
    }else if(indicesObj[indexName] == 1){
      let count = 1;
      while(indicesObj[indexName] == 1){
        if(indexName == '') break;
        indexName += 'X';
        count++;
      }
      indicesObj[indexName] = 1;
    }
    active.getRange(3,col).setValue(indexName);
  }

  ss.getActiveSheet().getRange('4:4').insertCheckboxes();
}

function getSheetColumns(){
  // var ss = SpreadsheetApp.getActiveSpreadsheet();
  var active = ss.getActiveSheet();

  var values = active.getRange(1,1,3,active.getMaxColumns()).getValues();
  var columns = {}
  columns.titles = values[0];
  columns.indices = values[2];
  
  return columns;
}



