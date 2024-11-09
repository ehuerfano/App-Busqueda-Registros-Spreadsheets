function showMirrorSheetForm(){
  var formItems = [];
  var columns = getSheetColumns();
  var titles = columns.titles;
  var indices = columns.indices;
  for(i in indices){
    if(indices[i] != '') formItems.push({index: indices[i], title: titles[i]});
  }

  var html = HtmlService.createTemplateFromFile('ChooseColumns');

  formItems.map(
    item =>  html[item] = item.index
  )  

  var page = html.evaluate();
  page.append(`<form id="infoForm" onsubmit="return validarForm(this)">`);
  // page.append(`<input type="hidden" id="type" name="type">`);
  formItems.map(
    (item, index) =>  page.append(getInputForm(item.index+'-'+index, item.title))
  )
  page.append(`<br><div class="col-md-12">`);
  page.append('<button type="submit" class="btn btn-primary my-2 ">Crear</button>');
  page.append(`</div>`);
  page.append('</form>');
  
  page.append(`</div>`);

  page.addMetaTag('viewport', 'width=device-width, initial-scale=1');
  page.setWidth(400).setHeight(500);
  setUserProperties(['formItems'],[formItems]);
  var programName = ss.getActiveSheet().getName();
  setUserProperties(['programName'],[programName]);
  SpreadsheetApp.getUi().showModalDialog(page, 'Crear hoja espejo de lectura');
}

function getInputForm(index, tablaTitle){
  var event = 'changeCheckbox(this)';
  var type = 'checkbox';

    return `<div class="form-check">
              <input 
                type="${type}" 
                class="form-check-input" 
                onclick="${event}" 
                id="${index}" 
                name="${index}"
                value="" >
              <label class="form-check-label" for="${index}">${tablaTitle}</label>
            </div>`;
}

function formChooseColumns(formObject){
  showLoadingDialog();
  // try{
    var form = JSON.parse(JSON.stringify(formObject));

    var chosen = {};
    for(let index in form){
      let columnIndex = index.split('-')[0];
      let columnNumber = index.split('-')[1];
      chosen[columnIndex] = columnNumber;
    }

    var [programName] = getUserProperties(['programName']);
    var mirrorSheetUrl = createReadOnlyMirrorSheet(chosen, programName);
    showCreatedMirrorSheet('Hoja espejo (lectura) ' + programName,mirrorSheetUrl);
  // } catch(error){ 
  //   // showErrorDialog(error); 
  //   console.error(error);
  // }
}

function getColumnFormulaForMirrorSheet(mirrorSpreadsheetUrl,mirrorSheetName, columnNumber){
  var mirrorSheet = ss.getSheetByName(mirrorSheetName);
  var lastRow = mirrorSheet.getMaxRows();
  console.log(columnNumber);
  var titleA1Not = mirrorSheet.getRange(1, +columnNumber+1).getA1Notation();
  var valuesA1Not = mirrorSheet.getRange(5, +columnNumber+1, lastRow-4, 1).getA1Notation();

  var titleFormula = `=IMPORTRANGE("${mirrorSpreadsheetUrl}";"'${mirrorSheetName}'!${titleA1Not}")`;
  var rangeFormula = `=IMPORTRANGE("${mirrorSpreadsheetUrl}";"'${mirrorSheetName}'!${valuesA1Not}")`;
  
  return [titleFormula,rangeFormula];
}

function createReadOnlyMirrorSheet(chosen, sheetName){
  var copySheetUrl = createBlankSpreadsheet('Hoja espejo (lectura) ' + sheetName);
  var programUrl = ss.getUrl();

  var sheetFormulas = [[],[]];
  var chosenArr = [];
  
  for(let key in chosen)
    chosenArr.push(+(chosen[key]));
  chosenArr.sort(function(a, b) {return a - b;});

  for(let colNumber of chosenArr){
    let [titleFormula, columnFormula] = getColumnFormulaForMirrorSheet(programUrl, sheetName, colNumber);
    sheetFormulas[0].push(titleFormula);
    sheetFormulas[1].push(columnFormula);
  }

  var programSheetRows = ss.getSheetByName(sheetName).getMaxRows();

  var viewOnlySheet = SpreadsheetApp.openByUrl(copySheetUrl).getSheets()[0];
  
  let len = sheetFormulas[0].length;
  viewOnlySheet.insertColumnsAfter(1,len-1);
  viewOnlySheet.insertRowsAfter(2,programSheetRows-1);

  viewOnlySheet.getRange(1,1,2,len).setFormulas(sheetFormulas);
  viewOnlySheet.setName(sheetName);

  return copySheetUrl;
}