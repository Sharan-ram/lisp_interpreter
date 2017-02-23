function result(input) {
    return eval(parse(input));
}

function parse(input) {
    return createArr(tokenize(input));
}

function tokenize(input) {
    return input.replace(/\(/g," ( ").replace(/\)/g," ) ").trim().split(/ +/);
}

function createArr(tokens,list=[]) {

    var token = tokens.shift();
    if(token === "(") {
        var list = [];

        while(tokens[0]!== ")") {
            list.push(createArr(tokens));
        }

    tokens.shift();
    return list;
    }

    else if(token === ")") {
        return "syntax error";
    }

    return catogarize(token);
}

function catogarize(token) {
    if(!isNaN(float=parseFloat(token))) {
        return float;
    }
    return token;
}
var store = {};
//console.log(parse(`((lambda (x) x) "lisp")`));
//console.log(parse(`(define a 5)`));
//console.log(parse(`(if (> 3 1) (3) (4))`))
//console.log(parse(`((lambda (x y) (+ x y)) 2 1)`))
//console.log(parse(`(+ 1 (* 3 2))`))
//console.log(parse(`((lambda (x y) (* x (+ x y))) 3 10)`));


var library = {
    '+':function(a,b) {return a+b},
    '-':function(a,b) {return a-b},
    '*':function(a,b) {return a*b},
    '/':function(a,b) {return a/b},
    '%':function(a,b) {return a%b},
    '>':function(a,b) {return a>b},
    '<':function(a,b) {return a<b},
    '>=':function(a,b) {return a>=b},
    '<=':function(a,b) {return a<=b},
    'abs':function(a,b=null) {return Math.abs(a)},
    //'append':function(a,b) {return String(a)+String(b)},
    //'car':function(a) {return a[0]},
    //'cdr':function(a,b) {return a.slice(1)},
    'eq?':function(a,b) {return a==b},
    'equal?':function(a,b) {return a===b},
    //'cons':function(a,b) {a.push(b);return a},
    //'length':function(a) {return a.length},
    'max':function(a,b) {return Math.max(a,b)},
    'min':function(a,b) {return Math.min(a,b)},
    'not':function(a,b=null) {return !a},
    'number?':function(a) {return !isNaN(a)},
    // 'pi': function() {return Math.PI();}

}


function eval(input) {

    var first = input.shift();

    if(first===undefined) {
        return undefined;
    }

    if(first==='define') {
        library[input.shift()] = special(input);

    }
    else if(first==='set!') {
        library[input.shift()] = special(input);
    }
    else if(first === 'if') {
        var res = eval(input.shift());
        //console.log(res);
        if(res===true) {
            return eval(input[0]);
        }
        return eval(input[1]);
    }

    else {
        input.unshift(first);
        //console.log(input);
        return special(input);
    }
}
function replace(input) {
    for(var n=0;n<input.length;n++) {
        if(typeof input[n]!=='object') {
            if(library[input[n]]===undefined) {
                var a=input[n];
                input.splice(n,1,store[a]);
            }

        }
        else {
            replace(input[n]);
        }
    }
    return input;
}

function special(input) {
    //console.log(input);

    var first = input.shift();
    //console.log(first);

    //console.log(func);
    if(first===undefined) {
        return undefined;
    }

    if(!isNaN(num = parseFloat(first))) {
        return num;
    }
    if(first[0] === "lambda") {
        if(input.length===0) {
            return first;
        }

        //console.log(input)
        //console.log(first[1]);

        var lamdaArgLen = first[1].length;
        for(var k=0;k<lamdaArgLen;k++) {
            store[first[1][k]]=input[k];
            //console.log(library[first[1][k]])

        }

        if(typeof first[2] === 'object') {
            re = replace(first[2]);

            return eval(re);
        }

        var arr = [];
        arr.push(library[first[2]]);

        //console.log(arr);
        return eval(arr);


    }
    if(first === "quote") {
        return input.shift();
    }
     if (first === 'begin') {
      var len = input.length;
      for (var j = 0; j < len; j++) {
        if (j === len - 1) {
          return eval(input.shift())
        }
        eval(input.shift())
      }
    }
    if(library[first]===undefined) {
        return first;
    }
    var argsArr = [];
    var func = library[first];
    //console.log(func);
    var length = input.length;
    for(var i=0;i<length;i++) {
        if(typeof input[i]!=='object') {
            argsArr.push(input[i]);

        }
        else {
        result = eval(input[i]);
        argsArr.push(result);
    }
        //console.log(argsArr)

        //console.log(argsArr);
    }

    //console.log(argsArr)
    return argsArr.reduce(func);

}

//console.log(result(`(if (< 5 4) (5) (* 1 4))`));
//console.log(result(`(quote "sharan")`));
//console.log(result(`(+ 5 (* 3 4 5))`));
//console.log(result(`((lambda (x y) (+ x (* x y))) 2 3)`));
//console.log(result(`(+ 2 (+ 1 (* 3 2)))`));
//console.log(result(`((lambda (x y) (* x (+ x y))) 3 10)`));