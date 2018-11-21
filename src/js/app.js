import $ from 'jquery';
import {parseCode,createMyList} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        var myList = createMyList(parsedCode);
        var htmlTableString= makingHtmlStringTable(myList);
        //$('#parsedCode').val(JSON.stringify(myList, null, 2));
        $('#dataTable').html(htmlTableString);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));

    });
});
				
				
const makingHtmlStringTable =(list)=> {
    var str= '<tr> <td> Line </td> <td> Type </td> <td> Name </td> <td> Condition </td> <td> Value </td> </tr> ';
    var line,type,name,cond,value,tempLine;
    for(var i=0;i<list.length;i++){
        line=list[i].line;
        type=list[i].type;
        name=list[i].name;
        cond=list[i].condition;
        value=list[i].value;
        tempLine='<tr> ' + '<td> ' + line + '</td> ' + '<td> ' + type + '</td> ' + '<td> ' + name +  '</td> ' + '<td> ' + cond + '</td> ' + '<td> ' + value + '</td> </tr> ';
        str=str+tempLine;
    }
    return str;
};