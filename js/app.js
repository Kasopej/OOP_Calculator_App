// Create calculator object entity
let calculator = {};
calculator.numberButtons = Array.from(document.getElementsByClassName('calcNumber'));
calculator.controls = {};
calculator.controls.enterButton = document.getElementById('calcEnterBtn');
calculator.controls.clearButton = document.getElementById('calcClearBtn');
calculator.controls.backSpaceButton = document.getElementById('calcBackSpaceBtn');
calculator.operatorButtons = Array.from(document.getElementsByClassName('operator'));
calculator.display = {};
calculator.display.inputScreen = document.getElementById('displayInput');
calculator.display.resultScreen = document.getElementById('displayAnswer');
calculator.currentInput = '0';
calculator.result = 0;
calculator.formattedOperand = '';
calculator.operations = {};
calculator.basicOperators = ['+', '-', '^', 'x', '\u00F7', '\u221A'];
calculator.paranthesis = ['(', ')'];
calculator.states = {};
calculator.states.decimalActive = false;
console.log(JSON.stringify(calculator));

//Add method that adds appropriate event listeners to each button
calculator.addEventListeners = function(){
    this.numberButtons.forEach(function (numberBtn, index){
        console.log('Adding num button event listeners' + index);
        numberBtn.addEventListener('click', calculator.operations.addNumber.bind(calculator));
    });
    this.operatorButtons.forEach(function(operatorBtn, index){
        console.log('Adding operator button event listeners' + index);
        operatorBtn.addEventListener('click', calculator.operations.addOperator.bind(calculator));
    });
};


calculator.operations.displayInput = function(showNum){
    calculator.display.inputScreen.textContent = showNum;
}
calculator.operations.displayResult = function(showRes){
    calculator.display.resultScreen.textContent = showRes;
}

calculator.operations.addNumber = function (btnEvent){

    if ((this.currentInput == 0 || this.currentInput === this.result)) {
        console.log('Current input is either zero or a finished operationCurrent input as at Number button press: ' + this.currentInput);
        console.log(this);
        if (!isNaN(btnEvent.currentTarget.textContent)) {
            this.states.decimalActive ? this.currentInput += btnEvent.currentTarget.textContent : this.currentInput = btnEvent.currentTarget.textContent;
            this.operations.displayInput(this.currentInput);
        }
        else {
            this.currentInput = '0' + btnEvent.currentTarget.textContent;
            this.operations.displayInput(this.currentInput);
            this.states.decimalActive = true;
        }
        
    }


    else if(!isNaN(btnEvent.currentTarget.textContent) || btnEvent.currentTarget.textContent === '.' && !this.states.decimalActive){
        console.log('Current is neither zero nor a finished calculation. Current input as at Number button press: ' + this.currentInput);
        console.log(this);
        this.currentInput += btnEvent.currentTarget.textContent;
        this.operations.displayInput(this.currentInput);
        btnEvent.currentTarget.textContent === '.' ? this.states.decimalActive = true : 0;
    }
} //End of addNumbers method



calculator.operations.addOperator = function(operatorEvent) {
    console.log('Operator pressed');
    if (this.paranthesis.includes(operatorEvent.currentTarget.textContent) && (this.currentInput == 0 || this.currentInput === this.result)) {
        console.log('Bracket to replace content');
        this.currentInput = operatorEvent.currentTarget.textContent;
    }

    else if (!(this.basicOperators.includes(this.currentInput[this.currentInput.length -1]))) {
        console.log('Current input has no replacable operand at end. Current input as at number press: ' + this.currentInput);
        this.currentInput += operatorEvent.currentTarget.textContent;
    } 
    else if (this.basicOperators.includes(this.currentInput[this.currentInput.length -1])) {
        console.log('Current input has replacable operand at end. Current input as at number press: ' + this.currentInput);
        this.currentInput = this.currentInput.slice(0, this.currentInput.length - 1);
        console.log(this.currentInput);
        this.currentInput += operatorEvent.currentTarget.textContent;
    }
    this.operations.displayInput(this.currentInput);
    this.states.decimalActive = false;
    this.operations.processOperands(this.currentInput);
    this.operations.displayResult(this.result);
} // End of add operators method

