import * as esprima from 'esprima';
var table = new Array();

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse, {loc:true});
};

const createMyList = (parsedCode) => {
    for (var i = 0; i < parsedCode.body.length; i++) {
        switch(parsedCode.body[i].type){
        case('FunctionDeclaration'): funcDecParser(parsedCode.body[i]);break;
        default: traverseBodyFunc(parsedCode.body[i]);break;
        }
    }
    return table;
};

const traverseBodyFunc = (parsedCode) => {
    switch (parsedCode['type']) {
    case('VariableDeclaration') :  varDecParser( parsedCode); break;
    case('ReturnStatement') :  returnParser(parsedCode);break;
    case('ExpressionStatement') :  expStatement( parsedCode);break;
    default : complexCases(parsedCode);
    }
};

const complexCases = (parsedCode) => {
    switch (parsedCode['type']) {
    case('IfStatement') :  ifStatement( parsedCode,0);break;
    case('WhileStatement') :whileStatement(parsedCode, 0);break;
    case('ForStatement') :forStatement(parsedCode, 0);break;

    }
};

export {parseCode,createMyList};

class lineOfTable {
    constructor(line, type, name, condition, value) {
        this.line = line;
        this.type = type;
        this.name = name;
        this.condition = condition;
        this.value = value;
    }
}

const addFunctionParams = (paramsList) => {
    var i;
    for (i=0; i<paramsList.length; i++){
        table.push(new lineOfTable(paramsList[i].loc.start.line,'variable declaration',paramsList[i]['name'],'',''));
    }
};


const funcDecParser = (funcDec) => {
    table.push(new lineOfTable(funcDec['id']['loc']['start']['line'], 'function declaration', funcDec['id']['name'], '', ''));
    addFunctionParams( funcDec['params']);
    var i;
    for (i = 0; i < funcDec['body']['body'].length; i++) {
        traverseBodyFunc(funcDec['body']['body'][i]);
    }
};


const varDecParser = (varDec) => {
    var i;
    for (i=0;i<varDec['declarations'].length;i++){
        var value='';
        if(varDec['declarations'][i]['init']!=null) {
            value = varDec['declarations'][i]['init']['value'];
        }
        table.push(new lineOfTable(varDec['declarations'][i]['id'].loc.start.line,'variable declaration',varDec['declarations'][i]['id']['name'],'',value));
    }


};

const returnParser = (retExp) => {
    table.push(new lineOfTable(retExp.loc.start.line,'return statement','','',parserForExpStatment(retExp['argument'])));

};


const expStatement = (expStatement) => {
    switch(expStatement['expression']['type']) {
    case('AssignmentExpression') :
        table.push(new lineOfTable(expStatement.loc.start.line, 'assignment expression', parserForExpStatment(expStatement['expression']['left']), '', parserForExpStatment(expStatement['expression']['right'])));break;
    case('UpdateExpression') :
        table.push(new lineOfTable(expStatement.loc.start.line, 'update expression', parserForExpStatment(expStatement['expression']['argument']), '', (parserForExpStatment(expStatement['expression']['argument'])+ ''+expStatement['expression']['operator'])));break;
    }
};


const parserForExpStatment = (exp) => {
    //alert(exp['argument']['type']);
    switch (exp['type']) {
    case('Identifier') : return exp['name'];
    case('Literal') :return exp['value'] ;
    default: return parserForComplexExpStatment(exp);
    }
};

const parserForComplexExpStatment = (exp) => {
    switch (exp['type']) {
    case('BinaryExpression') :{var left,right;
        left=needPartLeft(exp);
        right=needPartRight(exp);
        return  left + ' '+ exp['operator']+ ' '+ right;}
    case('UnaryExpression'):
        return  exp['operator'] + '' + parserForExpStatment(exp['argument']);
    case('MemberExpression') :return exp['object']['name'] + '[' + parserForExpStatment(exp['property']) + ']';

    }
};

