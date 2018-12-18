import assert from 'assert';
import {symbolicSubstitution,clearVarsMap,handleFuncArgs,getColorsMap} from '../src/js/symbolic-subtitution';
import {parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    beforeEach(()=>{
        clearVarsMap();
    });

    it('Test 1 - globals, complex', () => {
        let codeLns='let w = 1;\n' +
            'function foo(x, y, z){\n' +
            '\twhile(x<5){\n' +
            '\t\tlet str=\'str\';\n' +
            '        let b = true;\n' +
            '        if(str == z[2]){\n' +
            '\t\t\treturn y + x * 2\n' +
            '\t\t}else if(str== \'str\'){\n' +
            '\t\t\tif(b == false){\n' +
            '\t\t\t\treturn w + x;\n' +
            '            }else{\n' +
            '\t\t\t\tw = 2;\n' +
            '            }\n' +
            '        }else{\n' +
            '\t\t\treturn true;\n' +
            '        }\n' +
            '    }\n' +
            '\ty = w + 1;\n' +
            '\tlet a = y;\n' +
            '}';
        let input='x=1, y=2, z=[1,2,\'bjbj\']';
        handleFuncArgs(input);
        assert.equal(symbolicSubstitution(codeLns,parseCode(codeLns)).length,16);
        assert.deepEqual(getColorsMap(),[false,true,false,true,false]);
    });

    it('Test 2 - complex array', () => {
        let codeLns='let w = 1;\n' +
            'w = w + 0;\n' +
            'let t;\n' +
            't = -1;\n' +
            'let f;\n' +
            'function foo( y, z){\n' +
            '        let b = true;\n' +
            '\t\t\tif(b == true){\n' +
            '\t\t\t\treturn w ;\n' +
            '            }\n' +
            '}';
        let input='f=3, y=2, z=[1,2,\'bjbj\']';
        handleFuncArgs(input);
        assert.equal(symbolicSubstitution(codeLns,parseCode(codeLns)).length,7);
        assert.deepEqual(getColorsMap(),[true]);
    });

    it('Test 3 - member in globals 1', () => {
        let codeLns='let w = z[1];\n' +
            'w = w + 0;\n' +
            'let t;\n' +
            't = -1;\n' +
            'let f;\n' +
            'function foo( y, z){\n' +
            '        let b = true;\n' +
            '\t\t\tif(b == true){\n' +
            '\t\t\t\treturn w ;\n' +
            '            }\n' +
            '}';
        let input='f=3, y=2, z=[1,2,\'bjbj\']';
        handleFuncArgs(input);
        assert.equal(symbolicSubstitution(codeLns,parseCode(codeLns)).length,7);
        assert.deepEqual(getColorsMap(),[true]);
    });

    it('Test 4 - member in globals 2', () => {
        let codeLns='let w = z[1];\n' +
            'w = w + 0;\n' +
            'let t;\n' +
            't = -1;\n' +
            'let f;\n' +
            'function foo( y, z){\n' +
            '\tlet b = true;\n' +
            '\tif(b == true){\n' +
            '\t\treturn w ;\n' +
            '\t}\n' +
            '\telse if (5<2){}\n' +
            '\telse {}\n' +
            '}';
        let input='f=3, y=2, z=[1,2,\'bjbj\']';
        handleFuncArgs(input);
        assert.equal(symbolicSubstitution(codeLns,parseCode(codeLns)).length,9);
        assert.deepEqual(getColorsMap(),[true, false, false]);
    });

    it('Test 5 - Input-vector globals', () => {
        let codeLns='let num;\n' +
            'let f;\n' +
            'function x(){\n' +
            'if(num==3){\n' +
            'return w;\n' +
            '}\n' +
            '}';
        handleFuncArgs('num=3');
        assert.equal(symbolicSubstitution(codeLns,parseCode(codeLns)).length, 5);
        assert.deepEqual(getColorsMap(),[true]);
    });

    it('Test 6 - global arr - no arg', () => {
        const codeLns='let a1=a[1]\n' +
            'let five=2;\n' +
            'five=five+3;\n' +
            'function test6(){\n' +
            'if(five==5){\n' +
            'return -1;\n' +
            '}\n' +
            '}';
        handleFuncArgs('arr=[`hello`,5]');
        assert.equal(symbolicSubstitution(codeLns,parseCode(codeLns)).length, 6);
        assert.deepEqual(getColorsMap(),[true]);
    });

    it('Test 7 - if, else if, else', () => {
        const codeLns='function t7(){\n' +
            '\tlet h = \'hello\';\n' +
            '\tlet w = \' world\';\n' +
            '\tif (h+w === \'hello\')\n' +
            '\t\treturn -1;\n' +
            '\telse if (h+w === \'world\')\n' +
            '\t\treturn 0;\n' +
            '\telse\n' +
            '\t\treturn 1;\n' +
            '}\n';
        symbolicSubstitution(codeLns,parseCode(codeLns));
        assert.deepEqual(getColorsMap(),[false, false, true]);
    });

    it('Test 8 - if with assignment', () => {
        const codeLns='function t8(){\n' +
            '\tlet h = 5;\n' +
            '\tif (h<10) {\n' +
            '\t\th = h+2;\n' +
            '\t}\n' +
            '\tif (h==7)\n' +
            '\t\treturn -1;\n' +
            '\tif (h==11)\n' +
            '\t\treturn true;\n' +
            '}';
        symbolicSubstitution(codeLns,parseCode(codeLns));
        assert.deepEqual(getColorsMap(),[true, true, false]);
    });

    it('Test 9 - global arr', () => {
        const codeLns=
            'function test9(arr){\n' +
            'if(arr[1]==5)\n' +
            'return 2;\n' +
            '}';
        handleFuncArgs('arr=[`hello`,5]');
        assert.equal(symbolicSubstitution(codeLns,parseCode(codeLns)).length, 4);
        assert.deepEqual(getColorsMap(),[true]);
    });

    it('Test 10 - expression in globals', () => {
        const codeLns='let x;\n' +
            '\tlet y = x+2;\n' +
            '\tfunction test10(x, z){\n' +
            '            if(y != 7)\n' +
            '            return 2;\n' +
            '\t\t\telse if (z || z)\n' +
            '\t\t\treturn 5;\n' +
            '\t\t\telse\n' +
            '\t\t\treturn -23;\n' +
            '\t}';
        handleFuncArgs('x=5, z = true');
        symbolicSubstitution(codeLns,parseCode(codeLns));
        assert.deepEqual(getColorsMap(),[false, true, false]);
    });
});
