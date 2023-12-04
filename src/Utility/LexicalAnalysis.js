import {Analyze} from "./SyntacAnalysis.js";
import {generate} from "./semantic_analysis.js";
class DFAState {
    constructor(name, isAccepting = false) {
        this.name = name;
        // transition between states
        this.transitions = new Map();
        this.isAccepting = isAccepting;
    }

    // Add a transition to another state
    addTransition(input, nextState) {
        this.transitions.set(input, nextState);
    }
}

class DFA {
    constructor() {
        this.states = new Map();
        this.currentState = null;
        this.tokens = [];
        this.Debug = [];
    }

    // Add a state to the DFA
    addState(name, isAccepting = false) {
        const state = new DFAState(name, isAccepting);
        this.states.set(name, state);
        if (this.currentState === null) {
            this.currentState = state; // Set the initial state
        }
        return state;
    }

    // Add a transition between states
    addTransition(frontState, input, endState) {
        const front = this.states.get(frontState);
        const end = this.states.get(endState);
        if (front && end) {
            front.addTransition(input, end);
        }
    }

    // Reset the DFA to the start state
    reset() {
        this.currentState = this.states.values().next().value; // Get the first state
    }

    // Process input character by character
    processInput(inputString) {
        this.reset();
        let word = "";
        let mode = 0
        for (const char of inputString){

            // mode to recognize constant number
            if(mode === 1){
                if(char >= '0'&& char <= '9'){
                    word += char;
                    continue;
                }
                else{
                    // exit this mode, but still need to take this input
                    mode = 0;
                    this.tokens.push(["Constant",word])
                    word = "";
                }
            }
            else if(mode === 2){
                // mode to recognize literal

                // end condition
                if (char === '"')
                    mode = 0;
                else{
                    // error handling, char must in [a-Z0-9]
                    if (/^[a-zA-Z0-9]+$/.test(char)){
                        word += char;
                        continue;
                    }
                    else{
                        this.Debug.push([0,"while recognize literal, meet unexpected char: "+char]);
                        return false;
                    }

                }
            }
            else if(mode === 3){
                // mode to recognize identifier

                // end condition
                if (char === '$')
                    mode = 0;
                else{
                    // error handling, the first char must in [a-Z]
                    if(word.length === 1){
                        if (/^[a-zA-Z]+$/.test(char)){
                            word += char;
                            continue;
                        }
                        else{
                            this.Debug.push([2,"invalid identifier first char must in [a-Z] your is: "+char]);
                            return false;
                        }
                    }
                    if (/^[a-zA-Z0-9]+$/.test(char)){
                        word += char;
                        continue;
                    }
                    else{
                        this.Debug.push([2,"while recognize literal, meet unexpected char: "+char]);
                        return false;
                    }
                }
            }
            else if(mode === 4){
                // mode to compare operator and  : and :=

                if (char === '='||char === '>'){
                    word += char;
                    continue;
                }
                else{
                    // reset
                    mode = 0;
                    this.tokens.push(["Operator",word]);
                    word = "";
                }
            }

            // special case handel
            if (char === ' '||char === '\n')
                continue;
            else if(char === ';'||char === '{'||char === '}'||char === '('||char === ')'||char === ','){
                this.currentState = this.states.get("Punctuation");
                this.Debug.push([0,"state A to Punctuation with "+char]);
            }
            else if(char === '+'||char === '-'||char === '*'||char === '/'||char === '%'){
                this.currentState = this.states.get("Operator");
                this.Debug.push([0,"state A to Operator with "+char]);
            }
            else if (this.currentState.name === "A" && char >= '0'&& char <= '9'){
                mode = 1;
                this.Debug.push([0,"state A to Constant with "+char]);
            }
            else if (char === '"' ){
                this.currentState = this.currentState.transitions.get(char);
                this.Debug.push([0,"state A to J with \" " ]);
                mode = 2;
            }
            else if (char === '$' ){
                this.Debug.push([0,"state "+this.currentState.name+  " to " +
                this.currentState.transitions.get(char).name + " with $ "] );

                this.currentState = this.currentState.transitions.get(char);
                mode = 3;
            }
            else if (char === '<'||char === '>'||char === ':' ){
                mode = 4;
                this.Debug.push([0,"state A to Operator with "+char]);
            }
            else{
                const nextState = this.currentState.transitions.get(char);
                if (!nextState) {
                    // Transition not found, input rejected
                    console.log("error"+word);
                    return false;
                }
                // record debug information
                this.Debug.push([0,"state "+this.currentState.name+ " to "+nextState.name+ " with "+ char])

                this.currentState = nextState;

            }

            word += char;

            // add token and reset
            if(this.currentState.isAccepting){
                this.tokens.push([this.currentState.name,word])
                this.Debug.push([1,"find token "+word]);
                this.reset();
                word = "";
                mode = 0;
            }
        }

        // the last lexeme is constant number or compare operator
        if(mode === 1)
            this.tokens.push(["Constant",word])
    }
}


