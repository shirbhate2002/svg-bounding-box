const { DOMParser} = require('@xmldom/xmldom')

exports.__esModule = true;
var fs = require("fs");
var svgo_1 = require("svgo");

var extendDefaultPlugins = require('svgo').extendDefaultPlugins;

function optimize(filePath) {
    var data = fs.readFileSync(filePath, 'utf8');
    data = data.replace(/svg:/g, "");
    var result = (0, svgo_1.optimize)(data, {
        path: 'path-to.svg',
        multipass: true,
        js2svg: {
            indent: 2,
            pretty: true
        },
        plugins: extendDefaultPlugins([
            {
                name: 'mergePaths',
                active: true
            },
            {
                name: 'convertShapeToPath',
                active: true
            },
            {
                name: 'convertStyleToAttrs',
                active: true
            },
           {
                name: 'removeStyleElement',
                active: true,
                removeStyleElement: { attrs:'(clip-path)'}
           },
           {
               name: 'removeElementsByAttr',
               active: true,
               removeAttrs: { attrs:['g:clip-path'] }
           },
           {
             name: 'removeAttrs',
             removeAttrs: { attrs:['g:clip-path'] },
             active: true,
           },
            {
              name: 'moveElemsAttrsToGroup',
              active: false
            }
        ])
    });
    var optimizedSvgString = result.data;
    const parser = new DOMParser();
    const document = parser.parseFromString(optimizedSvgString, "text/html");
    fs.writeFileSync(`${filePath}_opt.svg`,optimizedSvgString);
    var paths=document.getElementsByTagName("path");
    var ans=[];
    //console.log(paths[0]['attributes']);
    for(var i=0;i<paths.length;i++){
        var data_atr=paths[i]['attributes'];
        for(var j=0;j<data_atr.length;j++){
            if(data_atr[j.toString()]["nodeName"]=="d"){
                ans.push(data_atr[j.toString()]['nodeValue']);
                break;
            }
        }
    }
    
    return ans;
}

//console.log(optimize("try1.svg"));

module.exports = {optimize};