const mainFolderId = '11IZK6hiBakYCNgQMfx4m-1T0euP-BQiG';
const templateSheetId = '18i85sTEdoILukc2W3TdEVNpV-QLvPiZECw0LUcJEj7A';
const templateMirrorSheetId = '1lj5YfrJMxO3Z3mnLv-l7_BFHS3EQ32fhLbIi3RdKRmw';
const mirrorSheetsFolderId = '1fkPwq7plgXtVbV33X5rOikv4P_4T4OsI';

const historyFolderId = '1ts43OWnaYHLvJebkDaFJVv4UN6i1MtK6';

const WebAppUrl = 'https://script.google.com/macros/s/AKfycbz7aiNm-YO1hzmICctSfcdxErcaA_1OVoB6ULndACmgarB851ZN8XqnfGqGYfD86FGQ/exec'; 

var ss = SpreadsheetApp.getActiveSpreadsheet();

function onOpen(e){  
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('WEB APP')
      .addItem('Ver web app', 'showWebAppUrl')
      .addToUi();

    ui.createMenu('HOJA')
      .addItem('Actualizar indices', 'writeColumnIndexes')
        .addSubMenu(ui.createMenu('Historial')
          .addItem('Copiar versión actual al historial', 'moveToHistory')
          .addItem('Ver historial de programa', 'seeHistoryLink'))
        .addSubMenu(ui.createMenu('Hojas espejo')
          // .addItem('Crear nueva hoja espejo editable', 'createMirrorSheet')
          // .addItem('Conectar hoja espejo', 'pasteMirrorSheetValues')
          .addItem('Crear hoja espejo de lectura', 'showMirrorSheetForm'))
      .addToUi();
}
