let i = 0;
let message = [];
let token = [];

let types = ["int","string","bool"];
let group = [")",";","}","#"];
let group1 = ["true","false","(" ];
let relationOP = ["<", ">", "<>", ">=", "<=", "=="];


function match(input){
    if (input === "RelationOperator"){
        if (relationOP.includes(token[i][1])){
            const s = `match successfully: ${token[i][1]}`;
            message.push([s,1]);
            i++;
            return true;
        }else{
            const s = `unexpected token: ${token[i][1]}`;
            message.push([s,-1]);
            return false;
        }
    }


    if (input === "Constant"){
        if (token[i][0] === "Constant" ) {
            const s = `match successfully: ${token[i][1]}`;
            message.push([s,1]);
            i++;
            return true;
        }else{
            const s = `unexpected token: ${token[i][1]}`;
            message.push([s,-1]);
            return false;
        }
    }

    if (input === "mul"){
        if (token[i][1] === "*" || token[i][1] === "/" || token[i][1] === "%"){
            const s = `match successfully: ${token[i][1]}`;
            message.push([s,1]);
            i++;
            return true;
        }else{
            const s = `unexpected token: ${token[i][1]}`;
            message.push([s,-1]);
            return false;
        }
    }

    if (input === "plus"){
        if (token[i][1] === "+" || token[i][1] === "-"){
            const s = `match successfully: ${token[i][1]}`;
            message.push([s,1]);
            i++;
            return true;
        }else{
            const s = `unexpected token: ${token[i][1]}`;
            message.push([s,-1]);
            return false;
        }
    }

    if (input === "VariableType"){
        if (types.includes(token[i][1])) {
            const s = `match successfully: ${token[i][1]}`;
            message.push([s,1]);
            i++;
            return true;
        }else{
                const s = `unexpected token: ${token[i][1]}`;
                message.push([s,-1]);
                return false;
        }
    }

    if (input === "Identifier"){
        if (token[i][0] === "Identifier" ) {
            const s = `match successfully: ${token[i][1]}`;
            message.push([s,1]);
            i++;
            return true;
        }else{
            const s = `unexpected token: ${token[i][1]}`;
            message.push([s,-1]);
            return false;
        }
    }



    // normal case
    if (input === token[i][1]){
        const s = `match successfully: ${input}`;
        message.push([s,1]);
        i++;
        return true;
    }else{
        const s = `unexpected token: ${input}`;
        message.push([s,-1]);
        return false;
    }
}
function program(){
    const s = "<Program> -> <Declaration> <Sentence>";
    message.push([s,0]);
    return declaration() && sentence();
}

function declaration(){
    const s = "<Declaration> -> <DeclareSentence> ; A";
    message.push([s,0]);
    return declareSentence() && match(";") && A();
}

function A(){
    if (types.includes(token[i][1]) ){
        const s = "A -> <DeclareSentence> ; A";
        message.push([s,0]);
        return declareSentence() && match(";") && A();
    }else if (token[i][0] === "Identifier" ||token[i][1] === "if" || token[i][0] === "while"){
        const s = "A -> e";
        message.push([s,0]);
    }else{
        return false;
    }
    return true;
}

function declareSentence(){
    const s = "<DeclareSentence> -> VariableType <IdentifierList>";
    message.push([s,0]);
    return match("VariableType") && identifierList();
}

function identifierList(){
    const s = "<IdentifierList> -> Identifier B";
    message.push([s,0]);
    return match("Identifier") && B();
}

function B(){
    if (token[i][1] === ","){
        const s = "B -> , <Identifier> B";
        message.push([s,0]);
        return match(",") && match("Identifier") && B();
    }else if (token[i][1] === ";" ){
        const s = "B -> e";
        message.push([s,0]);
    }else{
        return false;
    }
    return true;
}

function sentence(){
    const s = "<Sentence> -> <Statement> D";
    message.push([s,0]);
    return  statement() && D();
}

function D(){
    if (token[i][1] === ";"){
        const s = "D -> ; <Statement> D";
        message.push([s,0]);
        return match(";") && statement() && D();
    }else if (token[i][1] === "}" || token[i][1] === "#" ){
        const s = "D -> e";
        message.push([s,0]);
    }else{
        return false;
    }
    return true;
}

function statement(){
    if (token[i][0] === "Identifier"){
        const s = "<Statement> -> <Assignation>";
        message.push([s,0]);
        return assignation();
    }else if (token[i][1] === "if"){
        const s = "<Statement> -> <Condition>";
        message.push([s,0]);
        return condition();
    }else if (token[i][1] === "while"){
        const s = "<Statement> -> <Loop>";
        message.push([s,0]);
        return loop();
    }else{
        return false;
    }
}

function assignation(){
    const s = "<Assignation> -> Identifier := <Expression>";
    message.push([s,0]);
    return match("Identifier") && match(":=") && expression();
}

