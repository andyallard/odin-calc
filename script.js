

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

function handleButtonPress(event) {
    classes = Array.from(event.target.classList);
    console.log(classes);

    switch (true) {
        case classes.includes('number'):

            break;
        case classes.includes('operator'):

            break;
    }

    keystroke = event.target.textContent;
    console.log(`${keystroke} button pressed`);

}

let a = b = operator = null;

let display = document.querySelector('.display');
display.textContent = 0;

setupQuerySelectors();

