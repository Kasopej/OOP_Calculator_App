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
calculator.states.backSpacePressed = false;
calculator.states.enterPressed = false;
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
    this.operations.processOperands(this.currentInput);
    //this.operations.displayResult(this.result);
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
        if (this.paranthesis.includes(operatorEvent.currentTarget.textContent)) {
            this.currentInput += operatorEvent.currentTarget.textContent;
        }
        else {
            this.currentInput = this.currentInput.slice(0, this.currentInput.length - 1);
            console.log(this.currentInput);
            this.currentInput += operatorEvent.currentTarget.textContent;
        }
    }
    this.operations.displayInput(this.currentInput);
    this.states.decimalActive = false;
    this.operations.processOperands(this.currentInput);
    //this.operations.displayResult(this.result);
} // End of add operators method

calculator.operations.processOperands = function(operand) {
    console.log('Counting brackets in current input: ' + operand);
    let rightParanthesis, leftParanthesis
    rightParanthesis = leftParanthesis = 0;
    calculator.formattedOperand = operand;
    console.log(`Initially, formatted operand: ${calculator.formattedOperand}`);
    for (let index = 0; index<calculator.formattedOperand.length; index++) {
        !(calculator.paranthesis.includes(calculator.formattedOperand[index])) ? 0 : calculator.formattedOperand[index] == '(' ? leftParanthesis++ : rightParanthesis++;

        if ((!isNaN(calculator.formattedOperand[index -1]) || calculator.formattedOperand[index -1] == ')') && !(index === 0) && calculator.formattedOperand[index] == '(' && (calculator.formattedOperand[index] - 1) != 'x') {
            console.log('Before opening bracket is a number: ' + calculator.formattedOperand[index -1]);
            console.log(calculator.formattedOperand[index]);
            calculator.formattedOperand = calculator.formattedOperand.slice(0,index) + 'x(' + calculator.formattedOperand.slice(index + 1);
            index++
        }
        else if (!isNaN(calculator.formattedOperand[index + 1]) && !(index === 0) && calculator.formattedOperand[index] == ')' && (calculator.formattedOperand[index] + 1) != 'x') {
            console.log('After closing bracket is a number');
            calculator.formattedOperand = calculator.formattedOperand.slice(0,index) + ')x' + calculator.formattedOperand.slice(index + 1);
            index++;
        }
    };
    calculator.formattedOperand = (leftParanthesis > rightParanthesis) ? calculator.formattedOperand + ')' : (leftParanthesis < rightParanthesis) ? '(' + calculator.formattedOperand : calculator.formattedOperand;
    console.log('formatted operand: ' + calculator.formattedOperand);


    let operators = [];
    let operators_id = []; //operators_id array is to track indexes of operators inside operand argument(userNum)
    for (let j = 0; j < calculator.formattedOperand.length; j++) {
        if (calculator.basicOperators.includes(calculator.formattedOperand[j])) { // Test to check for operators
            operators.push(calculator.formattedOperand[j]); //Capture operator found in current iteration
            operators_id.push(j); // Capture index of operator found in current operation
        }   
    }
    console.log(operators);

    if (!calculator.states.backSpacePressed && operators.length >= 1) { //To run only if backSpacePressed is off AND there is at least one operator found from above for loop

        let rightOperand = calculator.formattedOperand.slice(operators_id[operators_id.length-1] + 1); //Slice off the portion of operand from AFTER the last operator (reason for +1). This will be used to perform operations
        let strip = calculator.formattedOperand.slice((operators_id[operators_id.length-1] + 1), (calculator.formattedOperand.length-1)); 
        //Strip out the portion BETWEEN the last operator & the last character in operand. 
        //Strip will only contain numbers when there are more than 2 digigts after last operator
        console.log('r_operand, strip: '+ `${rightOperand}, ${strip}`);
        let reverseResult = calculator.operations.calculateReverse(calculator.result, strip, operators[operators.length-1]);
        console.log(`Reverse result: ${reverseResult}`);
        //Reverse operation carried out on the number(s) found in strip. If strip is empty function will choose to do nothing i.e result will be unchanged
        calculator.operations.calculate(reverseResult, rightOperand, operators[operators.length-1]);
        console.log('new result with operators: ' + calculator.result);
    } 

    else if (operators.length == 0) {
        calculator.result = +calculator.formattedOperand;
        console.log('new result, no operators: ' + calculator.result);
    } 


};

calculator.operations.calculate = function(res, r_operand, oprtr){
    if (r_operand == ''  || !calculator.states.enterPressed && calculator.currentInput[calculator.currentInput.length - 1] == '(' || r_operand[0] == ')') {
        //If operand is empty, or cannpt be computed, do nothing
        console.log('do nothing operation');
    }
    else if (r_operand != '') {//If characters after last operator, the right operation is picked by the Switch
        //alert('Multiple right operand: ' + r_operand); for test
        switch (oprtr) {
            case 'x':
                calculator.result = +res * +r_operand;
                return;
            case '\u00F7':
                calculator.result = +res / +r_operand;
                return;
            case '+':
                calculator.result = +res + +r_operand;
                return;
            case '-':
                calculator.result = +res - +r_operand;
                return;
            case '^':
                calculator.result = res ** +r_operand;
                return;
            case '\u221A':
                calculator.result = res ** (0.5);
                return;
            default:
                break;
        }
    }
}

calculator.operations.calculateReverse = function(res, r_operand, oprtr){
    if (r_operand == ''  || !calculator.states.enterPressed && calculator.currentInput[calculator.currentInput.length - 1] == '(' || r_operand[0] == ')') {
        // If "strip" is empty or cannot be computed, return same result that was passed
        console.log('do nothing operation');
        return calculator.result;
    }
    else if (r_operand != '') { // If "strip" contains characters, the right reverse operation is picked by Switch
        //alert('Available right operand reverse: ' + r_operand); for test
        if (isNaN(r_operand)) {//'strip' can contain an operator at the end if it is from old_operand from backSpaceCalc. This IF block chops off such operators before operation commences
            r_operand = r_operand.slice(0, (r_operand.length - 1));
        }
        switch (oprtr) {
            case 'x':
                calculator.result = +res / +r_operand;
                return calculator.result;
            case '\u00F7':
                calculator.result = +res * +r_operand;
                return calculator.result;
            case '+':
                calculator.result = +res - +r_operand;
                return calculator.result;
            case '-':
                calculator.result = +res + +r_operand;
                return calculator.result;
            case '^':
                calculator.result = res ** (1/+r_operand);
                return calculator.result;
            case '\u221A':
                calculator.result = res ** (2);
                return calculator.result;
            default:
                break;
        }
    }
}

calculator.addEventListeners();
calculator.operations.displayInput(calculator.currentInput);


