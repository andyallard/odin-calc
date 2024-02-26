

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

function setupQuerySelectors() {
    let numbers = document.querySelectorAll('.button');
    
    numbers.forEach((button) => {
        button.addEventListener('click', handleButtonPress);
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
    classes = Array.from(event.target.classList);
    keystroke = event.target.textContent;
    console.log(classes);

    console.log(`Before "${keystroke}" button pressed. A = ${A} B = ${B} Oper = ${OPERATOR} `);

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

    console.log(`After "${keystroke}" button pressed. A = ${A} B = ${B} Oper = ${OPERATOR} `);


}, 100);

function handleNumberPress(keystroke) {
    // can't have multiple decimal places
    if (keystroke == '.' && DISPLAY.textContent.includes('.')) { return; }
    
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
        DISPLAY.textContent = 0;
    } else {
        A = operate(A, B, OPERATOR);
        B = null
        OPERATOR = keystroke;
        DISPLAY.textContent = A;
    }
}

function clearScreen() {
    DISPLAY.textContent = '0';
    A = B = OPERATOR = null;
    ENTERING_FIRST_VALUE = true;
}

function handleEqualsPress() {
    if (!ENTERING_FIRST_VALUE) {
        A = operate(A, B, OPERATOR);
        B = null
        OPERATOR = null;
        DISPLAY.textContent = A;
        ENTERING_FIRST_VALUE = true;
    }
}

function handleSignChange() {
    DISPLAY.textContent = parseFloat(DISPLAY.textContent) * -1;
    
    if (ENTERING_FIRST_VALUE) {
        A = DISPLAY.textContent;
    } else {
        B = DISPLAY.textContent;
    }
}

let A = B = OPERATOR = null;
let ENTERING_FIRST_VALUE = true;

let DISPLAY = document.querySelector('.display');
DISPLAY.textContent = 0;

setupQuerySelectors();