const needPartLeft = (exp)=>{
    return exp['left']['type'].valueOf()=='BinaryExpression'.valueOf()?'('+parserForExpStatment(exp['left'])+')':parserForExpStatment(exp['left']);
};
const needPartRight = (exp)=>{
    return exp['right']['type'].valueOf()=='BinaryExpression'.valueOf()?'('+parserForExpStatment(exp['right'])+')':parserForExpStatment(exp['right']);
};

const ifStatement = (ifStatementExp,flag) => {
    if(flag.valueOf()=='on'.valueOf()) {
        table.push(new lineOfTable(ifStatementExp.loc.start.line, 'else if statement', '', parserForExpStatment(ifStatementExp['test']), ''));
    }
    else {
        table.push(new lineOfTable(ifStatementExp.loc.start.line, 'if statement', '', parserForExpStatment(ifStatementExp['test']), ''));
    }
    if(ifStatementExp['consequent']['type'].valueOf()!='BlockStatement'.valueOf())
        traverseBodyFunc(ifStatementExp['consequent']);
    else{
        var i;
        for(i=0;i<ifStatementExp['consequent']['body'].length;i++){
            traverseBodyFunc(ifStatementExp['consequent']['body'][i]);
        }
    }
    alterAnalize(ifStatementExp);};

const alterAnalize = (ifStatementExp)=>{
    if(ifStatementExp.alternate==null) return;
    if(ifStatementExp.alternate.type.valueOf()!='IfStatement'.valueOf()){
        table.push(new lineOfTable(ifStatementExp.alternate.loc.start.line-1, 'else statement', '', '', ''));

        if(ifStatementExp['alternate']['type'].valueOf()!='BlockStatement'.valueOf())
            traverseBodyFunc(ifStatementExp['alternate']);
        else{
            var j;
            for(j=0;j<ifStatementExp['consequent']['body'].length;j++){
                traverseBodyFunc(ifStatementExp['consequent']['body'][j]);
            }
        }
    }
    else{
        ifStatement(ifStatementExp.alternate,'on');
    }
};

const whileStatement = (whileStatementExp) => {
    table.push(new lineOfTable(whileStatementExp.loc.start.line,'while statement','',parserForExpStatment(whileStatementExp['test']),''));
    if (whileStatementExp.body.type.valueOf()!='BlockStatement'.valueOf()){
        traverseBodyFunc(whileStatementExp['body']);
    }
    else{
        var i;
        for(i=0;i<whileStatementExp['body']['body'].length;i++){
            traverseBodyFunc(whileStatementExp['body']['body'][i]);
        }

    }
};
const forStatement = (forStatementExp) => {
    var init = '', test = '', update = '';
    if (forStatementExp.init != null) init = parserForExpStatment(forStatementExp['init']['left']) + '=' + parserForExpStatment(forStatementExp['init']['right']);
    if (forStatementExp.test != null) test = parserForExpStatment(forStatementExp['test']);
    if (forStatementExp.update == null) update = null;
    else if (forStatementExp['update']['type'].valueOf() == 'UpdateExpression'.valueOf())
        update = parserForExpStatment(forStatementExp['update']['argument']) + '' + forStatementExp['update']['operator'];
    else
        update = parserForExpStatment(forStatementExp['update']['left']) + '=' + parserForExpStatment(forStatementExp['update']['right']);
    table.push(new lineOfTable(forStatementExp.loc.start.line, 'for statement', '', init + ';' + test + ';' + update, ''));
    addForBody(forStatementExp);
};
const addForBody = (forStatementExp) => {
    if (forStatementExp.body.type.valueOf()!='BlockStatement'.valueOf()){
        traverseBodyFunc(forStatementExp['body']);
    }
    else{
        var i;
        for(i=0;i<forStatementExp['body']['body'].length;i++){
            traverseBodyFunc(forStatementExp['body']['body'][i]);
        }
    }
};
