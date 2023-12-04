let i = 0;
let token = [];

let types = ["int","string","bool"];
let group = [")",";","}","#"];
let group1 = ["true","false","(" ];
let relationOP = ["<", ">", "<>", ">=", "<=", "=="];



// type, name, value
let symbol_table = [];
let temp_index = 0;
let TAC = [];
let warning = []

// Global variable
let type = "";

class symbol_table_entry{
    constructor(type, name, value) {
        this.type = type;
        this.name = name;
        this.value = value;
    }

    add_table(){
        symbol_table.push([this.type,this.name, this.value])
    }

    get_value_type(){
        if (this.value === true || this.value === false){
            return "bool";
        }else if(typeof this.value === "string"){
            return "string"
        }else if(!isNaN(this.value)){
            return "int";
        }else{
            return "null";
        }
    }
}


function get_TAC_entry(operator,oprand1,oprand2,result){
    return `(${operator}, ${oprand1}, ${oprand2}, ${result})`;
}

function get_temp_var(type,value){
    let temp_var = `%${temp_index}`;
    temp_index += 1;
    return temp_var;
}


function update_symbol_table(name,value){
    const index = symbol_table.findIndex(subarray => subarray[1] === name);
    symbol_table[index][2] = value;
}

function update_type(name,type){
    const index = symbol_table.findIndex(subarray => subarray[1] === name);
    symbol_table[index][0] = type;
}

function get_symbol_type(name){
    const index = symbol_table.findIndex(subarray => subarray[1] === name);
    if (index === -1){
        return "false";
    }
    return symbol_table[index][0];
}

function get_symbol_value(name){
    const index = symbol_table.findIndex(subarray => subarray[1] === name);
    if (index === -1){
        return "false";
    }
    return symbol_table[index][2];
}

const operator_Map_Name = {
    "<": "lt",
    ">": "gt",
    "<>": "noteq",
    "<=": "lte",
    ">=": "gte",
    "==": "eq",
    "+": "add",
    "-": "sub",
    "*": "mul",
    "/": "div",
    "%": "mod",
};



const operators = {
    bool: {
        "<": (op1, op2) => op1 < op2,
        "<=": (op1, op2) => op1 <= op2,
        ">": (op1, op2) => op1 > op2,
        ">=": (op1, op2) => op1 >= op2,
        "==": (op1, op2) => op1 === op2,
        "<>": (op1, op2) => op1 !== op2,
        "+": (op1, op2) => op1 + op2,
        "-": (op1, op2) => (op1 - op2) < 0?0:(op1 - op2),
        "*": (op1, op2) => op1 * op2 ,
        "/": (op1, op2) => op2?(op1 / op2):"false",
        "%": (op1, op2) => op2?(op1 % op2):"false",
    },
    int: {
        "<": (op1, op2) => op1 < op2,
        "<=": (op1, op2) => op1 <= op2,
        ">": (op1, op2) => op1 > op2,
        ">=": (op1, op2) => op1 >= op2,
        "==": (op1, op2) => op1 === op2,
        "<>": (op1, op2) => op1 !== op2,
        "+": (op1, op2) => op1 + op2,
        "-": (op1, op2) => (op1 - op2) < 0?0:(op1 - op2),
        "*": (op1, op2) => Number(String(op1 * op2).slice(0, 4)),
        "/": (op1, op2) => op2?(op1 / op2):"false",
        "%": (op1, op2) => op2?(op1 % op2):"false",
    },
    string: {
        "<": (op1, op2) => op1.length < op2.length,
        "<=": (op1, op2) => op1.length <= op2.length,
        ">": (op1, op2) => op1.length > op2.length,
        ">=": (op1, op2) => op1.length >= op2.length,
        "==": (op1, op2) => op1.length === op2.length,
        "<>": (op1, op2) => op1.length !== op2.length,
        "+": (op1, op2) => op1.replace(/^"(.*)"$/, '$1') + op2.replace(/^"(.*)"$/, '$1'),
    },
};

function special_op(operator,op1,op2){
    if(operator !== "*"){
        return false;
    }
    if(op2 === 0){
        return "";
    }else if(op2 === 1){
        return op1;
    }else if(op2 === 2){
        return op1.replace(/^"(.*)"$/, '$1') + op1.replace(/^"(.*)"$/, '$1');
    }else{
        return "false";
    }
}


