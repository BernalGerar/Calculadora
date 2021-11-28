function Operate(a, type, b) {
    if(type.value == '+')      return {type: 'Number', value: a.value + b.value}
    else if(type.value == 'x') return {type: 'Number', value: a.value * b.value}
    else if(type.value == '/') return {type: 'Number', value: a.value / b.value}
    else return 'error:'; 
  }
  
  const noSpaces = function(str) {
    var newStr = '';
    for(var i = 0; i < str.length; i++) str[i] != ' ' ? newStr += str[i] : '';
    return newStr;
  }

  const spacesOnBothSices = function(str, arr) {
    var newArr = Array.from(str);
    var newStr = '';
    for(var i = 0; i < newArr.length; i++) {
      for(var f = 0; f < arr.length; f++) { if(newArr[i] == arr[f])  newArr[i] = ' ' + newArr[i] + ' '; }
    }
    for(var i = 0; i < newArr.length; i++) newStr += newArr[i];
    return newStr;
  }

  const detect = function(elem, i) {
    if(!isNaN(parseFloat(elem))) return {type:'Number', value: parseFloat(elem)};
    else if(elem == "+" || elem == "-" || elem == "/" || elem == "x") return {type:'Operator', value: elem};
  }

  const calculate = function(arr) {
    var elem1;
    var elem2;
    var elem3;
    
    // convierte de lo que seria una expresion -1+-1x2
    // arr['f'] = [{type:'Operator', value: '-'}, {type:'Operator', value: 1}, ...]
    // arr['f'] = [{type:'Number', value: -1}, {type:'Operator', value: '+'}, ...]
    if(arr[0].value == '-') {
      elem1 = arr.splice(0, 1);
      arr[0].value = parseFloat('-' + arr[0].value.toString());
    };

    // este bucle hace los mismo de antes pero con todas las expresiones: siguiendo el ejemplo
    /* arr['f'] = [{type:'Number', value: -1}, {type:'Operator', value: '+'},
         {type:'Operator', value: '-'}, {type:'Number', value: '1'}, {type:'Operator', value: 'x'},
         {type:'Number', value: '2'}
        ];
       se convierte a:
       arr['f'] = [{type:'Number', value: -1}, {type:'Operator', value: '+'},
         {type:'Number', value: '-1'}, {type:'Operator', value: 'x'},
         {type:'Number', value: '2'}
       ];
    */
    for(var i = 0 ; i < arr.length; i++) {
      if(arr[i].value == '-') {
        if(arr[i - 1].value == 'x' || arr[i - 1].value == '/' || arr[i - 1].value == '+') {
          arr.splice(i, 1);
          arr[i].value = parseFloat('-' + arr[i].value.toString());
        }else {
          arr.splice(i, 0, {type:'Operator', value: '+'});
          arr.splice(i + 1, 1);
          arr[i + 1].value = parseFloat('-' + arr[i + 1].value.toString());
        }
      }
    }

    // este bucle se encarga de hacer las operaciones tanto de multiplicacion y division
    // siguiendo el ejemplo anterior 
    /*
     ahora : 
     arr['f'] = [{type:'Number', value: -1}, {type:'Operator', value: '+'},
       {type:'Number', value: '-1'}, {type:'Operator', value: 'x'},
       {type:'Number', value: '2'}
     ];
     despues de que se ejecuta el bucle 
     arr['f'] = [{type:'Number', value: -1}, {type:'Operator', value: '+'},
       {type:'Number', value: '-2'}
     ];
    */
    for(var i = 0; i < arr.length; i++) {
      if(arr[i].value == 'x' || arr[i].value == '/') {
        elem1 = arr.splice(i, 1);
        elem2 = arr.splice(i, 1);
        arr.splice(i - 1, 1, Operate(arr[i - 1], elem1[0], elem2[0]));
        i--;
      }
    }
    
    // este blucle hace la suma
    // ahora:
    /*
       arr['f'] = [{type:'Number', value: -1}, {type:'Operator', value: '+'},
         {type:'Number', value: '-2'}
       ];
       despues:
       arr['f'] = [{type:'Number', value: -3}];
    */
    while(arr.length != 1) {
      elem1 = arr.splice(0, 1);
      elem2 = arr.splice(0, 1);
      elem3 = arr.splice(0, 1);
      arr.splice(0, 0, Operate(elem1[0], elem2[0], elem3[0]));
    }

    return arr[0];
  }

  var text =  document.getElementById('text');
  text.onkeyup = function(e) {    
    if(text.innerHTML == '<br>' || text.innerHTML == '') text.innerHTML = '<div><br></div>';
  }

  var button = document.getElementById('button');
  button.onclick = function() {
    var arr;
    var p = '';
    
    for(var i = 0; i < text.childNodes.length; i++) p += text.childNodes[i].innerHTML;
    
    arr = spacesOnBothSices(noSpaces(p), ['-', '+', '/', 'x']).split(" ");
    for(var i = 0; i < arr.length; i++) arr[i] = detect(arr[i]);
    for(var i = 0; i < arr.length; i++) arr[i] == undefined ? arr.splice(i, 1) : '';
    
    var resul = calculate(arr);
    text.innerHTML = '<div>' + resul.value + '</div>';
  }
  
  var clear = document.getElementById('clear');
  clear.onclick = function() {
    text.innerHTML = '<div><br></div>';
  }