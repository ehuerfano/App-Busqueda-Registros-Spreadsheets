// function showAppPreview() {
//   var ss1 = SpreadsheetApp.getActiveSpreadsheet();
//   var html = HtmlService.createTemplateFromFile('Responsive');
//   // var mockStudentId = ss1.getSheets()[0].getDataRange().getValues()[ID_ROW+1][0];
//   // var text = getStudentCode(mockStudentId);
//   var page = html.evaluate();
//   page.addMetaTag('viewport', 'width=device-width, initial-scale=1');
//   page.append(`<div class="container">`);
//   page.append(text);
//   page.append(`</div>`);
//   // return page.getContent();
//   output.setTitle('');
//   page.addMetaTag('viewport', 'width=device-width, initial-scale=1');
//   page.setWidth(2000).setHeight(700);
//   SpreadsheetApp.getUi().showModalDialog(page, 'Web app - Autogestión | CCA');
// }

// function showWebApp() { // private version
//   var html = HtmlService.createTemplateFromFile('Preview');
//   var page = html.evaluate();
//   page.setWidth(2000).setHeight(1000);
//   SpreadsheetApp.getUi().showModalDialog(page, 'Vista previa web app (versión privada)');
// }

function showUrl(url, title) {
  var html = HtmlService.createTemplateFromFile('ShareUrl');
  var page = html.evaluate();
  // page.append(`<div style="text-align:center;margin:50px auto 0;max-width:600px"></div>`);
  page.append(`<div class="field d-flex align-items-center justify-content-between">
                  <span class="fas fa-link text-center"></span> <input type="url" class="form-control" value="${url}">
                  <a class="btn btn-secondary" href="${url}" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">
                    <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"></path>
                    <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"></path>
</svg>
                  </a>  
                  <button class="btn btn-primary my-2">Copiar</button> 
              </div>`);
  // page.append(`</div>`);
  page.setWidth(500).setHeight(60);
  SpreadsheetApp.getUi().showModalDialog(page, title);
}

function showWebAppUrl() { // public version
  showUrl(WebAppUrl, 'Enlace público web app');
}

function showSheetUrl(title, filename, url){
  var htmlTemplate = HtmlService.createTemplateFromFile('Blank');
  var page = htmlTemplate.evaluate();  
  page.append(`<div style="text-align:center;margin:25px auto 0;max-width:600px"></div>`);
  page.append(`<a href="${url}" target="_blank" class="link-primary">${filename}.</a>`);
  page.append(`</div>`);
  page.setWidth(500).setHeight(80);
  SpreadsheetApp.getUi().showModalDialog(page, title);
}

function showCreatedMirrorSheet(filename, url){
  showSheetUrl(
    'Nueva hoja espejo de lectura creada', 
    filename + ' (ABRE LA HOJA Y OTORGA EL PERMISO PARA CONECTAR LA HOJA)', 
    url);
  // var htmlTemplate = HtmlService.createTemplateFromFile('Blank');
  // var page = htmlTemplate.evaluate();  
  // page.append(`<div style="text-align:center;margin:50px auto 0;max-width:600px"></div>`);
  // page.append(`Nueva hoja espejo de lectura creada: <a href="${url}" target="_blank" class="link-primary">${filename}.</a>. ABRE LA HOJA Y OTORGA EL PERMISO PARA CONECTAR LA HOJA`);
  // page.append(`</div>`);
  // page.setWidth(300).setHeight(200);
  // SpreadsheetApp.getUi().showModalDialog(page, 'Crear hoja espejo');
}

function showCreatedReadOnlyMirrorSheet(filename, url){
  showSheetUrl(
    'Nueva hoja espejo editable creada', 
    filename, 
    url);
  // var htmlTemplate = HtmlService.createTemplateFromFile('Blank');
  // var page = htmlTemplate.evaluate();  
  // page.append(`<div style="text-align:center;margin:50px auto 0;max-width:600px"></div>`);
  // page.append(`Nueva hoja espejo editable creada: <a href="${url}" target="_blank" class="link-primary">${filename}.</a>`);
  // page.append(`</div>`);
  // page.setWidth(300).setHeight(200);
  // SpreadsheetApp.getUi().showModalDialog(page, 'Crear hoja espejo');
}

// function showCreateViewOnlyMirrorSheet(){
//   var htmlTemplate = HtmlService.createTemplateFromFile('ChooseColumns');

//   var columns = getSheetColumns();
//   var page = htmlTemplate.evaluate();  
//   page.append(`<div style="text-align:center;margin:50px auto 0;max-width:600px"></div>`);
//   page.append(`Nueva hoja espejo editable creada: <a href="${url}" target="_blank" class="link-primary">${filename}.</a>`);
//   page.append(`</div>`);
//   page.setWidth(300).setHeight(200);
//   SpreadsheetApp.getUi().showModalDialog(page, 'Crear hoja espejo');
// }

function showLoadingDialog(action){
  var htmlOutput = HtmlService
    .createHtmlOutput(``)
    .setWidth(200)
    .setHeight(200);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, action ? action : 'Cargando...');
}

function closeLoadingDialog(action){
  var htmlOutput = HtmlService
    .createHtmlOutput(`<script>google.script.host.close();</script>`)
    .setWidth(200)
    .setHeight(200);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, action ? action : 'Success');
}

function showResponse(errorMessage){
  var htmlOutput = HtmlService
    .createHtmlOutput(`<div style="text-align: center; font-family: monospace;">${errorMessage}</div>`)
    .setWidth(300)
    .setHeight(200);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Resultado');
}

