// function doGet(e){
//   var action = e.parameter.r;
//   var parameterA = e.parameter.a;

//   resp = this[action](parameterA);
//   return ContentService.createTextOutput(resp);
// }

function getProperty(name){
  var [property] = getDocumentProperties([name]);
  return property;
}