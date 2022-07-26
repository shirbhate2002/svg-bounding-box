const COMMANDS="MmZzLlHhVvCcSsQqTtAa";
const UPPERCASE ="MZLHVCSQTA";
const COMMAND_RE = '([MmZzLlHhVvCcSsQqTtAa])';
const FLOAT_RE= /[-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?/g;

function _tokenize_path(pathdef){

    var x=pathdef.split(new RegExp(COMMAND_RE));

    var ans=[];
    for(var i=0;i<x.length;i++){
        if(x[i].length==0){
            continue;
        }
        else if(COMMANDS.includes(x[i])){
            ans.push(x[i]);
        }else{
            //console.log(x[i].match(FLOAT_RE));
            ans=ans.concat(x[i].match(FLOAT_RE));
        }
    }
    return ans;
}

function _parse_path(pathdef){

    const elements= _tokenize_path(pathdef);
    //console.log(elements);

    elements.reverse();

    var current_pos=[0,0];

    var segments=[];

    var start_pos = null;
    var command = null;
    var last_command=null;
    var absolute=null;

    while(elements.length>0){
        
        if(COMMANDS.includes(elements[elements.length - 1])){
            last_command = command  // Used by S and T
            command=elements.pop();
            absolute=UPPERCASE.includes(command);
            command=command.toUpperCase();
        }else{
            if(command==null)
                continue;
            last_command=command;
        }

        if(command=='M'){
            //Moveto command.
            //console.log("Called:M---------------");
            var x = elements.pop();
            var y = elements.pop();
            var pos = [parseFloat(x),parseFloat(y)];
            //check;
            if(absolute){
                current_pos = pos;
            }
            else{
                current_pos[0]+= pos[0];
                current_pos[1]+= pos[1];
            }
            start_pos = current_pos;
            command = 'L';
        }
        else if(command == 'Z'){
            //check
            //console.log("Called:Z---------------");
            if (current_pos != start_pos){
                segments.push({"type":"Line","start":current_pos,"end":start_pos,"ed":1});
            }
            current_pos = start_pos;
            command = null;
        }
        else if(command == 'L'){
            //console.log("Called:L---------------");
            var x = elements.pop();
            var y = elements.pop();
            var pos = [parseFloat(x),parseFloat(y)];
            if(!absolute){
                pos[0]+= current_pos[0];
                pos[1]+= current_pos[1];
            }
            //console.log(absolute,pos);
            segments.push({"type":"Line","start":current_pos,"end":pos,"ed":2});
            //console.log(segments[segments.length-1]);
            current_pos = pos;
        }
        else if(command == 'H'){
            //console.log("Called:H---------------");
            var x = elements.pop()
            var pos = [parseFloat(x),current_pos[1]];
            if(!absolute){
                pos[0]+= current_pos[0];
            }
            segments.push({"type":"Line","start":current_pos,"end":pos,"ed":3});
            current_pos = pos;
        }
        else if(command == 'V'){
            //console.log("Called:V---------------");
            var y = elements.pop();
            var pos = [current_pos[0] ,parseFloat(y)];
            if(!absolute){
                pos[1]+=current_pos[1];
            }
            segments.push({"type":"Line","start":current_pos,"end":pos,"ed":4})
            current_pos = pos
        }
        else if(command == 'C'){
            //console.log("Called:C---------------");

            var control1 = [parseFloat(elements.pop()) , parseFloat(elements.pop())];
            var control2 = [parseFloat(elements.pop()) , parseFloat(elements.pop())];
            var end = [parseFloat(elements.pop()) , parseFloat(elements.pop())];

            if(!absolute){
                control1[0]+= current_pos[0];
                control1[1]+= current_pos[1];
                control2[0]+= current_pos[0];
                control2[1]+= current_pos[1];
                end[0]+= current_pos[0];
                end[1]+= current_pos[1];
            }
            segments.push({"type":"CubicBezier","start":current_pos,"control1":control1,"control2":control2, "end":end,'t':1})
            current_pos = end
        }
        else if(command == 'S'){
            //check;
            //console.log("Check 0:",segments);
            var control1=[0,0];

            if(!'CS'.includes(last_command)){
                control1 = current_pos;
            }
            else{
                control1[0] = current_pos[0] + current_pos[0] - segments[segments.length-1]["control2"][0];
                control1[1] = current_pos[1] + current_pos[1] - segments[segments.length-1]["control2"][1];

            }
            //console.log("Check 1:",segments);

            var control2 = [parseFloat(elements.pop()) , parseFloat(elements.pop())];
            var end = [parseFloat(elements.pop()) , parseFloat(elements.pop())];
            if (!absolute){
                control2[0]+= current_pos[0];
                control2[1]+= current_pos[1];

                end[0]+= current_pos[0];
                end[1]+= current_pos[1];
            }

            //console.log("Check 1.5:",segments);

            segments.push({"type":"CubicBezier","start":current_pos,"control1":control1,"control2":control2, "end":end,'t':1})
            //console.log("Check 1:",segments);
            
            current_pos = end
            //console.log("Check 2:",segments);

        }
        else if(command == 'Q'){
            //console.log("Called:Q---------------");
            var control = [parseFloat(elements.pop()) , parseFloat(elements.pop())];
            var end = [parseFloat(elements.pop()) , parseFloat(elements.pop())];

            if (!absolute){
                control[0]+= current_pos[0];
                control[1]+= current_pos[1];
                end[0]+= current_pos[0];
                end[1]+= current_pos[1];
            }
            segments.push({"type":"QuadraticBezier","start":current_pos,"control":control,"end":end});
            current_pos = end
        }
        else if(command == 'T'){
            //check
            //console.log("Called:T---------------");
            var control=[0,0];
            if (!'QT'.includes(last_command)){
                control = current_pos;
            }
            else{
                //error 404
                control[0] = current_pos[0] + current_pos[0] - segments[segments.length-1]["control"][0];
                control[1] = current_pos[1] + current_pos[1] - segments[segments.length-1]["control"][1];

            }

            var end = [parseFloat(elements.pop()) , parseFloat(elements.pop())];
            if (!absolute){
                end[0] += current_pos[0];
                end[1] += current_pos[1];
            }
            segments.push({"type":"QuadraticBezier","start":current_pos,"control":control,"end":end})
            current_pos = end
        }
        else if(command == 'A'){
            //console.log("Called:A---------------");

            var radius = [parseFloat(elements.pop()) , parseFloat(elements.pop())];
            var rotation = parseFloat(elements.pop())
            var arc = parseFloat(elements.pop())
            var sweep = parseFloat(elements.pop())
            var end = [parseFloat(elements.pop()) , parseFloat(elements.pop())];

            if (!absolute){
                end[0]+= current_pos[0];
                end[1]+= current_pos[1];

            }
            if (radius[0] == 0 || radius[1] == 0){
                segments.push({"type":"Line","start":current_pos,"end":end,"ed":5});
            }
            else{
                segments.push({"type":"Arc","start":current_pos,"radius":radius,"rotation":rotation,"arc":arc,"sweep":sweep,"end":end})
            }
            current_pos = end
        }
        //console.log(start_pos,command,last_command,absolute,segments.length,current_pos);
        //console.log("->>>>>>>",segments);

    }
    return segments
}

function _parse_paths(arr){
    var ans=[];
    //console.log(arr.length);
    for(var i=0;i<arr.length;i++){
        ans.push(_parse_path(arr[i]));
    }
    return ans;
}

//console.log(_parse_path("m1.617.783 445.89 76.027s204.11 181.507-21.233 142.466S1.617.783 1.617.783z"));

module.exports = {_parse_paths};