calculator.operations.processOperands = function(operand) {
    console.log('Counting brackets in current input: ' + operand);
    let rightParanthesis, leftParanthesis
    rightParanthesis = leftParanthesis = 0;
    calculator.formattedOperand = operand;
    for (let index = 0; index<calculator.formattedOperand.length; index++) {
        !(calculator.paranthesis.includes(calculator.formattedOperand[index])) ? 0 : calculator.formattedOperand[index] == '(' ? leftParanthesis++ : rightParanthesis++;

        if (isNaN(calculator.formattedOperand[index] - 1) && !(index === 0) && calculator.formattedOperand[index] == '(' && (calculator.formattedOperand[index] - 1) != '*') {
            console.log('Before opening bracket is a number');
            console.log(calculator.formattedOperand[index]);
            calculator.formattedOperand = calculator.formattedOperand.slice(0,index) + '*(' + calculator.formattedOperand.slice(index + 1);
            index++
        }
        else if (isNaN(calculator.formattedOperand[index] + 1) && !(index === 0) && calculator.formattedOperand[index] == ')' && (calculator.formattedOperand[index] + 1) != '*') {
            console.log('After closing bracket is a number');
            calculator.formattedOperand = calculator.formattedOperand.slice(0,index) + ')*' + calculator.formattedOperand.slice(index + 1);
            index++;
        }
    };
    console.log('formatted operand: ' + calculator.formattedOperand);
    console.log(`${leftParanthesis} , ${rightParanthesis}`);
    calculator.formattedOperand = (leftParanthesis > rightParanthesis) ? calculator.formattedOperand + ')' : (leftParanthesis < rightParanthesis) ? '(' + calculator.formattedOperand : calculator.formattedOperand;
    console.log(calculator.formattedOperand);
    //calculator.operations.displayInput(calculator.currentInput);

    
    /*
    let operators = [];
    let operators_id = []; //operators_id array is to track indexes of operators inside operand argument(userNum)
    for (let j = 0; j < calculator.formattedOperand.length; j++) {
        if (calculator.basicOperators.includes(calculator.formattedOperand[j])) { // Test to check for non-numbers (symbols)
            operators.push(operand[j]); //Capture operator found in current iteration
            operators_id.push(j); // Capture index of operator found in current operation
        }   
    }

    if (operators.length >= 1) { //To run only if backSpacePressed is off AND there is at least one operator found from above for loop
        let rightOperand = calculator.formattedOperand.slice(operators_id[operators_id.length-1] + 1); //Slice off the portion of operand(userNum) from AFTER the last operator (reason for +1). This will be used to perform operations
        let strip = calculator.formattedOperand.slice((operators_id[operators_id.length-1] + 1), (calculator.formattedOperand.length-1)); 
        /*Strip out the portion BETWEEN the last operator & the last character in operand. 
        Strip will only contain numbers when extra numbers are pressed after an operator */
        /*
        let reverseResult = switchOperatorsReverse(calculator.result, strip, operators[operators.length-1]); //Reverse operation carried out on the number(s) found strip. If strip is empty function code will choose to do nothing i.e result will be unchanged
        switchOperators(reverseResult, rightOperand, operators[operators.length-1]);
    }

    else if (operators.length == 0) { //To run if no operators are found from the for loop. Can only happen if backSpace chopped of an operator
        calculator.result = operand; //Updates result with the current userNum since there is no operation. Gives a string!
    } */
};





/*
calculator.operations.processOperands = function(operand) {
    console.log('Counting brackets in current input: ' + calculator.currentInput);
    let rightParanthesis, leftParanthesis
    rightParanthesis = leftParanthesis = 0;
    calculator.formattedOperand = operand;
    for (let a_char of operand) {
        !(calculator.paranthesis.includes(a_char)) ? 0 : a_char == '(' ? leftParanthesis++ : rightParanthesis++;

        if (!isNaN(operand[operand.indexOf(a_char)] - 1) && !(operand.indexOf(a_char) === 0) && a_char == '(') {
            console.log('Before opening bracket is a number');
            calculator.formattedOperand = calculator.formattedOperand.slice(0,calculator.formattedOperand.indexOf(a_char)) + '*(' + calculator.formattedOperand.slice(operand.indexOf(a_char) + 1);
        }
        else if (!isNaN(calculator.currentInput[calculator.currentInput.indexOf(a_char)] + 1) && !(calculator.currentInput.indexOf(a_char) === 0) && a_char == ')') {
            console.log('After closing bracket is a number');
            calculator.formattedOperand = calculator.currentInput.slice(0,calculator.currentInput.indexOf(a_char)) + ')*' + calculator.currentInput.slice(operand.indexOf(a_char) + 1);
        }
    };
    console.log('formatted operand: ' + calculator.formattedOperand);
    console.log(`${leftParanthesis} , ${rightParanthesis}`);
    calculator.formattedOperand = (leftParanthesis > rightParanthesis) ? calculator.formattedOperand + ')' : (leftParanthesis < rightParanthesis) ? '(' + calculator.formattedOperand : calculator.formattedOperand;
    console.log(calculator.formattedOperand);
    //calculator.operations.displayInput(calculator.currentInput);

    let operators = [];
    let operators_id = []; //operators_id array is to track indexes of operators inside operand argument(userNum)
    for (let j = 0; j < operand.length; j++) {
        if (isNaN(operand[j]) && operand[j] !== '.') { // Test to check for non-numbers (symbols)
            operators.push(operand[j]); //Capture operator found in current iteration
            operators_id.push(j); // Capture index of operator found in current operation
        }
        
    }
}; */

