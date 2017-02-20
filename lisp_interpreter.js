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




//console.log(parse(`((lambda (x) x) "lisp")`));
//console.log(parse(`(define a 5)`));
//console.log(parse(`(+ 2 3)`))


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
    else {
        input.unshift(first);
        //console.log(input);
        return special(input);
    }
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
    var argsArr = [];
    var func = library[first];
    var length = input.length;
    for(var i=0;i<length;i++) {
        argsArr.push(special(input));
        //console.log(argsArr);
    }

    //console.log(argsArr)
    return argsArr.reduce(func);
}
//


console.log(result(`(define a 5)`));
