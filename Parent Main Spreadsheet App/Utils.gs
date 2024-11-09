function getFormulasForMirrorSheet(mirrorSpreadsheetUrl){
  // mirrorSpreadsheetUrl = mirrorSpreadsheetUrl.split('/edit')[0];
  var ss1 = SpreadsheetApp.openByUrl(mirrorSpreadsheetUrl);
  var mirrorSheet = ss1.getSheets()[0];

  var mirrorSheetName = mirrorSheet.getSheetName();
  var lastColumn = mirrorSheet.getMaxColumns();
  var lastRow = mirrorSheet.getMaxRows();
  var lastColumnA1Not = mirrorSheet.getRange(lastRow, lastColumn).getA1Notation().match(/([A-Z]+)/)[0];

  var titleFormula = `=IMPORTRANGE("${mirrorSpreadsheetUrl}";"'${mirrorSheetName}'!1:1")`;
  var rangeFormula = `=IMPORTRANGE("${mirrorSpreadsheetUrl}";"'${mirrorSheetName}'!A5:${lastColumnA1Not+lastRow.toString()}")`;
  
  return [titleFormula,rangeFormula];
}

function createColumnIndexName(name) {
  name = name.replace(/[^a-zA-Z0-9\s]/g, '');
  name = name.toLowerCase();
  const toCamelCase = (str) => str.replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) => idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase()).replace(/\s+/g, '');
  name = toCamelCase(name);

  return name;
}

function createCopyOfSheet(title){
  var destFolder = DriveApp.getFolderById(historyFolderId); 
  var programSheetId = SpreadsheetApp.getActive().getId();
  var url = DriveApp.getFileById(programSheetId).makeCopy(title, destFolder).getUrl();
  return url;
}

function createBlankSpreadsheet(title){
  var destFolder = DriveApp.getFolderById(mirrorSheetsFolderId); 
  var url = DriveApp.getFileById(templateMirrorSheetId).makeCopy(title, destFolder).getUrl();
  return url;
}

function getUserProperties(keys){
  var userProperties = PropertiesService.getUserProperties();
  var propertiesValues = [];
  keys.map(
    (key) => {
      propertiesValues.push(JSON.parse(userProperties.getProperty(key)))
    }
  )
  return propertiesValues;
}
function setUserProperties( keys, values){
  var userProperties = PropertiesService.getUserProperties();
  keys.map(
    (key, index) => {
      userProperties.setProperty(key, JSON.stringify(values[index]));
    }
  );
}
function deleteUserProperties(){
  // Delete all user properties in the current script.
  var userProperties = PropertiesService.getUserProperties();
  userProperties.deleteAllProperties();
}

function getDocumentProperties(keys){
  var documentProperties = PropertiesService.getDocumentProperties();
  var propertiesValues = [];
  keys.map(
    (key) => {
      propertiesValues.push(JSON.parse(documentProperties.getProperty(key)))
    }
  )
  return propertiesValues;
}
function setDocumentProperties( keys, values){
  var documentProperties = PropertiesService.getDocumentProperties();
  keys.map(
    (key, index) => {
      documentProperties.setProperty(key, JSON.stringify(values[index]));
    }
  );
}
function deleteDocumentProperties(){
  // Delete all document properties in the current script.
  var documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.deleteAllProperties();
}