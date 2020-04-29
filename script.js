var model = (function () {
  var calculator = {
    number: '',
    storedNumber: 0,
    operator: '',
    decimal: false
  };

  return {
    addDigit: function (number) {
      calculator.number += number;
    },

    getNumber: function () {
      return calculator.number;
    },

    getStoredNumber: function () {
      return calculator.storedNumber;
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

    storeNumber: function () {
      // Stores the number in another variable
      calculator.storedNumber = parseFloat(calculator.number);

      // Cleans the first number variable
      calculator.number = '';

      // Resets the decimal variable
      calculator.decimal = false;
    },

    setOperator: function (operator) {
      calculator.operator = operator;
    },

    operation: function () {
      var result, number1, number2, operator;

      operator = calculator.operator;

      number1 = parseFloat(calculator.storedNumber);
      number2 = parseFloat(calculator.number);
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
          result = number1 / number2;
          break;
      }

      // Store the result in the storedNumber and reset the number variable
      calculator.storedNumber = result;
      calculator.number = '';

      return result;
    },

    deleteLastDigit: function () {
      calculator.number = calculator.number.slice(0, calculator.number.length - 1);
    },

    deleteAll: function () {
      calculator = {
        number: '',
        storedNumber: '',
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
    btn: 'calculator__button',
    sideBtn: 'calculator__side-button'
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

    // If the table is pressed then execute process input method
    document.querySelector(selector.table).addEventListener('click', proccessInput);
  }

  var proccessInput = function (event) {
    var value, dom;

    value = event.target.value;
    dom = v.getDomStrings();

    // If the clicked element has one of the allowed classes
    if (event.srcElement.className === dom.btn || event.srcElement.className === dom.sideBtn) {
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
    }
  };

  var numberPressed = function (digit) {
    var number;

    /* Exceptions:
    // 1. The user adds decimals more times than one
        -> Check the decimal variable and if the last digit added is a digit

    // 2. The user pressed the assignment operator 
        -> Check if the assignment operator was pressed just before 
    */

    // 1. First exception
    if (m.getDecimal() && digit === '.') {
      // Does nothing

      return;

      // 2. Second exception
    } else if (m.getOperator() === '=') {

      // 1. Clear both screens
      v.cleanResultScreen();
      v.cleanOperationScreen();

      // 2. Reset operator
      m.setOperator('');
    }

    // 1. Add and stores the digit in the model object
    m.addDigit(digit);

    // 2. Get the full number
    number = m.getNumber();

    // 3. Display on screen
    v.displayNumber(number);

    // 4. If the decimal key was pressed
    if (digit === '.') {
      // Store the status of the decimal variable
      m.setDecimal(true);
    }

  };

  var operatorPressed = function (operator) {
    var number, result;

    /* Exceptions:
    // 1. The user adds operators more times than one
        -> Check if there is not operator, storedNumber and number in the model
  
    // 2. The user wants to put a negative number starting at the beginning
        -> Check that there is not operator, but there is a number entered and the number is not the negative symbol

      3. The user wants to do an operation 'at the time' that a new operator is added
        -> Check that there is an existing operator and there is a number entered and the number is not the negative symbol plus there is an storedNumber variable
    */

    // If the operator is not setted and the stored number is null or undefined
    if (!m.getOperator() && !m.getStoredNumber() && !m.getNumber()) {
      // 1. Add and stores the digit in the model object
      m.addDigit(operator);

      // 2. Get the full number
      number = m.getNumber();

      // 3. Display on screen
      v.displayNumber(number);

    } else if (!m.getOperator() && m.getNumber() && m.getNumber() !== '-') {
      // 1. Get the number
      number = m.getNumber();

      // 2. Clean and store the number in another variable
      m.storeNumber();

      // 3. Store the operator
      m.setOperator(operator);

      // 4. Clean the result screen
      v.cleanResultScreen();

      // 5. Display the operation into the operation screen
      v.displayOperation(number, operator);

    } else if (m.getOperator() && m.getNumber() && m.getNumber() !== '-' && m.getStoredNumber()) {
      // 1. Get the first number
      number = m.getNumber();

      // 2. Display in the operator screen
      v.displayOperation(number, operator);

      // 3. Operates and gets the result
      result = m.operation();

      // 4. Store the operator
      m.setOperator(operator);

      // 5. Displays the result on the result screen
      v.displayNumber(result);
    }

  };


  var resultPressed = function () {
    var number, result;

    /* Exceptions: 
    // 1. Press the result button when there is no numbers stored
        -> Check if the first number is not null or undefined

    // 2. Press the result button when there is no operator
        -> Check that the last operator stored is not null or undefined

    // 3. Press the result button more times than one
        -> Check that the last operator stored is not the assignment operator
    */

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
        m.setOperator('=');
      }
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

  return {
    initialize: function () {
      setUpEventListeners();
    }
  }
})(model, view);

controller.initialize();