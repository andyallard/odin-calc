

function add(a, b) {
    return a + b;
}
function subtract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a * b;
}
function divide(a, b) {
    return a / b;
}
function exponent(a, b) {
    return a ** b;
}

function operate(a, b, operator) {
    a = parseFloat(a);
    b = parseFloat(b);
    switch (operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
        case 'EXP':
            return exponent(a, b);
    }
}

function setup() {
    let buttons = document.querySelectorAll('.button');
    
    buttons.forEach((button) => {
        button.addEventListener('click', handleButtonPress);
        button.addEventListener('keydown', handleButtonPress);
    })

}

function debounce(func, delay) {
    let timeoutId;
    return function() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, arguments);
      }, delay);
    };
  }
  
// const handleClick = debounce(function() {
// // Your click event handling code
// }, 300); // Set an appropriate delay in milliseconds

const handleButtonPress = debounce(function(event) {

    // if (event.type == 'click') {
    //     keystroke = event.target.textContent;
    //     console.log(classes);
    // } else if (event.type == 'keydown') {
    //     console.log(event.key)
    // }
    keystroke = event.target.textContent;

    classes = Array.from(event.target.classList);
    
    console.log(`Before "${keystroke}" button pressed. A = ${A} B = ${B} Oper = ${OPERATOR}, ENTERING_FIRST? ${ENTERING_FIRST_VALUE}`);

    switch (true) {
        case classes.includes('number'):
            handleNumberPress(keystroke);
            break;
        case classes.includes('operator'):
            handleOperatorPress(keystroke);
            break;
        case classes.includes('clear'):
            clearScreen();
            break;
        case classes.includes('equals'):
            handleEqualsPress();
            break;
        case classes.includes('sign-change'):
            handleSignChange();
            break;
    }

    console.log(`After "${keystroke}" button pressed. A = ${A} B = ${B} Oper = ${OPERATOR}, ENTERING_FIRST? ${ENTERING_FIRST_VALUE}`);

    if (ENTERING_FIRST_VALUE) {
        AUX.textContent = ``
    } else {
        AUX.textContent = `${A} ${OPERATOR}`
    }

}, 10);

function handleNumberPress(keystroke) {
    // can't have multiple decimal places
    if (keystroke == '.' && DISPLAY.textContent.includes('.')) { return; }

    // if first number entered is the decimal point, insert a 0 in front
    if (keystroke === '.' && DISPLAY.textContent == '') {
        DISPLAY.textContent = '0';
    }

    // if doing another operation, we need an operation first
    if (!ENTERING_FIRST_VALUE && !OPERATOR) { return; }
    
    // display only has so much space
    if (DISPLAY.textContent.length >= 12) { return; }

    if (DISPLAY.textContent == '0' && keystroke != '.') {
        DISPLAY.textContent = keystroke;
    } else {
        DISPLAY.textContent += keystroke;
    }

    if (ENTERING_FIRST_VALUE) {
        A = DISPLAY.textContent;
    } else {
        B = DISPLAY.textContent;
    }
}

function handleOperatorPress(keystroke) {
    if (ENTERING_FIRST_VALUE) {
        OPERATOR = keystroke;
        ENTERING_FIRST_VALUE = false;
        DISPLAY.textContent = '';
    } else {
        if (B != '') {A = operate(A, B, OPERATOR);}
        
        B = '';
        OPERATOR = keystroke;
        DISPLAY.textContent = '';
    }
}

function clearScreen() {
    DISPLAY.textContent = '0';
    A = B = OPERATOR = '';
    ENTERING_FIRST_VALUE = true;
}

function handleEqualsPress() {
    if (!ENTERING_FIRST_VALUE && B) {
        A = operate(A, B, OPERATOR);
        B = '';
        OPERATOR = '';
        DISPLAY.textContent = '';
    }
}

function handleSignChange() {
    if (!DISPLAY.textContent) { return; }
    
    DISPLAY.textContent = parseFloat(DISPLAY.textContent) * -1;
    
    if (ENTERING_FIRST_VALUE) {
        A = DISPLAY.textContent;
    } else {
        B = DISPLAY.textContent;
    }
}

let A = B = OPERATOR = '';
let ENTERING_FIRST_VALUE = true;

let DISPLAY = document.querySelector('.display.main');
let AUX = document.querySelector('.display.aux');

DISPLAY.textContent = 0;
AUX.textContent = '';

setup();

