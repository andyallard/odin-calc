

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
    if (b == 0) {
        ERROR = 'ERR: DIV BY 0';
    }
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
    })

    document.addEventListener('keydown', handleButtonPress);
}

function setMaxDigits(num, maxDigits) {
    // remove decimal, convert to string to see length, and use it to decide how much to round to keep the number within maxDigits
    num = parseFloat(num);
    numPart = Math.floor(num);
    decimalPart = num - numPart;

    round = maxDigits - String(numPart).length;
    
    // if number is too big, round it
    if (round < String(decimalPart).length) {
        num = Math.round(num * (10 ** round)) / (10 ** round);
    }
    return num;

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

function pretreatKeystroke(type, keystroke) {
    // keystroke = keystroke.toLowerCase();
    if (type == 'keydown') {
        switch (keystroke) {
            case 'Enter':
                keystroke = '=';
                break;
            case 'Escape':
                keystroke = 'AC';
                break;
            case '^':
                keystroke = 'EXP';
                break;
        }
    }
    if (!(keystroke in VALID_KEYSTROKES)) {
        keystroke = null;
    }
    return keystroke;
}


// const handleClick = debounce(function() {
// // Your click event handling code

const handleButtonPress = debounce(function(event) {
    // console.log(event.type); 
    
    event.preventDefault();

    if (event.type == 'click') {
        keystroke = event.target.textContent;
    } else if (event.type == 'keydown') {
        if (event.key == '/') {
            // console.log('/');
            event.preventDefault();
        }
        console.log(event.key);
        keystroke = event.key;
    }

    // console.log(`Before pretreatment: keystroke = ${keystroke}`)
    keystroke = pretreatKeystroke(event.type, keystroke);
    // console.log(`After pretreatment: keystroke = ${keystroke}`)

    // if the keystroke was invalid, cancel.
    if (!keystroke) { return; }

    // classes = Array.from(event.target.classList);
    let type = VALID_KEYSTROKES[keystroke];

    
    // If there's been an error, do nothing  until user resets
    if (ERROR && type != 'clear') { return; }
    
    console.log(`Before "${keystroke}" button pressed. A = ${A} B = ${B} Oper = ${OPERATOR}, ENTERING_FIRST? ${ENTERING_FIRST_VALUE}`);

    switch (type) {
        case 'number':
            handleNumberPress(keystroke);
            break;
        case 'operator':
            handleOperatorPress(keystroke);
            break;
        case 'clear':
            clearScreen();
            break;
        case 'equals':
            handleEqualsPress();
            break;
        case 'sign-change':
            handleSignChange();
            break;
    }

    // if result gets bigger than 12 digits, show overflow error
    if (A > 999999999999) {
        ERROR = 'ERR: OVERFLOW';
    }

    A = setMaxDigits(A, 12);

    console.log(`After "${keystroke}" button pressed. A = ${A} B = ${B} Oper = ${OPERATOR}, ENTERING_FIRST? ${ENTERING_FIRST_VALUE}`);

    // update auxiliary display
    if (ENTERING_FIRST_VALUE) {
        AUX.textContent = ``
    } else {
        AUX.textContent = `${A} ${OPERATOR}`
    }

    if (ERROR) {
        AUX.textContent = 'PLEASE RESET';
        DISPLAY.textContent = ERROR;
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
        if (!A) {
            A = 0;
        }
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
    ERROR = '';
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
let ERROR = '';
let ENTERING_FIRST_VALUE = true;
// const VALID_KEYSTROKES = new Set([
//     '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
//     '/', '*', '+', '-', 'EXP', '=',
//     'AC', '+/-', '.',
// ])
const VALID_KEYSTROKES = {
    '0': 'number',
    '1': 'number',
    '2': 'number',
    '3': 'number',
    '4': 'number',
    '5': 'number',
    '6': 'number',
    '7': 'number',
    '8': 'number',
    '9': 'number',
    '/': 'operator',
    '*': 'operator',
    '+': 'operator',
    '-': 'operator',
    'EXP': 'operator',
    '=': 'equals',
    'AC': 'clear',
    '+/-': 'sign-change',
    '.': 'number',
  };

let DISPLAY = document.querySelector('.display.main');
let AUX = document.querySelector('.display.aux');

DISPLAY.textContent = 0;
AUX.textContent = '';

setup();

