
function compilarCalculadora(text) {

	var text = "log((100), (pot(2, 100) + 2) )"

	var T = 0;

	const Modelo = {
		pot: function(base, pot) {
			var _b_ = parseFloat(base);
			for(let i = 1; i < parseFloat(pot); i++) {
				_b_ *= parseFloat(base);
			}
			return _b_;
		},
		log: function(base, arg) {
			return Math.log(parseFloat(base))/Math.log(parseFloat(arg));
		},
		suma: function(num1, num2) {
			return parseFloat(num1) + parseFloat(num2);
		},
		resta: function(num1, num2) {
			return parseFloat(num2) - parseFloat(num1);
		},
		mul: function(num1, num2) {
			return parseFloat(num1) * parseFloat(num2);
		},
		div: function(num1, num2) {
			return parseFloat(num2) / parseFloat(num1);
		}
	}

	function borrarEspacio(text) {
		var newText = "";
		for(let i = 0; i < text.length; i++) {
			if(text[i] != " ") newText += text[i]
		}
		return newText;
	}

	function borrarSigno(text) {
		var newText = "";
		for(let i = 1; i < text.length - 1; i++) {
			if(text[i] == "#" && text[i + 1] == "#") {}
			else newText += text[i]
		}
		return newText;
	}

	function cambiarSigno(text) {
		var newText = "";
		for(let i = 0; i < text.length; i++) {
			if( text[i] == "x"      && 
				!isNaN(text[i - 1]) &&
				!isNaN(text[i + 1])
				) newText += "*"
			else newText += text[i];
		}
		return newText;
	}

	function agregarEspacio(text) {
		var newText = " ";
		for(let i = 0; i < text.length; i++) {
			if( text[i]  == "+"  || text[i]  == "*" || 
				text[i]  == "/"  || text[i]  == "-" || 
				text[i]  == "("  || text[i]  == ")" ||
				text[i]  == ","  || text[i]  == "." 
			  ) {
				newText += " " + text[i] + " ";
			}else newText += text[i]
		}
		return newText += " "
	}

	function agregarSigno(text) {
		var newText = "#0#+#";
		for(let i = 0; i < text.length; i++) {
			if(text[i] != " ") newText += text[i]
			else newText = newText + "#"
		}
		return newText;
	}

	function token(text) {
		var Tree = [];
		var arrText = text.split("#")
		for(let i = 0; i < arrText.length; i++) {

			switch(arrText[i]) {
				
				case "+":
					Tree.push({tipo: "funtor", signo: arrText[i], rango: 2, indice: 0, name: "suma"})
				break;

				case "-":
					Tree.push({tipo: "funtor", signo: arrText[i], rango: 2, indice: 1, name: "resta"})
				break;

				case "/":
					Tree.push({tipo: "funtor", signo: arrText[i], rango: 2, indice: 2, name: "div"})
				break;

				case "*":
					Tree.push({tipo: "funtor", signo: arrText[i], rango: 2, indice: 3, name: "mul"})
				break;
				
				case "log":
					Tree.push({tipo: "funtor", signo: arrText[i], rango: 2, indice: 4})
				break;

				case "pot":
					Tree.push({tipo: "funtor", signo: arrText[i], rango: 2, indice: 5})
				break;

				case "(":
				case ")":
				case ",":
				case ".":
					Tree.push({tipo: "aux", signo: arrText[i], rango: -1, indice: -1} )
				break;

				default:
					Tree.push({tipo: "constante", signo: arrText[i], rango: -1, indice: -1})
				break;
			}

		}
		return Tree;
	}

	function arreglo(arrText) {
		var flag = false;
		for(let i = 0; i < arrText.length; i++) {
			if(arrText[i].tipo == "funtor" && arrText[i].indice > 3) {
				arrText.splice(i + 1, 0, {tipo: "aux", signo: '('})
			}
			if(arrText[i].signo == ",") {
				arrText.splice(i + 1, 0, {tipo: "aux", signo: '('})
				arrText.splice(i, 0, {tipo: "aux", signo: ')'})
				//console.log(arrText[i])
				i += 3;
				//console.log(arrText[i])
				for(let j = i; j < arrText.length; j++) {
					if(arrText[j].signo == '(') flag = true;
					if(arrText[j].signo == ')' && flag) {
						j++;
						flag = false;
						//console.log(arrText[j], j)
					}
					if(arrText[j].signo == ')') {
						//console.log(arrText[j], j)
						arrText.splice(j + 1, 0, {tipo: "aux", signo: ')'})
						break;
					}
				}
			}
		}
		return arrText;
	}

	function ordenarSignos(arrText) {
		var posI = 0, posF = 0, posC = 0;

		function repetir() {
			for(let i = 0; i < arrText.length; i++) {
				if(arrText[i].signo == "(") posI = i;
			 	if(arrText[i].signo == ",") posC = i;
			 	if(arrText[i].signo == ")") {posF = i; break;}

		    }
		}

		function detectar() {
			var _d_ = false;
			for(let i = 0; i < arrText.length; i++) {
				if(arrText[i].signo == "(") _d_ = true;
			}
			return _d_
		}

		function reorganizar() {
			var flag1 = true;
			var _poss_;
			var termino = {tipo: "termino", value: [], signo: 0} ;
			for(let i = posI; i < posF; i++) {
				if(arrText[i].signo == "+" || arrText[i].signo == "-") {flag1 = true};
				if(arrText[i].signo == "*" || arrText[i].signo == "/") {
					if(flag1) {_poss_ = i - 1};
					arrText.splice(_poss_, 0, arrText[i])
					arrText.splice(i + 1, 1);
					flag1 = false;
				}
			}

			if(posI != 0) _poss_ = posI + 1
			else _poss_ = 0;
			for(let i = posI; i < posF; i++) {
				if(arrText[i].signo == "+" || arrText[i].signo == "-") {
					arrText.splice(_poss_, 0, arrText[i])
					arrText.splice(i + 1, 1);
				}
			}

			var index = 0;
			for(let i = _poss_; i < posF; i++) {
				termino.value[index] = arrText[i];
				index++;
			}
			termino.signo = "T" + T;
			T++;
			arrText.splice(posI, 0, termino)

			for(let i = posI + 1; i <= posF + 1; i++) {
				arrText.splice(posI + 1, 1)
			}

		}
		//console.log(arrText)
		while( detectar() ) {
			repetir();
			if(arrText[posI - 1].tipo == "funtor" && arrText[posI - 1].indice > 3) {

				var termino = {tipo: "termino", value: [
					arrText[posI - 1],
					arrText[posC - 1],
					arrText[posC + 1]
				], signo: "T" + T}
				T++;
				for(let i = 0; i < 6; i++) {
					arrText.splice(posI - 1, 1);
				}
				arrText.splice(posI - 1, 0, termino);

			}else if(arrText[posI].signo == "(") {
				reorganizar()
			} 
		}
		posI = 0;
		posF = arrText.length;
		reorganizar()
		return arrText
	}

	function reorganizar(Tree) {
		var newTree = [];
		var term;
		for(let i = 0; i < Tree[0].value.length; i++) {
			newTree[i] = Tree[0].value[i];
		}

		function detectar() {
			var _d_ = false;
			for(let i = 0; i < newTree.length; i++) {
				if(newTree[i].tipo == "termino") _d_ = true;
			}
			return _d_
		}

		var index = 0;
		while( detectar() ) {
			if(newTree[index].tipo == "termino") {
				for(let i = 0; i < newTree[index].value.length; i++) {
					newTree.splice(index + i + 1, 0, newTree[index].value[i])
				}
				newTree.splice(index, 1);
				continue;
			}
			index++;
		}
		return newTree;
	}

	function valor(Tree) {
		var index = 0;
		var term1, term2, term3;
		while(Tree.length != 1) {
			if( Tree[index].tipo == "funtor" && 
				Tree[index].indice > 3        &&
				Tree[index + 1].tipo == "constante" &&
				Tree[index + 2].tipo == "constante"
			   ) {
			   	term1 = Tree.splice(index, 1)[0];
			    term2 = Tree.splice(index, 1)[0];
			    term3 = Tree.splice(index, 1)[0];
				Tree.splice(index, 0, {tipo: "constante", signo: "" + Modelo[term1.signo](term3.signo, term2.signo) + ""});
				index = 0;
				continue;
			}
			if( Tree[index].tipo == "funtor" &&
				Tree[index + 1].tipo == "constante" &&
				Tree[index + 2].tipo == "constante"
				) {
				term1 = Tree.splice(index, 1)[0];
			    term2 = Tree.splice(index, 1)[0];
			    term3 = Tree.splice(index, 1)[0];
				Tree.splice(index, 0, {tipo: "constante", signo: "" + Modelo[term1.name](term3.signo, term2.signo) + ""});
				index = 0;
				continue;
			}
			index++;
		}
		return Tree;
	}

	

	return {
		calcular: function(text) {
			return valor( reorganizar( ordenarSignos( arreglo( token( borrarSigno( agregarSigno( agregarEspacio( cambiarSigno( borrarEspacio(text) ) ) ) ) ) ) ) ) )[0].signo;
		},
		compilar: function(arrText) {
			arrText.splice(0, 0, {tipo: "constante", signo: '0', rango: -1, indice: -1})
			arrText.splice(1, 0, {tipo: "funtor", signo: '+', rango: 2, indice: 0, name: "suma"})
			return  valor( reorganizar( ordenarSignos( arreglo( arrText ) ) ) );	
		}
	}
	
}

console.log( compilarCalculadora().calcular("(2 + log(10, 10x10)/2)-1") )
console.log( compilarCalculadora().calcular("pot(log(10, 10x10), 10)") )
