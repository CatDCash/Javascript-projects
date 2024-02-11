document.getElementById("compareButton").addEventListener("click", function() {
    compareExcel();
  });


function compareExcel() {
  var selectedValue = document.getElementById("userInput").value;
  var fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.xlsx, .xls';
  fileInput.onchange = function(e) {
    var file = e.target.files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, {type: 'array'});

      var sheetName = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[sheetName];

      var excelData = XLSX.utils.sheet_to_json(worksheet);

      var filteredData = excelData.filter(function(row) {
        return row.riesgo === selectedValue;
      });

      var tableHtml = '<tr><th>Control</th><th>Condicion</th><th>Descripcion</th><th>Mitigacion</th></tr>'; // 
      
      filteredData.forEach(function(row) {
        tableHtml += '<tr><td>' + row.control + '</td><td>' + row.riesgo +'</td><td>' + row.descripcion + '</td><td>' + row.mitigacion + '</td></tr>'; // 
      });

      document.getElementById("resultTable").innerHTML = tableHtml;
    };

    reader.readAsArrayBuffer(file);
  };

  fileInput.click();
}
  