function expression(){
    const s = "<Expression> -> <Conjunction> E";
    message.push([s,0]);
    return conjunction() && E();
}

function E(){
    if (token[i][1] === "or"){
        const s = "E -> or <Conjunction > E";
        message.push([s,0]);
        return match("or") && conjunction() && E();
    }else if (group.includes(token[i][1])){
        const s = "E -> e";
        message.push([s,0]);
    }else{
        return false;
    }
    return true;
}

function conjunction(){
    const s = "<Conjunction> -> <Inversion> F";
    message.push([s,0]);
    return inversion() && F();
}

function F(){
    if (token[i][1] === "and"){
        const s = "F -> and <Inversion> F";
        message.push([s,0]);
        return match("and") && inversion() && F();
    }else if (group.includes(token[i][1]) || token[i][1] === "or"){
        const s = "F -> e";
        message.push([s,0]);
    }else{
        return false;
    }
    return true;
}

function inversion(){
    if (token[i][1] === "not"){
        const s = "<Inversion> -> not <Inversion>";
        message.push([s,0]);
        return match("not") && inversion();
    }else if (group1.includes(token[i][1]) || token[i][0] === "Identifier" || token[i][0] === "Constant"){
        const s = "<Inversion> -> <RelationExpression>";
        message.push([s,0]);
        return relationExpression();
    }else{
        return false;
    }
}

function relationExpression(){
    const s = "<RelationExpression> -> <Arthmetic> G";
    message.push([s,0]);
    return arthmetic() && G();
}

function G(){
    if (relationOP.includes(token[i][1]) ){
        const s = "G -> RelationOperator <Arthmetic>";
        message.push([s,0]);
        return match("RelationOperator") && arthmetic();
    }else if (group.includes(token[i][1]) || token[i][1] === "and" ||token[i][1] === "or" ){
        const s = "G -> e";
        message.push([s,0]);
    }else{
        return false;
    }
    return true;
}

function arthmetic(){
    const s = "<Arthmetic> -> <Term> H";
    message.push([s,0]);
    return term() && H();
}

function H(){
    if (token[i][1] === "+" || token[i][1] === "-" ){
        const s = "H -> +,- <Term> H";
        message.push([s,0]);
        return match("plus") && term() && H();
    }else if (group.includes(token[i][1]) || relationOP.includes(token[i][1]) ||token[i][1] === "and" ||token[i][1] === "or" ){
        const s = "H -> e";
        message.push([s,0]);
    }else{
        return false;
    }
    return true;
}

function term(){
    const s = "<Term> -> <Factor> I";
    message.push([s,0]);
    return factor() && I();
}

function I(){
    if (token[i][1] === "*" || token[i][1] === "/" || token[i][1] === "%" ){
        const s = "I -> *,/,% <Factor> I";
        message.push([s,0]);
        return match("mul") && factor() && I();
    }else if (group.includes(token[i][1]) || relationOP.includes(token[i][1]) ||token[i][1] === "and"
        ||token[i][1] === "or" || token[i][1] === "+" || token[i][1] === "-" ){
        const s = "I -> e";
        message.push([s,0]);
    }else{
        return false;
    }
    return true;
}

function factor(){
    if(token[i][0] === "Identifier"){
        const s = "<Factor> -> Identifier";
        message.push([s,0]);
        return match("Identifier");
    }else if(token[i][1] === "true"){
        return match("true");
    }else if(token[i][1] === "false"){
        return match("false");
    }else if(token[i][0] === "Constant"){
        const s = "<Factor> -> Constant";
        message.push([s,0]);
        return match("Constant");
    }else if(token[i][1] === "("){
        return match("(") && expression() && match(")");
    }else{
        return false;
    }
}



// function refine(message){
//     for(let i = 0; i< 4; i++){
//         message.pop();
//     }
// }

function condition(){
    const s = "<Condition> -> if (<Expression>) <Nest> else <Nest>";
    message.push([s,0]);
    return match("if") && match("(") && expression() && match(")")
        && nest() && match("else") && nest();
}

function loop(){
    const s = "<Loop> -> while (<Expression>) : <Nest>";
    message.push([s,0]);
    return match("while") && match("(") && expression() && match(")")
        && match(":") && nest();
}

function nest(){
    if(token[i][0] === "Identifier" || token[i][1] === "if"|| token[i][1] === "while" ){
        const s = "<Nest> -> <Statement> ;";
        message.push([s,0]);
        return statement() && match(";");
    }else if(token[i][1] === "{"){
        const s = "<Nest> -> <Composit>";
        message.push([s,0]);
        return composit();
    }
}

function composit(){
    const s = "<Composit> -> {<Sentence>}";
    message.push([s,0]);
    return match("{") && sentence() && match("}");
}


export function Analyze(tokens){
    token = tokens;
    if (token[i][1] === "#"){
        return message;
    }
    program();
    return message;
}