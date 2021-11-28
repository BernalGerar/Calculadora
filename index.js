function Operate(a, type, b) {
    if(type.value == '+')      return {type: 'Number', value: a.value + b.value}
    else if(type.value == '-') return {type: 'Number', value: a.value - b.value}
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

  const detect = function(elem, i, f) {
    if(!isNaN(parseFloat(elem))) return {type:'Number', value: parseFloat(elem), position:i, row: f};
    else if(elem == "+" || elem == "-" || elem == "/" || elem == "x") return {type:'Operator', value: elem, position:i, row: f};
  }

  const calculate = function(arr) {
    var elem1;
    var elem2;
    var elem3;
    for(var i = 0; i < arr['f'].length; i++) {
      if(arr['f'][i].value == 'x' || arr['f'][i].value == '/') {
        elem1 = arr['f'].splice(i, 1);
        elem2 = arr['f'].splice(i, 1);
        arr['f'].splice(i - 1, 1, Operate(arr['f'][i - 1], elem1[0], elem2[0]));
        i--;
      }
    }
    while(arr['f'].length != 1) {
      elem1 = arr['f'].splice(0, 1);
      elem2 = arr['f'].splice(0, 1);
      elem3 = arr['f'].splice(0, 1);
      arr['f'].splice(0, 0, Operate(elem1[0], elem2[0], elem3[0]));
    }
    return arr['f'][0];
  }

  var text =  document.getElementById('text');
  text.onkeyup = function(e) {    
    if(text.innerHTML == '<br>' || text.innerHTML == '') text.innerHTML = '<div><br></div>';
  }

  var button = document.getElementById('button');
  button.onclick = function() {
    var arr;
    var p = [];

    for(var f = 0; f < text.childNodes.length; f++) {
      arr = spacesOnBothSices(noSpaces(text.childNodes[f].innerHTML), ['-', '+', '/', 'x']).split(" ");
      for(var i = 0; i < arr.length; i++) arr[i] = detect(arr[i], i, f);
      for(var i = 0; i < arr.length; i++) arr[i] == undefined ? arr.splice(i, 1) : '';
      p.push({f: arr});
    }

    for(var i = 0; i < p.length; i++) {
      var last = p[i]['f'].length - 1;
      if(p[i]['f'][last].type == 'Operator') {
        var elem = p[i]['f'].splice(last, 1);
        p[i + 1]['f'].splice(0, 0, elem[0]);
      }
    }

    while(p.length != 1) {
      var obj = p.splice(0, 1);
      p[0]['f'].splice(0, 0, calculate(obj[0]));
    }
    
    var obj = p.splice(0, 1);
    var res = calculate(obj[0]);
    text.innerHTML = '<div>' + res.value + '</div>'
  }
  
  var clear = document.getElementById('clear');
  clear.onclick = function() {
    text.innerHTML = '<div><br></div>';
  }