function Operate(a, type, b) {
  if(type.value == '+')      return {type: 'Number', value: a.value + b.value}
  else if(type.value == 'x') return {type: 'Number', value: a.value * b.value}
  else if(type.value == '/') return {type: 'Number', value: a.value / b.value}
  else if(type.value == '-') return {type: 'Number', value: a.value - b.value}
  else return 'error:'; 
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

const detect = function(elem) {
  if(!isNaN(parseFloat(elem))) return {type: 'Number', value: parseFloat(elem)}
  else if(elem == "+" || elem == "-" || elem == "/" || elem == "x" || elem == '('|| elem == ')'|| elem == ',') return {type: 'Token', value: elem}
  else if(elem == 'log' || elem == 'pow' || elem == 'root') return {type: 'Function', value: elem}
  else return {type: 'NoDefined', value: undefined};
}

const noSpaces = function(str) {
  var newStr = '';
  for(var i = 0; i < str.length; i++) if(!/\s/.test(str[i])) {newStr += str[i]}
  return newStr;
};

const lexer = function(text) {
  var __text = spacesOnBothSices(noSpaces(text), ['+', '-', 'x', '/', '(', ')', ',']);
  var arr = __text.split(" ");
  for(var i = 0; i < arr.length; i++) arr[i] = detect(arr[i]);
  for(var i = 0; i < arr.length; i++) arr[i].type  == "NoDefined" ? arr.splice(i, 1) : '';
  return arr;
}

const parser = function(tokens) {

  var re2 = /(log|pow|root)\(([0-9\s]+)\s*\,\s*([0-9\s]+)\)/;
  var tree = [];
  while(tokens.length > 0) {
    var elem = tokens.splice(0, 1)[0];
    if(elem.type == 'Function') {
      var elem1 = tokens.splice(0, 1)[0];
      var elem2 = tokens.splice(0, 1)[0];
      var elem3 = tokens.splice(0, 1)[0];
      var elem4 = tokens.splice(0, 1)[0];
      var elem5 = tokens.splice(0, 1)[0];
      var expr = elem.value + elem1.value + elem2.value + elem3.value + elem4.value + elem5.value;
      if(re2.test(expr)) {
        tree.push({type: 'Function', name: elem.value, arguments: [
          {type: 'Number', value: elem2.value}, 
          {type: 'Number', value: elem4.value}
        ]})
      }
    }else if(elem.type == 'Token') tree.push({type: 'Token', value:elem. value})
     else if(elem.type == 'Number') tree.push({type: 'Number', value:elem. value})
  }
  return tree;
}

const generateResult = function(tree) {

  const solveFunctions = function(tree) {
    for(var i = 0; i < tree.length; i++) {
      if(tree[i].type == 'Function') {
        var result;
        switch(tree[i].name) {
          case 'log':
            var elem = tree.splice(i, 1)[0];
            result = Math.log(elem.arguments[1].value) / Math.log(elem.arguments[0].value);
          break;
          case 'root':
            var elem = tree.splice(i, 1)[0];
            result = Math.pow(elem.arguments[1].value, 1 / elem.arguments[0].value)
          break;
          case 'pow':
            var elem = tree.splice(i, 1)[0];
            result = Math.pow(elem.arguments[0].value, elem.arguments[1].value)
          break;
          default:
          break;
        }
        tree.splice(i, 0, {type: 'Number', value: result});
      }
    }
    return tree;
  };

  const priority = function(tree) {
    for(var i = 0; i < tree.length; i++) {
      if(tree[i].value == 'x' || tree[i].value == '/') {
        elem1 = tree.splice(i, 1);
        elem2 = tree.splice(i, 1);
        tree.splice(i - 1, 1, Operate(tree[i - 1], elem1[0], elem2[0]));
        i--;
      }
    }
    return tree;
  };

  const noPriority = function(tree) {
    var elem1;
    var elem2;
    var elem3;
    while(tree.length != 1) {
      elem1 = tree.splice(0, 1);
      elem2 = tree.splice(0, 1);
      elem3 = tree.splice(0, 1);
      tree.splice(0, 0, Operate(elem1[0], elem2[0], elem3[0]));
    }
    return tree[0].value;
  }

  return noPriority(priority(solveFunctions(tree)));
}

const compiler = function(code) {
  return generateResult(parser(lexer(code)))
}