// set up DFA for HW
function setup_DFA() {
    const dfa = new DFA();
    // set start state
    const A = dfa.addState('A');

    // set intermediate state
    const B = dfa.addState('B');
    const B1 = dfa.addState('B1');
    const C = dfa.addState('C');
    const C1 = dfa.addState('C1');
    const D = dfa.addState('D');
    const D1 = dfa.addState('D1');
    const D2 = dfa.addState('D2');
    const D3 = dfa.addState('D3');
    const D4 = dfa.addState('D4');
    const E = dfa.addState('E');
    const E1 = dfa.addState('E1');
    const E2 = dfa.addState('E2');
    const F = dfa.addState('F');
    const F1 = dfa.addState('F1');
    const F2 = dfa.addState('F2');
    const F3 = dfa.addState('F3');
    const G = dfa.addState('G');
    const G1 = dfa.addState('G1');
    const G2 = dfa.addState('G2');
    const H = dfa.addState('H');
    const H1 = dfa.addState('H1');
    const H2 = dfa.addState('H2');
    const I = dfa.addState('I');
    const I1 = dfa.addState('I1');
    const I2 = dfa.addState('I2');
    const I3 = dfa.addState('I3');
    const J = dfa.addState('J');
    const K = dfa.addState('K');

    const M = dfa.addState('M');
    const N = dfa.addState('N');
    const N1 = dfa.addState('N1');
    const O = dfa.addState('O');
    const O1 = dfa.addState('O1');



    // set final states
    const Identifier = dfa.addState('Identifier', true);
    const Keyword = dfa.addState('Keyword', true);
    const Operator = dfa.addState('Operator', true);
    const Punctuation = dfa.addState('Punctuation', true);
    const Constant = dfa.addState('Constant', true);


    // addTransition

    // white space
    dfa.addTransition('A', ' ', 'A');
    dfa.addTransition('A', '\n', 'A');

    // identifier
    dfa.addTransition('A', '$', 'B');
    dfa.addTransition('B', '$', 'Identifier');

    // int
    dfa.addTransition('A', 'i', 'C');
    dfa.addTransition('C', 'n', 'C1');
    dfa.addTransition('C1', 't', 'Keyword');

    // if
    dfa.addTransition('C', 'f', 'Keyword');

    // string
    dfa.addTransition('A', 's', 'D');
    dfa.addTransition('D', 't', 'D1');
    dfa.addTransition('D1', 'r', 'D2');
    dfa.addTransition('D2', 'i', 'D3');
    dfa.addTransition('D3', 'n', 'D4');
    dfa.addTransition('D4', 'g', 'Keyword');

    // bool
    dfa.addTransition('A', 'b', 'E');
    dfa.addTransition('E', 'o', 'E1');
    dfa.addTransition('E1', 'o', 'E2');
    dfa.addTransition('E2', 'l', 'Keyword');

    // while
    dfa.addTransition('A', 'w', 'F');
    dfa.addTransition('F', 'h', 'F1');
    dfa.addTransition('F1', 'i', 'F2');
    dfa.addTransition('F2', 'l', 'F3');
    dfa.addTransition('F3', 'e', 'Keyword');

    // else
    dfa.addTransition('A', 'e', 'G');
    dfa.addTransition('G', 'l', 'G1');
    dfa.addTransition('G1', 's', 'G2');
    dfa.addTransition('G2', 'e', 'Keyword');

    // true
    dfa.addTransition('A', 't', 'H');
    dfa.addTransition('H', 'r', 'H1');
    dfa.addTransition('H1', 'u', 'H2');
    dfa.addTransition('H2', 'e', 'Constant');


    // false
    dfa.addTransition('A', 'f', 'I');
    dfa.addTransition('I', 'a', 'I1');
    dfa.addTransition('I1', 'l', 'I2');
    dfa.addTransition('I2', 's', 'I3');
    dfa.addTransition('I3', 'e', 'Constant');

    // literal
    dfa.addTransition('A', '"', 'J');
    dfa.addTransition('J', '"', 'Constant');

    // ==
    dfa.addTransition('A', '=', 'K');
    dfa.addTransition('K', '=', 'Operator');

    // or
    dfa.addTransition('A', 'o', 'M');
    dfa.addTransition('M', 'r', 'Operator');

    // and
    dfa.addTransition('A', 'a', 'N');
    dfa.addTransition('N', 'n', 'N1');
    dfa.addTransition('N1', 'd', 'Operator');

    // not
    dfa.addTransition('A', 'n', 'O');
    dfa.addTransition('O', 'o', 'O1');
    dfa.addTransition('O1', 't', 'Operator');




    return dfa;
}


// activate a DFA
export function activate(input) {

    // console.time('myCode');
    const dfa = setup_DFA();
    dfa.processInput(input);
    dfa.tokens.push(["Punctuation","#"]);
    //
    // Analyze(dfa.tokens);
    // generate(dfa.tokens);
    // console.timeEnd('myCode');

    return [dfa.tokens,dfa.Debug];
}

