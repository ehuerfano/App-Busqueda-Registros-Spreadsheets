var ss = SpreadsheetApp.getActiveSpreadsheet();

function onOpen(){
   var ui = SpreadsheetApp.getUi();
    ui.createMenu('APP')
        .addItem('Editar con formato', 'editarExtras')
        .addToUi();     
}

function editarExtras() {
  let row = ss.getActiveCell().getRow();
  let col = ss.getActiveCell().getColumn();

  let value = ss.getCurrentCell().getValue();
  var title = ss.getActiveSheet().getRange(row,1).getValue();

  if(!value.includes('±\n') && value != '') { Browser.msgBox('La celda tiene formato incorrecto o está protegida'); return; }
  if(value == '') value = '±\n±\n±\n±\n±\n';
  setUserProperties(['row', 'col', 'value'],[row, col, value]);
  var arregloSeccion = value.split('±\n');

  // if(arregloSeccion[0] == '') arregloSeccion = [];
  // while(arregloSeccion.length < 8){
  //   let newRow = '»»';
  //   arregloSeccion.push(newRow);
  // }

  arregloSeccion = arregloSeccion.map((entry, index) => {
    if(!entry) entry = ' » »';
    let arr = entry.split(' »');
    let newObj = {};
    newObj[`fecha^${index}`] = arr[0];
    newObj[`agente~${index}`] = arr[1];
    newObj[`comentario~${index}`] = arr[2];

    return newObj;
  });

  var html = HtmlService.createTemplateFromFile('Blank');
  var page = html.evaluate();

  let indices = ['fecha^', 'agente~', 'comentario~'];
  let interfaces = ['FECHA', 'AGENTE', 'COMENTARIO'];
  let tamanoColumnas12 = [2,2,8];

  page.append('<form class="text-center" id="infoForm" onsubmit="return validarForm(this)" style="margin:10px;">');
  page.append('<input type="hidden" id="tipo" name="tipo"  value="editar">');
  arregloSeccion.map(
    (item, index) =>  page.append(getInputFilaForm(indices, item, interfaces, tamanoColumnas12, index))
  )
  page.append('<button type="submit" class="btn btn-primary my-2">GUARDAR</button>');
  page.append('</form>');
  
  page.addMetaTag('viewport', 'width=device-width, initial-scale=1');
  page.setWidth(1000).setHeight(350);
  SpreadsheetApp.getUi().showModalDialog(page, 'Editar '+title);
}

function getInputFilaForm(indexesWithType, objetoFila, tablaTitles, colTamanos,j){
  let ret = `<div class="form-floating m-2 requires-validation" novalidate style="margin:1">
              <div class="row">`;

  indexesWithType.forEach((index, i) => {
      var event = '';
      var patternAttr = '', titleAttr = '', invalidFeedback = '', requiredAttr = '';
      // index = index + i;
      index = index + j

      if( index.includes('^') ){
        var type = 'date';
        event = '';
        // objetoFila[index] = objetoFila[index].split('T')[0].toString();
        let x= '';
      }else if( index.includes('#') ){
        event = 'puntos(this);toggleInvalid(this)';
        var type = 'text';
        // objetoFila[index] = setDotSeparator(objetoFila[index]);
      }else if( index.includes('~') ){
        event = '';
        if(index=='nombre~'){
          patternAttr  = 'pattern="^[A-Za-z\\s]+$"';
          titleAttr = 'title="Solo letras o espacios sin caracteres especiales"';
        }
        var type = 'text';
      }else if( index.includes('%') ){
        event = 'porcentaje(this)';
        var type = 'text';
        objetoFila[index] *= 100;
        objetoFila[index] += '%';
      }else if( index.includes('&') ){
        event = '';
        requiredAttr = 'disabled';
        var type = 'text';
      }
      ret +=    `<div class="col-${colTamanos[i]}">
                  <input 
                    type="${type}" 
                    class="form-control" 
                    onkeyup="${event}" 
                    placeholder="${tablaTitles[i]}" 
                    id="${index}" 
                    name="${index}" 
                    value="${objetoFila[index]}"
                    ${patternAttr}
                    ${titleAttr}
                    ${requiredAttr}
                    aria-label="${tablaTitles[i]}">
                  ${invalidFeedback}
                </div>`;
    });
      ret +=  `</div>
            </div>`;
  return ret;
}

function setDotSeparator(number){
  return number.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ".");
}

function validarForm(formObject){
  switch(formObject.tipo){
    case 'editar':
      formExtras(formObject);
      break;

    default:
      return;
  }
}


function formExtras(formObject){
  showLoadingDialog();
  
  // try{
    var form = JSON.parse(JSON.stringify(formObject));
    var [row, col, value] = getUserProperties(['row','col','value']);

    value = value.split('±\n');
    for(let i = 0; i < 5; i++){
      let entry = `${form['fecha^'+i]} »${form['agente~'+i]} »${form['comentario~'+i]}`;
      // if(entry != ' » »')
        value[i] = entry;
      // else
      //   value[i] = '';
    }
    value = value.join('±\n');

    ss.getActiveSheet().getRange(row,col).setValue(value);

    closeLoadingDialog('Edición');
  // } catch(error){ 
  //   showErrorDialog(error); 
  //   console.error(error);
  //   console.error(error.stack);
  //   throw error;
  // }
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

//------------------------------------- showDialog -----------------------------------------
function showLoadingDialog(action) {
  var htmlOutput = HtmlService
    .createHtmlOutput()
    .setWidth(300)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, !action ? 'Cargando...' : action);
}
function closeLoadingDialog(action){
  var htmlOutput = HtmlService
    .createHtmlOutput('<script>google.script.host.close();</script>')
    .setWidth(300)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, action);
}
function showErrorDialog(errorMessage){
  var htmlOutput = HtmlService
    .createHtmlOutput(`<div style="text-align: center; font-family: monospace;">${errorMessage}</div>`)
    .setWidth(300)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Error');
  // console.error(errorMessage.stack);
}