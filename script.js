/*
var operacion = "";
var resultado = "";
const VACIO = "";
console.log('*** Calculadora hecha por: Alvhix ***\n  -> En proceso de mejora');

function pulsarTecla(tecla) {
    if (esVacio()) {
        operacion = tecla;
        if (!acabaOperador()) {
            calcular();
        }
    } else {
        operacion += tecla;
        if (!acabaOperador()) {
            calcular();
        }
    }
    imprimir('pantalla');
}

function acabaOperador() {
    var acaba;
    if (operacion.endsWith('+') || operacion.endsWith('-') || operacion.endsWith('*') || operacion.endsWith('/') || operacion.endsWith('.')) {
        acaba = true;
    } else {
        acaba = false;
    }
    return acaba;
}

function esVacio() {
    var esVacio;
    if (operacion == VACIO) {
        esVacio = true;
    } else {
        esVacio = false;
    }
    return esVacio;
}

function pulsarIgual() {
    resultado = eval(operacion);
    operacion = resultado;
    imprimir('completo');
}

function calcular() {
    resultado = eval(operacion);
    imprimir('completo');
}

function retroceder() {
    operacion = operacion.slice(0, -1);
    imprimir('pantalla');
}

function restablecer() {
    operacion = VACIO;
    document.getElementById("pantalla").value = VACIO;
    document.getElementById("resultado").value = VACIO;
}

function imprimir(caso) {
    switch (caso) {
        case 'pantalla':
            document.getElementById("pantalla").value = operacion;
            break;
        case 'completo':
            document.getElementById("pantalla").value = VACIO;
            document.getElementById("resultado").value = resultado;
            break;
        default:
            console.log('Error de parámetros');
    }

}
*/

var model = (function () {
  var calculator = {
    firstNumber: '',
    secondNumber: '',
    operator: '',
    decimal: false
  };

  return {
    addNumber: function (number) {
      calculator.firstNumber += number;
    },

    getNumber: function () {
      return calculator.firstNumber;
    },

    getDecimal: function () {
      return calculator.decimal;
    },

    getOperator: function () {
      return calculator.operator;
    },

    setDecimal: function (value = true) {
      calculator.decimal = value;
    },

    checkFirstNumber: function () {
      return calculator.firstNumber === '';
    },

    checkSecondNumber: function () {
      return calculator.secondNumber === '';
    },

    checkOperator: function () {
      return calculator.operator === '=';
    },

    storeNumber: function () {
      // Stores the number in another variable
      calculator.secondNumber = parseFloat(calculator.firstNumber);

      // Cleans the first number variable
      calculator.firstNumber = '';

      // Resets the decimal variable
      calculator.decimal = false;
    },

    storeOperator: function (operator) {
      calculator.operator = operator;
    },

    operation: function () {
      var result, number1, number2, operator;

      operator = calculator.operator;

      number1 = parseFloat(calculator.secondNumber);
      number2 = parseFloat(calculator.firstNumber);
      switch (operator) {
        case '+':
          result = number1 + number2;
          break;
        case '-':
          result = number1 - number2;
          break;
        case 'x':
          result = number1 * number2;
          break;
        case '/':
          if (number2 === 0) {
            result = 'Undefined result'
          } else {
            result = number1 / number2;
          }
          break;
      }

      // Store the result in the secondNumber and reset the firstNumber variable
      calculator.secondNumber = result;
      calculator.firstNumber = '';

      return result;
    },

    deleteLastDigit: function () {
      calculator.firstNumber = calculator.firstNumber.slice(0, calculator.firstNumber.length - 1);
    },

    deleteAll: function () {
      calculator = {
        firstNumber: '',
        secondNumber: '',
        operator: '',
        decimal: false
      }
    },

    test: function () {
      return calculator;
    }
  }
})();


