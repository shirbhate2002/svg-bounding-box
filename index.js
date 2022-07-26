const {_parse_paths} = require('./_parse_paths');
const {optimize} = require('./optimize');
const {BBArc} = require('./BBArc');
const {BBCubic_Bezier} = require('./BBCubic_Bezier');
const {BBEllipse} = require('./BBEllipse');
const {BBLine} = require('./BBLine');
const {BBQuadratic_Bezier} = require('./BBQuadratic_Bezier');

var fs = require("fs");

function getBB(file_path){

    var startTime = performance.now()
    var ans=-1;
    var er=optimize(file_path);

    var er_l=_parse_paths(er);
    
    for(var i=0;i<er_l.length;i++){
        
        var pt=er_l[i];
        for(var j=0;j<pt.length;j++){
            var path =pt[j];
            if(path["type"]=='CubicBezier'){
                par=BBCubic_Bezier(path["start"][0],path["start"][1]
                         ,path["control1"][0],path["control1"][1]
                         ,path["control2"][0],path["control2"][1]
                         ,path["end"][0],path["end"][1]);
            }
            else if(path["type"]=="Line"){
                par=BBLine(path["start"][0],path["start"][1],path["end"][0],path["end"][1]);
            }
            else if(path["type"]=="QuadraticBezier"){
                par=BBQuadratic_Bezier(path["start"][0],path["start"][1]
                     ,path["control"][0],path["control"][1]
                     ,path["end"][0],path["end"][1])
            }
            else if(path["type"]=="Arc"){
                par=BBArc(path["start"][0],path["start"][1],
                          path["radius"][0],path["radius"][1],
                          path["rotation"],path['arc'],path["sweep"],
                          path["end"][0],path["end"][1]);
            }
            else{
                console.log("Missing:",type(path));
            }
            
            if(ans==-1){
                ans=par
            }else{
                ans["xmin"]=Math.min(par["xmin"],ans["xmin"]);
                ans["xmax"]=Math.max(par["xmax"],ans["xmax"]);
                ans["ymin"]=Math.min(par["ymin"],ans["ymin"]);
                ans["ymax"]=Math.max(par["ymax"],ans["ymax"]);
            }
        }
    }

    var endTime = performance.now();
    console.log(`Call to doSomething took ${endTime - startTime} milliseconds`);

    var s1=`<path d="M ${ans["xmin"]} ${ans["ymin"]} V ${ans["ymax"]}" stroke="#ff0000" stroke-width="1.766"/>
    <path d="M${ans["xmax"]} ${ans["ymin"]} V ${ans["ymax"]}" stroke="#ff0000" stroke-width="1.766"/>
    <path d="M${ans["xmin"]} ${ans["ymin"]} H ${ans["xmax"]}" stroke="#ff0000" stroke-width="1.766"/>
    <path d="M${ans["xmin"]} ${ans["ymax"]} H ${ans["xmax"]}" stroke="#ff0000" stroke-width="1.766"/>`

    console.log(s1);

    return ans;
}

console.log(getBB("try1.svg"));