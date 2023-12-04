let result = [];
let str = [];

let i = 2;
let cal_op = ["add", "sub", "mul", "div", "mod"];

function write(){
    const blob = new Blob([result.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = "ad.ll";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}




function if_contain_calop(line){
    let f = 0;
    cal_op.map((op)=>{
        if (line.includes(op)){
            f = 1;
        }
    })
    return f;
}

function get_inter_name(){
    const name =  `%${i}`;
    i += 1;
    return name;
}

function extract_all_str(TAC){
    let i = 0;
    const regex = /assign, "([^"]+)",/;

    // eslint-disable-next-line array-callback-return
    TAC.map((line)=>{
        const match = line.match(regex);
        if (match && match[1]) {
            const str_value = match[1];
            let name = `@.str.${i}`;
            i += 1;
            const s = `${name} = private unnamed_addr constant [${str_value.length+1} x i8] c"${str_value}\\00", align 1`;
            result.push(s);
            str.push([name,str_value]);
        }
    })
}

function find_str_name(value){
    const index = str.findIndex(subarray => subarray[1] === value);
    return str[index][0];
}

function extract_name(sentence){
    const regex = /\$(.*?)\$/;
    const match = sentence.match(regex);
    if (match && match[1]) {
        return match[1];
    } else {
        return "false";
    }
}

function extract_value(sentence){
    const regex = /assign, (\S+),/;
    const match = sentence.match(regex);
    if (match && match[1]) {
        return match[1];
    } else {
        return "false";
    }
}

function extract_op_TAC(line){
    let res = [];
    const regex = /(\w+), (\$\w+\$|\d+), (\$\w+\$|\d+),/;
    const match = line.match(regex);

    if (match && match[1] && match[2] && match[3]) {
        const op = match[1];
        res.push(op);

        const var1 = match[2].replace(/\$/g, ''); // Remove $ from the variable
        let type = isNaN(var1) ? "identifier" : "number";
        res.push([var1,type]);

        const var2 = match[3].replace(/\$/g, ''); // Remove $ from the variable
        type = isNaN(var2) ? "identifier" : "number";
        res.push([var2,type]);
    }
    return res;
}


function translate(line){
    if (line.includes("declare")){

        let name = extract_name(line);
        let s;
        if(line.includes("string")){
            s = `%${name} = alloca ptr, align 8`;
        }else{
            s = `%${name} = alloca i32, align 4`;
        }
        result.push(s);

    }else if(line.includes("assign")){

        let value = extract_value(line);
        let name = extract_name(line);
        let s;
        if (value === "true"){
            s = `store i32 1, ptr %${name}, align 4`;
        }else if(value === "false"){
            s = `store i32 0, ptr %${name}, align 4`;
        }else if(!isNaN(parseInt(value[0]))){
            s = `store i32 ${value}, ptr %${name}, align 4`;
        }else{
            let str_name = find_str_name(value.replace(/^"(.*)"$/, '$1'));
            s = `store ptr ${str_name}, ptr %${name}, align 8`;
        }
        result.push(s);
    }else if(if_contain_calop(line)){
        let [op, value1, value2] = extract_op_TAC(line);
        if (value1[1] === "identifier"){
            let name = get_inter_name();
            const s = ` ${name} = load i32, ptr %${value1[0]}, align 4`;
            result.push(s);
        }

        if (value2[1] === "identifier"){
            let name = get_inter_name();
            const s = ` ${name} = load i32, ptr %${value2[0]}, align 4`;
            result.push(s);
        }

            let name = get_inter_name();
            if (op === "div" || op === "mod" ){
                if (op === "div"){
                    op = "sdiv";
                }else{
                    op = "srem";
                }
                if (value2[1] === "identifier"){
                    const s = `${name} = ${op}  i32 %${i-2}, %${i-3}`;
                    result.push(s);
                }else{
                    const s = `${name} = ${op}  i32 %${i-2}, ${value2[0]}`;
                    result.push(s);
                }
            }else{
                if (value2[1] === "identifier"){
                    const s = `${name} = ${op} nsw i32 %${i-2}, %${i-3}`;
                    result.push(s);
                }else{
                    const s = `${name} = ${op} nsw i32 %${i-2}, ${value2[0]}`;
                    result.push(s);
                }

            }

    }
}



export function advanced(TAC){
    extract_all_str(TAC);
    result.push("define i32 @main() #0 {");
    result.push("%1 = alloca i32, align 4");
    result.push("store i32 0, ptr %1, align 4");
    TAC.map((t)=>{
        translate(t);
    })
    result.push("ret i32 0");
    result.push("}");
    write();
    return result;
}