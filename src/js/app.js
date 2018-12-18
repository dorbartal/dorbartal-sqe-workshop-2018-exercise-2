import $ from 'jquery';
import {parseCode} from './code-analyzer';
import * as symbolicSub from './symbolic-subtitution';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        symbolicSub.clearVarsMap();
        symbolicSub.handleFuncArgs($('#input').val());
        $('.red').remove();
        $('.green').remove();
        $('.white').remove();
        paint(symbolicSub.symbolicSubstitution(codeToParse, parsedCode));
        //draw(myTable);
    });
});
const getColor = (line, scope, colorsMap) => {
    if(line.includes('if') || line.includes('else'))
        return colorsMap[scope] ? 'green' : 'red';
    return 'white';
};

const paint = (codeLines) => {
    let scope = 0;
    let colorsMap = symbolicSub.getColorsMap();
    codeLines.forEach(line => {
        let color = getColor(line, scope, colorsMap);
        if(color != 'white')
            scope++;
        $('#res').append($('<div>' + line + '</div>').addClass(color));
    });
};