// Create calculator object entity
let calculator = {};
calculator.numberButtons = Array.from(document.getElementsByClassName('calcNumber'));
calculator.operatorButtons = Array.from(document.getElementsByClassName('operator'));
calculator.currentInput = '0';
calculator.result = 0;
calculator.formattedOperand = '';
calculator.formattedOldOperand = '';
calculator.operations = {};
calculator.basicOperators = ['+', '-', '^', 'x', '\u00F7', '\u221A'];
calculator.paranthesis = ['(', ')'];
calculator.controls = {
    enterButton : document.getElementById('calcEnterBtn'), 
    clearButton : document.getElementById('calcClearBtn'), 
    backSpaceButton : document.getElementById('calcBackSpaceBtn'),
};
calculator.display = { 
    inputScreen : document.getElementById('displayInput'), 
    resultScreen : document.getElementById('displayAnswer'),
};
calculator.states = {
    decimalActive : false,
    backSpacePressed : false,
    enterPressed : false,
};
console.log(JSON.stringify(calculator));

//Add method that adds appropriate event listeners to each button
calculator.addEventListeners = function(){
    this.numberButtons.forEach(function (numberBtn, index){
        numberBtn.addEventListener('click', calculator.operations.addNumber.bind(calculator));
    });
    this.operatorButtons.forEach(function(operatorBtn, index){
        operatorBtn.addEventListener('click', calculator.operations.addOperator.bind(calculator));
    });
    this.controls.backSpaceButton.addEventListener('click', calculator.operations.backSpace.bind(calculator));
    this.controls.clearButton.addEventListener('click', calculator.operations.clear.bind(calculator));
    this.controls.enterButton.addEventListener('click', calculator.operations.enter.bind(calculator))
};


calculator.operations.displayInput = function(showNum){
    calculator.display.inputScreen.textContent = showNum;
}
calculator.operations.displayResult = function(showRes){
    calculator.display.resultScreen.textContent = showRes;
}

calculator.operations.addNumber = function (btnEvent){

    if ((this.currentInput == 0 || this.currentInput === this.result)) {
        console.log('Current input is either zero or a finished operation. Current input as at Number button press: ' + this.currentInput);
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
        this.currentInput += btnEvent.currentTarget.textContent;
        this.operations.displayInput(this.currentInput);
        btnEvent.currentTarget.textContent === '.' ? this.states.decimalActive = true : 0;
    }
    this.operations.processOperands(this.currentInput);
    //this.operations.displayResult(this.result);
} //End of addNumbers method



calculator.operations.addOperator = function(operatorEvent) {
    if (this.paranthesis.includes(operatorEvent.currentTarget.textContent) && (this.currentInput == 0 || this.currentInput === this.result)) {
        console.log('Bracket to replace content');
        this.currentInput = operatorEvent.currentTarget.textContent;
    }

    else if (!(this.basicOperators.includes(this.currentInput[this.currentInput.length -1]))) {
        console.log('Current input has no replacable operand at end. Current input as at number press: ' + this.currentInput);
        this.currentInput += operatorEvent.currentTarget.textContent;
    } 
    else if (this.basicOperators.includes(this.currentInput[this.currentInput.length -1])) {
        //console.log('Current input has replacable operand at end. Current input as at number press: ' + this.currentInput);
        if (this.paranthesis.includes(operatorEvent.currentTarget.textContent)) {
            this.currentInput += operatorEvent.currentTarget.textContent;
        }
        else {
            this.currentInput = this.currentInput.slice(0, this.currentInput.length - 1);
            this.currentInput += operatorEvent.currentTarget.textContent;
        }
    }
    this.operations.displayInput(this.currentInput);
    this.states.decimalActive = false;
    this.operations.processOperands(this.currentInput);
    //this.operations.displayResult(this.result);
} // End of add operators method

