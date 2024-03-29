window.onload = function() {
    // carga el documento en cuanto inicia la pagina
    loadExcelFile();
  };

  //cosa qeu hace qeu la lista este mamalona
  let listElements = document.querySelectorAll('.list__button--click');
  listElements.forEach(listElement => {
    listElement.addEventListener('click', () => {
      listElement.classList.toggle('arrow');
      
      let height = 0
      let menu = listElement.nextElementSibling
      console.log(menu.scrollHeight)
      if(menu.clientHeight == '0'){
        height=menu.scrollHeight
      }

      menu.style.height = `${height}px`
    })
  });

  // cosa para seleccionar el escenario :( y ver si puedo cerrar el menu
  let listEscenarios = document.querySelectorAll('.nav__link--inside')
  listEscenarios.forEach(escenario => {
    escenario.addEventListener('click', () => {
      selectedValue = escenario.textContent

    })
  })

  const showMenu = (toggleId,navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', () =>{
            nav.classList.toggle('show')
        })
    }
  }

showMenu('nav-toggle','nav-menu')

    // INJECT CSS
  var css = document.createElement('style');
  css.type = 'text/css';
  css.innerHTML = '#txt-rotate > .wrap { border-right: 0.08em solid #666 }';
  document.body.appendChild(css);
  
  //variables para animacion del texto
  var element = document.getElementById('txt-rotate');
  var toRotate = element.getAttribute('data-rotate');
  var period = element.getAttribute('data-period');
  setTimeout(function() {
    new TxtRotate(element, JSON.parse(toRotate), period);
  }, 1500);

  // evento boton
  document.getElementById("buscar").addEventListener("click", function() {
    console.log('click')
    console.log(selectedValue)
    compareExcel();
    //document.getElementsByClassName('list__show').height = '0'
  });

  function loadExcelFile() {
    var file = 'assets/riesgos_test.xlsx'; // archivo donde se almacenan los datos de riesgos
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
    //var selectedValue = document.getElementById("escenario").value;
    var workbook = window.workbook;
    var sheetName = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[sheetName];
    var excelData = XLSX.utils.sheet_to_json(worksheet);
  
    var filteredData = excelData.filter(function(row) {
      return row.control === selectedValue;
    });
  
    var tablaHtml = '<tr><th>Control</th><th>Condicion</th><th>Descripcion</th><th>Mitigacion</th></tr>'; // 
      
    filteredData.forEach(function(row) {
        tablaHtml += '<tr><td>' + row.control + '</td><td>' + row.riesgo +'</td><td>' + row.descripcion + '</td><td>' + row.mitigacion + '</td></tr>'; // 
    });
  
    document.getElementById("tablaResults").innerHTML = tablaHtml;
  }

  /* Typing Text */

var TxtRotate = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }
  this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

  var that = this;
  var delta = 200 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 5;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};