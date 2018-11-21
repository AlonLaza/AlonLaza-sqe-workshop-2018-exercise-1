import assert from 'assert';
import {createMyList, parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
/*
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script"}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
        );
    });
*/


    var myTestList=createMyList(parseCode('function binarySearch(X, V, n){\n' +
'    let low, high, mid;\n' +
'    low = 0;\n' +
'    high = n - 1;\n' +
'    while (low <= high) {\n' +
'        mid = (low + high)/(2-0);\n' +
'        if (X < V[mid]){\n' +
'            high = mid - 1;}\n' +
'        else if (X > V[mid])\n' +
'            low = mid + 1;\n' +
'        else\n' +
'            return mid;\n' +
'    }\n' +
'\tfor(i=0;i<x;i++){x++;\n' +
'\t}\n' +
'\tfor(;i<x+5;i=i+1)\n' +
'\t    if(2>1) x++;\n' +
'    while(1>2) return 5;for(;;){};if(x>2) {x++} else {x=x+1} return -1;\n' +
'}\nlet a=5;\n'));

	it('its a test for  parsing a functino decleation correctly', () => {
        assert.equal(JSON.stringify(myTestList[0]),'{"line":1,"type":"function declaration","name":"binarySearch","condition":"","value":""}'
        );
    });

    it('its a test for  parsing a var decleation inside a function declaration correctly', () => {
        assert.equal(JSON.stringify(myTestList[1]),'{"line":1,"type":"variable declaration","name":"X","condition":"","value":""}'
        );
    });

    it('its a test for  parsing a var decleation  correctly', () => {
        assert.equal(JSON.stringify(myTestList[4]),'{"line":2,"type":"variable declaration","name":"low","condition":"","value":""}'
        );
    });

    it('its a test for  parsing a assignment expression  correctly', () => {
        assert.equal(JSON.stringify(myTestList[7]),'{"line":3,"type":"assignment expression","name":"low","condition":"","value":0}'
        );
    });
	
	it('its a test for  parsing a while expression  correctly', () => {
        assert.equal(JSON.stringify(myTestList[9]),'{"line":5,"type":"while statement","name":"","condition":"low <= high","value":""}'
        );
    });
    
	it('its a test for  parsing a complex binary expression  correctly', () => {
        assert.equal(JSON.stringify(myTestList[10]),'{"line":6,"type":"assignment expression","name":"mid","condition":"","value":"(low + high) / (2 - 0)"}'
        );
    });
	
	it('its a test for  parsing a if statement  correctly', () => {
        assert.equal(JSON.stringify(myTestList[11]),'{"line":7,"type":"if statement","name":"","condition":"X < V[mid]","value":""}'
        );
    });
	
	it('its a test for  parsing a else if statement  correctly', () => {
        assert.equal(JSON.stringify(myTestList[13]),'{"line":9,"type":"else if statement","name":"","condition":"X > V[mid]","value":""}'
        );
    });
	
	it('its a test for  parsing a else statement  correctly', () => {
        assert.equal(JSON.stringify(myTestList[15]),'{"line":11,"type":"else statement","name":"","condition":"","value":""}'
        );
    });
	
	it('its a test for  parsing a return statement  correctly', () => {
        assert.equal(JSON.stringify(myTestList[16]),'{"line":12,"type":"return statement","name":"","condition":"","value":"mid"}'
        );
    });
	
	it('its a test for  for statement  correctly', () => {
        assert.equal(JSON.stringify(myTestList[17]),'{"line":14,"type":"for statement","name":"","condition":"i=0;i < x;i++","value":""}'
        );
    });
	
});