function write(){
    const blob = new Blob([TAC.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = "TAC.txt";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}




function match(input){
    if (input === "RelationOperator"){
        if (relationOP.includes(token[i][1])){
            i++;
            return true;
        }else{
            return false;
        }
    }


    if (input === "Constant"){
        if (token[i][0] === "Constant" ) {
            i++;
            return true;
        }else{
            return false;
        }
    }

    if (input === "mul"){
        if (token[i][1] === "*" || token[i][1] === "/" || token[i][1] === "%"){
            i++;
            return true;
        }else{
            return false;
        }
    }

    if (input === "plus"){
        if (token[i][1] === "+" || token[i][1] === "-"){
            i++;
            return true;
        }else{
            return false;
        }
    }

    if (input === "VariableType"){
        if (types.includes(token[i][1])) {
            type = token[i][1];
            i++;
            return true;
        }else{
            return false;
        }
    }

    if (input === "Identifier"){
        if (token[i][0] === "Identifier" ) {
            i++;
            return true;
        }else{
            return false;
        }
    }



    // normal case
    if (input === token[i][1]){
        i++;
        return true;
    }else{
        return false;
    }
}
function program(){
    declaration();
    sentence();
}


function declaration(){
    declareSentence();
    match(";");
    A();
}

function A(){
    if (types.includes(token[i][1]) ){
        declareSentence();
        match(";");
        A();
    }else if (token[i][0] === "Identifier" ||token[i][1] === "if" || token[i][0] === "while"){
    }
}

function declareSentence(){
    match("VariableType");
    identifierList();
}

function identifierList(){
    let name = token[i][1];

    match("Identifier");

    // avoid duplicate define
    if (get_symbol_type(name) === "false"){
        symbol_table.push([type, name, ""]);
    }else{
        if (type !== get_symbol_type(name)){
            update_type(name,type);
        }
    }

    const s = get_TAC_entry("declare", type, "null", `${name}.type`);
    TAC.push(s);

    B();
}

function B(){
    if (token[i][1] === ","){
        match(",");
        let name = token[i][1];
        match("Identifier");
        if (get_symbol_type(name) === "false"){
            symbol_table.push([type, name, ""]);
        }else{
            if (type !== get_symbol_type(name)){
                update_type(name,type);
            }
        }
        const s = get_TAC_entry("declare", type, "null", `${name}.type`);
        TAC.push(s);

        B();
    }else if (token[i][1] === ";" ){
    }
}

function sentence(){
    statement();
    D();
}

function D(){
    if (token[i][1] === ";"){
        match(";");
        statement();
        D();
    }else if (token[i][1] === "}" || token[i][1] === "#" ){}
}

function statement(){
    if (token[i][0] === "Identifier"){
        assignation();
    }else if (token[i][1] === "if"){
        condition();
    }else if (token[i][1] === "while"){
        loop();
    }
}

function assignation(){
    let name = token[i][1];

    match("Identifier");
    match(":=");
    let entry = expression();

    //check type
    let value_type = entry.get_value_type();
    let var_type = get_symbol_type(name);
    if (value_type !== var_type){
        const warn = `type mismatched when assign, variable name:${name}, type:${var_type}, value type:${value_type}`;
        warning.push(warn);
    }else{
        update_symbol_table(name,entry.value);
    }

    const ss = get_TAC_entry("assign", entry.value, "null", name);
    TAC.push(ss);
}

function expression(){
    let con_entry = conjunction();
    return E(con_entry);
}

function E(e_entry){
    if (token[i][1] === "or"){

        match("or");
        let entry = conjunction();

        let temp_name = get_temp_var();

        // check type
        let value_type = entry.get_value_type();
        let pass_entry;
        if (value_type !== "bool"){
            const warn = `mismatched calculate, or should followed by bool, but got value: ${entry.value} type: ${value_type}`;
            warning.push(warn);
            pass_entry = new symbol_table_entry("bool",temp_name,"null");
            pass_entry.add_table();
        }else{
            let value = e_entry.value | entry.value;
            pass_entry = new symbol_table_entry("bool",temp_name,value);
            pass_entry.add_table();
        }

        const ss = get_TAC_entry("or", e_entry.value, entry.value, temp_name);
        TAC.push(ss);

        return E(pass_entry);
    }else if (group.includes(token[i][1])){
        return e_entry;
    }
}

function conjunction(){
    let entry1 = inversion()
    return F(entry1);
}

function F(f_entry){
    if (token[i][1] === "and"){
        match("and");
        let entry = inversion();
        let temp_name = get_temp_var();

        // check type
        let value_type = entry.get_value_type();
        let pass_entry;
        if (value_type !== "bool"){
            const warn = `mismatched calculate, or should followed by bool, but got value: ${entry.value} type: ${value_type}`;
            warning.push(warn);
            pass_entry = new symbol_table_entry("bool",temp_name,"null");
            pass_entry.add_table();
        }else{
            let value = f_entry.value & entry.value;
            pass_entry = new symbol_table_entry("bool",temp_name,value);
            pass_entry.add_table();
        }

        const ss = get_TAC_entry("and", f_entry.value, entry.value, temp_name);
        TAC.push(ss);

        return F(entry);
    }else if (group.includes(token[i][1]) || token[i][1] === "or"){
        return f_entry;
    }
}

function inversion(){
    if (token[i][1] === "not"){
        // const s = "<Inversion> -> not <Inversion>";
        // message.push([s,0]);
        match("not")
        let entry = inversion();
        let pass_entry;
        let temp_name = get_temp_var();
        // check type
        if (entry.get_value_type() !== "bool"){
            const warn = `mismatched calculate, or should followed by bool, but got value: ${entry.value} type: ${entry.get_value_type()}`;
            warning.push(warn);
            pass_entry = new symbol_table_entry("bool",temp_name,"null");
            pass_entry.add_table();
        }else{
            pass_entry = new symbol_table_entry("bool",temp_name,!entry.value);
            pass_entry.add_table();
        }

        const ss = get_TAC_entry("not",entry.name,"null",temp_name);
        TAC.push(ss);
        return pass_entry;
    }else if (group1.includes(token[i][1]) || token[i][0] === "Identifier" || token[i][0] === "Constant"){
        return relationExpression();
    }
}

function relationExpression(){
    let entry = arthmetic()
    return G(entry);
}

function G(g_entry){
    if (relationOP.includes(token[i][1]) ){
        let operator = token[i][1];
        match("RelationOperator");
        let entry = arthmetic();
        let pass_entry;
        let temp_name = get_temp_var();
        //check type
        if (entry.get_value_type() !== g_entry.get_value_type()){
            const warn = `mismatched calculate,two operands not same type: name:${g_entry.name} ,${g_entry.get_value_type()}, name:${entry.name}  ${entry.get_value_type()}`;
            warning.push(warn);
            pass_entry = new symbol_table_entry("bool",temp_name,"null");
            pass_entry.add_table();
        }else{
            let value = operators[entry.get_value_type()][operator](g_entry.value, entry.value);
            pass_entry = new symbol_table_entry("bool",temp_name,value);
            pass_entry.add_table();
        }

        let op_name = operator_Map_Name[operator];
        const ss = get_TAC_entry(op_name,g_entry.name,entry.name,temp_name);
        TAC.push(ss);
        return pass_entry;

    }else if (group.includes(token[i][1]) || token[i][1] === "and" ||token[i][1] === "or" ){
        return g_entry;
    }
}

function arthmetic(){
    // const s = "<Arthmetic> -> <Term> H";
    // message.push([s,0]);
    let entry = term();
    return H(entry);
}

function H(h_entry){
    if (token[i][1] === "+" || token[i][1] === "-" ){
        // const s = "H -> +,- <Term> H";
        // message.push([s,0]);
        let operator = token[i][1];
        match("plus")
        let entry = term();
        let pass_entry;
        let temp_name = get_temp_var();
        //check type
        if (entry.get_value_type() !== h_entry.get_value_type()){
            const warn = `mismatched calculate,two operands not same type: name:${h_entry.name}, ${h_entry.get_value_type()}, name:${entry.name}, ${entry.get_value_type()}`;
            warning.push(warn);
            pass_entry = new symbol_table_entry("null",temp_name,"null");
            pass_entry.add_table();
        }else{
            let value = operators[entry.get_value_type()][operator](h_entry.value, entry.value);
            pass_entry = new symbol_table_entry(typeof value,temp_name,value);
            pass_entry.add_table();
        }

        let op_name = operator_Map_Name[operator];
        const ss = get_TAC_entry(op_name,h_entry.name,entry.name,temp_name);
        TAC.push(ss);
        return H(pass_entry);
    }else if (group.includes(token[i][1]) || relationOP.includes(token[i][1]) ||token[i][1] === "and" ||token[i][1] === "or" ){
        // const s = "H -> e";
        // message.push([s,0]);
        return h_entry;
    }
}

function term(){
    // const s = "<Term> -> <Factor> I";
    // message.push([s,0]);
    let entry =  factor();
    return I(entry);
    // need to loop up value when calculate with var
}

function I(i_entry) {
    if (token[i][1] === "*" || token[i][1] === "/" || token[i][1] === "%") {
        // const s = "I -> *,/,% <Factor> I";
        // message.push([s,0]);
        let operator = token[i][1];
        match("mul");
        let entry = factor();
        let pass_entry;
        let temp_name = get_temp_var();
        let value;

        //check type
        if (i_entry.get_value_type() === "string" && entry.get_value_type() === "int") {
            value = special_op(operator, i_entry.value, entry.value);
            if (value === "false") {
                const warn = `Semantic error, may exceed 2 or not allowed operation : var name:${i_entry.name}, ${operator}, ${entry.value}`;
                warning.push(warn);
                pass_entry = new symbol_table_entry("null", temp_name, "null");
                pass_entry.add_table();
            }else{
                pass_entry = new symbol_table_entry("string", temp_name, value);
                pass_entry.add_table();
            }
        } else {
            if (entry.get_value_type() !== i_entry.get_value_type()) {
                const warn = `mismatched calculate,two operands not same type: name:${i_entry.name}, ${i_entry.get_value_type()}, name:${entry.name},  ${entry.get_value_type()}`;
                warning.push(warn);
                pass_entry = new symbol_table_entry("null", temp_name, "null");
                pass_entry.add_table();
            } else {
                let value = operators[entry.get_value_type()][operator](i_entry.value, entry.value);
                if (value === "false"){
                    const warn = `calculate not support or divide by 0: name:${i_entry.name}, ${i_entry.get_value_type()}, name:${entry.name},  ${entry.get_value_type()}`;
                    warning.push(warn);
                }
                pass_entry = new symbol_table_entry(typeof value, temp_name, value);
                pass_entry.add_table();
            }
        }

        let op_name = operator_Map_Name[operator];
        const ss = get_TAC_entry(op_name, i_entry.name, entry.name, temp_name);
        TAC.push(ss);

        return I(pass_entry);
    } else if (group.includes(token[i][1]) || relationOP.includes(token[i][1]) || token[i][1] === "and"
        || token[i][1] === "or" || token[i][1] === "+" || token[i][1] === "-") {
        // const s = "I -> e";
        // message.push([s,0]);
        return i_entry;
    }
}

function factor(){
    if(token[i][0] === "Identifier"){
        // const s = "<Factor> -> Identifier";
        // message.push([s,0]);
        let name = token[i][1];
        match("Identifier");
        let value = get_symbol_value(name);
        if (value === "false"){
            const warn = `use before declare: ${name}`;
            warning.push(warn);
            return new symbol_table_entry("null",name,"null");
        }
        let type = get_symbol_type(name);
        return new symbol_table_entry(type,name,value);
    }else if(token[i][1] === "true"){
        match("true");
        return new symbol_table_entry("bool","true",true);
    }else if(token[i][1] === "false"){
        match("false");
        return new symbol_table_entry("bool","false",false);
    }else if(token[i][0] === "Constant"){
        let value = token[i][1];
        match("Constant");
        if (!isNaN(parseInt(value[0]))){
            return new symbol_table_entry("int",value,parseInt(value));
        }else{
            return new symbol_table_entry("string",value,value);
        }
    }else if(token[i][1] === "("){
        match("(");
        let entry = expression();
        match(")");
        return entry;
    }
}



function condition(){
    // const s = "<Condition> -> if (<Expression>) <Nest> else <Nest>";
    // message.push([s,0]);
    match("if");
    match("(");
    let entry = expression();
    match(")");

    let position = TAC.length + 2;
    let s = `(jnz, ${entry.name}, null, ${position} )`
    TAC.push(s);
    s = `(jump, null, null, 0)`
    TAC.push(s);

    nest();
    match("else");

    let back = TAC.length;
    s = `(jump, null, null, ${back + 1})`
    TAC[position-1] = s;
    s = `(jump, null, null, 0)`
    TAC.push(s);

    nest();
    let bback = TAC.length;
    s = `(jump, null, null, ${bback})`
    TAC[back] = s
}

function loop(){
    // const s = "<Loop> -> while (<Expression>) : <Nest>";
    // message.push([s,0]);
    match("while");
    match("(");

    let position = TAC.length;
    let entry = expression();
    match(")")
    match(":");

    let here = TAC.length + 2;
    let s = `(jnz, ${entry.name}, null, ${here} )`
    TAC.push(s);
    s = `(jump, null, null, 0)`
    TAC.push(s);

    nest();
    let back = TAC.length + 1;
    s = `(jump, null, null, ${position})`
    TAC.push(s);
    s  = `(jump, null, null, ${back})`;
    TAC[here-1] = s;

}

function nest(){
    if(token[i][0] === "Identifier" || token[i][1] === "if"|| token[i][1] === "while" ){
        // const s = "<Nest> -> <Statement> ;";
        // message.push([s,0]);
        statement();
        match(";");
    }else if(token[i][1] === "{"){
        // const s = "<Nest> -> <Composit>";
        // message.push([s,0]);
        composit();
    }
}

function composit(){
    // const s = "<Composit> -> {<Sentence>}";
    // message.push([s,0]);
    match("{");
    sentence();
    match("}");
}


export function generate(tokens){
    token = tokens;
    if (token[i][1] === "#"){
        return [TAC,symbol_table, warning];
    }
    program();
    // write();
    return [TAC,symbol_table, warning];
}