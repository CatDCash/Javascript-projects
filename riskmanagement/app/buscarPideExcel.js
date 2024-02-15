//en este script, se slicita un archivo excel al usuario para hacer una comparación
document.getElementById("buscar").addEventListener("click", compareExcel());


function compareExcel() { //funcion para solicitar el archivo
  var selectedValue = document.getElementById("escenario").value; //Se obtiene el escenario seleccionado
  var fileInput = document.createElement('input'); //Se obtiene el archivo para los riesgos
  fileInput.type = 'file';
  fileInput.accept = '.xlsx, .xls';
  fileInput.onchange = function(e) {
    var file = e.target.files[0];
    var reader = new FileReader(); //se crea el objeto que nos ayuda a leer el xlsx

    reader.onload = function(e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, {type: 'array'});

      var sheetName = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[sheetName];

      var excelData = XLSX.utils.sheet_to_json(worksheet);

      var filteredData = excelData.filter(function(row) {
        return row.riesgo === selectedValue;
      });

      var tablaHtml = '<tr><th>Control</th><th>Condicion</th><th>Descripcion</th><th>Mitigacion</th></tr>'; // 
      
      filteredData.forEach(function(row) {
        tablaHtml += '<tr><td>' + row.control + '</td><td>' + row.riesgo +'</td><td>' + row.descripcion + '</td><td>' + row.mitigacion + '</td></tr>'; // 
      });

      document.getElementById("tablaResults").innerHTML = tablaHtml;
    };

    reader.readAsArrayBuffer(file);
  };

  fileInput.click(); //invoca el buscador para seleccionar el archivo
}
  