var view = (function () {
  var domStrings = {
    table: '.calculator',
    operationScreen: '.calculator__screen--operations',
    resultScreen: '.calculator__screen--result',
  }

  return {
    getDomStrings: function () {
      return domStrings;
    },

    displayNumber: function (number) {
      document.querySelector(domStrings.resultScreen).value = number;
    },

    displayOperation: function (number, operator) {
      document.querySelector(domStrings.operationScreen).value += number + ' ' + operator + ' ';
    },

    cleanResultScreen: function () {
      document.querySelector(domStrings.resultScreen).value = '';
    },

    cleanOperationScreen: function () {
      document.querySelector(domStrings.operationScreen).value = '';
    }
  }
})();


var controller = (function (m, v) {

  var setUpEventListeners = function () {
    var selector = v.getDomStrings();
    // Event delegation
    // If the keypad is pressed then execute process input method
    document.querySelector(selector.table).addEventListener('click', proccessInput);
  }

  var proccessInput = function (event) {
    var value = event.target.value;

    switch (value) {
      case 'RETR':
        // Calls the delete the last digit function
        delPressed();
        break;
      case '/':
      case 'x':
      case '-':
      case '+':
        // Calls the operator pressed function passing the operator
        operatorPressed(value);
        break;
      case '=':
        resultPressed();
        break;
      case 'AC':
        // Calls the clear function
        delAllPressed();
        break;
      default:
        // Calls the numberPressed function passing the number as a string
        numberPressed(value);
    }
  };

  var numberPressed = function (digit) {
    var number;

    // 1. Checks if the decimal was not setted and the number introduced was not the decimal
    if (m.getDecimal() && digit === '.') {
      return;
    } else if (m.checkOperator()) {
      // 1. Clear both screens
      v.cleanResultScreen();
      v.cleanOperationScreen();
    }
    // 1. Stores the digit in the model object
    m.addNumber(digit);

    // 2. Gets the full number
    number = m.getNumber();

    // 3. Displays on screen
    v.displayNumber(number);

    // 4. If the decimal key was pressed
    if (digit === '.') {
      m.setDecimal(true);
    }

  };

  var operatorPressed = function (operator) {
    var number, result;

    // If there is not number before the operator pressed, then adds a 0 automatically
    if (m.checkFirstNumber()) {
      // 1. Adds a zero
      numberPressed('0');
    }

    // If the second number is empty
    if (m.checkSecondNumber()) {
      // 1. Get the number
      number = m.getNumber();

      // 2. Clean and store the number in another variable
      m.storeNumber();

      // 3. Store the operator
      m.storeOperator(operator);

      // 4. Clean the result screen
      v.cleanResultScreen();

      // 5. Display the operation into the main screen
      v.displayOperation(number, operator);
    } else {
      // secondNumber = 6;
      // screen: 6 +
      // 1. Get the first number
      number = m.getNumber();

      // 2. Display in the operator screen
      v.displayOperation(number, operator);

      // 3. Operates and gets the result
      result = m.operation();

      // 4. Store the operator
      m.storeOperator(operator);

      // 5. Displays the result on the result screen
      v.displayNumber(result);
    }
  };

  var delPressed = function () {
    var number;

    // 1. Delete the last digit
    m.deleteLastDigit();

    // 2. Get the number
    number = m.getNumber();

    // 3. Display the number on screen
    v.displayNumber(number);
  };

  var delAllPressed = function () {
    // 1. Delete and restart the object stored in the model
    m.deleteAll();

    // 2. Clear both screens
    v.cleanResultScreen();
    v.cleanOperationScreen();
  };

  var resultPressed = function () {
    var number, result;

    // Exceptions: 
    // 1. Press the result button when there is no numbers stored
    // 2. Press the result button when there is no operator
    // 3. Press the result button more times than one

    // 1. Get the number
    number = m.getNumber();

    // First exception
    if (number) {
      // Second and third exception
      if (m.getOperator() !== '' && m.getOperator() !== '=') {
        // 2. Get the result
        result = m.operation();

        // 3. Display in the operator screen
        v.displayOperation(number, '=');

        // 4. Display the result
        v.displayNumber(result);

        // 6. Reset the model
        m.deleteAll();

        // 7. Store the operator
        m.storeOperator('=');
      }
    }
  };

  return {
    initialize: function () {
      setUpEventListeners();
    }
  }
})(model, view);

controller.initialize();