calculator.operations.processOperands = function(operand, old_operand) {

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

    let paranthesisDifference = ((leftParanthesis - rightParanthesis) > 0 ) ? leftParanthesis - rightParanthesis : rightParanthesis - leftParanthesis;
    if (!calculator.states.enterPressed) {
        for (let i = 0; i < paranthesisDifference; i++) {
            calculator.formattedOperand = (leftParanthesis > rightParanthesis) ? calculator.formattedOperand + ')' : (leftParanthesis < rightParanthesis) ? '(' + calculator.formattedOperand : calculator.formattedOperand;
        }
    }
    
    


    let operators = [];
    let operators_id = [];
    for (let j = 0; j < calculator.formattedOperand.length; j++) {
        if (calculator.basicOperators.includes(calculator.formattedOperand[j])) { // Test to check for operators
            operators.push(calculator.formattedOperand[j]); //Capture operator found in current iteration
            operators_id.push(j); // Capture index of operator found in current operation
        }   
    }
    console.log(operators);

    let strip, rightOperand;
    if (!calculator.states.enterPressed) {
        if (!calculator.states.backSpacePressed && operators.length >= 1) { 

            if (!paranthesisDifference) {
                rightOperand = calculator.formattedOperand.slice(operators_id[operators_id.length-1] + 1); 
                strip = calculator.formattedOperand.slice((operators_id[operators_id.length-1] + 1), (calculator.formattedOperand.length-1)); 
                let rightOperand_rightparantheses, rightOperand_leftparantheses;
                rightOperand_rightparantheses = rightOperand_leftparantheses = 0;
                for (let k = 0; k<rightOperand.length; k++) {
                    !(calculator.paranthesis.includes(rightOperand[k])) ? 0 : rightOperand[k] == '(' ? rightOperand_leftparantheses++ : rightOperand_rightparantheses++;
                }
                if (rightOperand_rightparantheses) {
                    strip = strip.slice(rightOperand_leftparantheses, rightOperand.length - (rightOperand_rightparantheses))
                    rightOperand = rightOperand.slice(rightOperand_leftparantheses, rightOperand.length - (rightOperand_rightparantheses));
                    //Strip out the portion BETWEEN the last operator & the last character in operand. 
                    //Strip will only contain numbers when there are more than 2 digits after last operator
                }
                
            }
            else { //If bracket ends formatted operand
                rightOperand = calculator.formattedOperand.slice(operators_id[operators_id.length-1] + 1); //Slice off the portion of operand from AFTER the last operator (reason for +1). This will be used to perform operations
                strip = calculator.formattedOperand.slice((operators_id[operators_id.length-1] + 1), (calculator.formattedOperand.length-2)); 
                let rightOperand_rightparantheses, rightOperand_leftparantheses;
                rightOperand_rightparantheses = rightOperand_leftparantheses = 0;
                for (let k = 0; k<rightOperand.length; k++) {
                    !(calculator.paranthesis.includes(rightOperand[k])) ? 0 : rightOperand[k] == '(' ? rightOperand_leftparantheses++ : rightOperand_rightparantheses++;
                }
                strip = strip.slice(rightOperand_leftparantheses, rightOperand.length - (rightOperand_rightparantheses))
                rightOperand = rightOperand.slice(rightOperand_leftparantheses, rightOperand.length - (rightOperand_rightparantheses))
                
                
            }
            
            console.log('r_operand, strip: '+ `${rightOperand}, ${strip}`);
            let reverseResult = calculator.operations.calculateReverse(calculator.result, strip, operators[operators.length-1]);
            console.log(`Reverse result: ${reverseResult}`);
            //Reverse operation carried out on the number(s) found in strip. If strip is empty function will choose to do nothing i.e result will be unchanged
            calculator.operations.calculate(reverseResult, rightOperand, operators[operators.length-1]);
        } 
    
        else if (calculator.states.backSpacePressed && operators.length >= 1) {
            if (!paranthesisDifference) {
                rightOperand = calculator.formattedOperand.slice(operators_id[operators_id.length-1] + 1); //Slice off the portion of operand from AFTER the last operator (reason for +1). This will be used to perform operations
                strip = old_operand.slice((operators_id[operators_id.length-1] + 1)); 
                let rightOperand_rightparantheses, rightOperand_leftparantheses;
                rightOperand_rightparantheses = rightOperand_leftparantheses = 0;
                for (let k = 0; k<strip.length; k++) {
                    !(calculator.paranthesis.includes(strip[k])) ? 0 : strip[k] == '(' ? rightOperand_leftparantheses++ : rightOperand_rightparantheses++;
                }
                console.log(`l:r = ${rightOperand_leftparantheses} : ${rightOperand_rightparantheses}`);
                if (rightOperand_rightparantheses) {
                    strip = strip.slice(rightOperand_leftparantheses, rightOperand.length - (rightOperand_rightparantheses));
                    rightOperand = rightOperand.slice(rightOperand_leftparantheses, rightOperand.length - (rightOperand_rightparantheses));
                    //Strip out the portion BETWEEN the last operator & the last character in operand. 
                    //Strip will only contain numbers when there are more than 2 digits after last operator
                }
                
            }
            else { 
                rightOperand = calculator.formattedOperand.slice(operators_id[operators_id.length-1] + 1); 
                strip = old_operand.slice((operators_id[operators_id.length-1] + 1)); 
                let rightOperand_rightparantheses, rightOperand_leftparantheses;
                rightOperand_rightparantheses = rightOperand_leftparantheses = 0;
                for (let k = 0; k<strip.length; k++) {
                    !(calculator.paranthesis.includes(strip[k])) ? 0 : strip[k] == '(' ? rightOperand_leftparantheses++ : rightOperand_rightparantheses++;
                }
                if (rightOperand_rightparantheses) {
                    strip = strip.slice(rightOperand_leftparantheses, rightOperand.length - (rightOperand_rightparantheses));
                    rightOperand = rightOperand.slice(rightOperand_leftparantheses, rightOperand.length - (rightOperand_rightparantheses));
                }
                
            }
        
            console.log('r_operand, strip: '+ `${rightOperand}, ${strip}`);
            let reverseResult = calculator.operations.calculateReverse(calculator.result, strip, operators[operators.length-1]);
            console.log(`Reverse result: ${reverseResult}`);
            //Reverse operation carried out on the number(s) found in strip. If strip is empty function will choose to do nothing i.e result will be unchanged
            calculator.operations.calculate(reverseResult, rightOperand, operators[operators.length-1]);
            calculator.states.backSpacePressed = false;
            calculator.states.decimalActive = rightOperand.includes('.') ? true : false;
            calculator.states.enterPressed = false;
        }
    
        else if (operators.length == 0) {
            calculator.result = +calculator.formattedOperand;
            console.log('new result, no operators: ' + calculator.result);
            calculator.states.backSpacePressed = false;
            calculator.states.decimalActive = calculator.formattedOperand.includes('.') ? true : false;
            calculator.states.enterPressed = false;
        } 
    }
    else {
        if (!calculator.states.backSpacePressed && operators.length >= 1) { //To run only if backSpacePressed is off AND there is at least one operator found from above for loop

            if (calculator.currentInput == calculator.formattedOperand) {
                rightOperand = calculator.formattedOperand.slice(operators_id[operators_id.length-1] + 1);
                strip = calculator.formattedOperand.slice((operators_id[operators_id.length-1] + 1)); 
                let rightOperand_rightparantheses, rightOperand_leftparantheses;
                rightOperand_rightparantheses = rightOperand_leftparantheses = 0;
                for (let k = 0; k<rightOperand.length; k++) {
                    !(calculator.paranthesis.includes(rightOperand[k])) ? 0 : rightOperand[k] == '(' ? rightOperand_leftparantheses++ : rightOperand_rightparantheses++;
                }
                console.log(`l:r = ${rightOperand_leftparantheses} : ${rightOperand_rightparantheses}`);
                if (rightOperand_rightparantheses) {
                    strip = strip.slice(rightOperand_leftparantheses, rightOperand.length - (rightOperand_rightparantheses))
                    rightOperand = rightOperand.slice(rightOperand_leftparantheses, rightOperand.length - (rightOperand_rightparantheses));
                    //Strip out the portion BETWEEN the last operator & the last character in operand. 
                    //Strip will only contain numbers when there are more than 2 digits after last operator
                }
                
            }
            else {
                rightOperand = calculator.formattedOperand.slice(operators_id[operators_id.length-1] + 1);
                strip = calculator.formattedOperand.slice((operators_id[operators_id.length-1] + 1)); 
                let rightOperand_rightparantheses, rightOperand_leftparantheses;
                rightOperand_rightparantheses = rightOperand_leftparantheses = 0;
                for (let k = 0; k<rightOperand.length; k++) {
                    !(calculator.paranthesis.includes(rightOperand[k])) ? 0 : rightOperand[k] == '(' ? rightOperand_leftparantheses++ : rightOperand_rightparantheses++;
                }
                strip = strip.slice(rightOperand_leftparantheses, rightOperand.length - (rightOperand_rightparantheses))
                rightOperand = rightOperand.slice(rightOperand_leftparantheses, rightOperand.length - (rightOperand_rightparantheses))
                
                
            }
            
            console.log('r_operand, strip: '+ `${rightOperand}, ${strip}`);
            let reverseResult = calculator.operations.calculateReverse(calculator.result, strip, operators[operators.length-1]);
            console.log(`Reverse result: ${reverseResult}`);
            calculator.operations.calculate(reverseResult, rightOperand, operators[operators.length-1]);
        } 
    
        else if (operators.length == 0) {
            calculator.result = +calculator.formattedOperand;
            console.log('new result, no operators: ' + calculator.result);
            calculator.states.backSpacePressed = false;
            calculator.states.decimalActive = calculator.formattedOperand.includes('.') ? true : false;
            calculator.states.enterPressed = false;
        } 
    }
    calculator.result = isNaN(calculator.result) ? 'Error!' : calculator.result;
    calculator.operations.displayResult(calculator.result);
};

