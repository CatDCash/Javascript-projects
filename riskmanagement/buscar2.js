window.onload = function() {
    // carga el documento en cuanto inicia la pagina
    loadExcelFile();
  };
  
  document.getElementById("buscar").addEventListener("click", function() {
    compareExcel();
  });
  
  function loadExcelFile() {
    var file = 'riesgos_test.xlsx'; // archivo donde se almacenan los datos de riesgos
    var reader = new FileReader(); //objeto para leer el archivo
  
    reader.onload = function(e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, { type: 'array' });
  
      // se almacena el documento global por si lo necesitamos para otra cosa
      window.workbook = workbook;
    };
  
    fetch(file)
      .then(response => response.arrayBuffer())
      .then(buffer => reader.readAsArrayBuffer(new Blob([buffer])));
  }
  
  function compareExcel() {
    var selectedValue = document.getElementById("escenario").value;
    
    var workbook = window.workbook;
  
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
  }