calculator.operations.calculate = function(res, r_operand, oprtr){
    if (r_operand == ''  || !calculator.states.enterPressed && calculator.currentInput[calculator.currentInput.length - 1] == '(' || r_operand[0] == ')') {
        //If operand is empty, or cannpt be computed, do nothing
        console.log('do nothing operation');
    }
    else if (r_operand != '' || (calculator.states.enterPressed && (r_operand == '' || calculator.currentInput[calculator.currentInput.length - 1] == '(' || r_operand[0] == ')'))) {//If characters after last operator, the right operation is picked by the Switch
        console.log('do something operation');
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
                calculator.result = res * ((+r_operand)**0.5);
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
        if (isNaN(r_operand)) {
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
                calculator.result = res / ((+r_operand)**0.5);
                return calculator.result;
            default:
                break;
        }
    }
}

calculator.operations.backSpace = function(){
    calculator.states.backSpacePressed = true;
    let old_entry = calculator.formattedOperand;
    calculator.currentInput = calculator.currentInput.slice(0, (calculator.currentInput.length - 1)); // Last character (operator or number) is chopped off here

    if (calculator.currentInput == 0) {
        calculator.currentInput = '0';
        calculator.operations.displayInput(calculator.currentInput);
        calculator.result = 0;
        calculator.operations.displayResult(calculator.result);
    }

    else {
        calculator.operations.displayInput(calculator.currentInput);
        calculator.operations.processOperands(calculator.currentInput, old_entry);
        calculator.operations.displayResult(calculator.result);
    }   
}

calculator.operations.clear = function(){
    calculator.states.decimalActive = false;
    calculator.currentInput = '0';
    calculator.result = 0;
    calculator.operations.displayInput(calculator.currentInput);
    calculator.operations.displayResult(calculator.result);
};

calculator.operations.enter = function(){
    console.log('Enter button pressed');
    calculator.states.enterPressed = true;
    calculator.operations.processOperands(calculator.currentInput);
    calculator.currentInput = calculator.result;
    calculator.states.decimalActive = false;
}

calculator.addEventListeners();
calculator.operations.displayInput(calculator.currentInput);


