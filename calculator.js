var operatorsEnum = { PLUS: '+', MINUS: '−', MULT: '*', DIVIS: '/'};
var operatorsPrecedence = {HIGHER: 1, EQUAL: 2, LOWER: 3}

// Function to check wether a digitsArea is usable
// in order to add an operator to the expression
// returns a boolean value
function isDigitsAreaValidToAddOperator(digitsArea)
{
  var isValid;

  // If the digitasArea is not empty and
  // if it doesn't have an operator as last character
  // In order not to pile operators up
  if(
    !digitsArea.innerText.endsWith(operatorsEnum.PLUS) && !digitsArea.innerText.endsWith(operatorsEnum.MINUS) &&
    !digitsArea.innerText.endsWith(operatorsEnum.MULT) && !digitsArea.innerText.endsWith(operatorsEnum.DIVIS) &&
    digitsArea.innerText != "")
    isValid = true;
  else
    isValid =  false;

  return isValid;
}

// Function to get the math precedence of the operator1
// parameter compared to the operator2 parameter
// returns an value of operatorsPrecedence "type"
function getOperatorsPrecedence(operator1, operator2)
{
  var precedence;

  var isOperator1Sum, isOperator2Sum;

  // Check if the first operator is an algebraic sum
  if(operator1 == operatorsEnum.PLUS || operator1 == operatorsEnum.MINUS)
    isOperator1Sum = true;
  else
    isOperator1Sum = false;

  // Check if the second operator is an algebraic sum
  if(operator2 == operatorsEnum.PLUS || operator2 == operatorsEnum.MINUS)
    isOperator2Sum = true;
  else
    isOperator2Sum = false;

  // If both operators are algebraic sum
  if(isOperator1Sum && isOperator2Sum)
    precende = operatorsPrecedence.EQUAL;
  // If both operators are multiplication or division
  else if(!isOperator1Sum && !isOperator2Sum)
    precende = operatorsPrecedence.EQUAL;
  // If the first operator is algebraic sum and the second one is multiplication or division
  else if(isOperator1Sum && !isOperator2Sum)
    precende = operatorsPrecedence.LOWER;
  // If the second operator is multiplication or division and the second one is algebraic sum
  else
    precende = operatorsPrecedence.HIGHER;

  return precende;
}

function isNumber(value)
{
  return (isNaN(value) ? false : true);
}

// Function to convert an infix math expression in string
// form to the array form, in which each cell corresponds to
// a value (operand or operator)
// returns an array of strings
function mathStringExprToArrayExpr(mathStringExpr)
{
  var number = "";
  var infixMathExprArray = []; // Each expression value (opeand or operator) is a cell

  // Loop to fill the infix notation expression array
  for(var i = 0; i < mathStringExpr.length; i++)
  {
    // If the parser reaches a number
    if(isNumber(mathStringExpr.charAt(i)))
      number += mathStringExpr.charAt(i);

    // Else: If the parser reaches an operator
    else
    {
      // Push the operand to the infix notation expression array
      infixMathExprArray.push(number);
      number = "";

      // Push the operator to the infix notation expression array
      infixMathExprArray.push(mathStringExpr.charAt(i));
    }

    // if the parser reaches the last value
    // which is surely a number
    if(i == mathStringExpr.length-1)
      // Push the operand to the infix notation expression array
      infixMathExprArray.push(number);
  }

  return infixMathExprArray;
}

// Function that implements the shunting-yard algorithm,
// to convert an infix math expression to a postfix form one
// the parameter must be an array of strings (each string
// is a operand or operator)
// returns a queue (array) of strings
function shuntingYardAlgorithm(infixMathExprArray)
{
  // Stack of operators
  var operatorsStack = [];

  // Queue, it will be the output expression
  // in Reverse Polish Notation
  var outputQueue = [];

  for(var i = 0; i < infixMathExprArray.length; i++)
  {
    // If the parser reaches an operand
    if(isNumber(infixMathExprArray[i]))
      // Push the operand to the output queue
      outputQueue.push(infixMathExprArray[i]);

    // Else: If the parser reaches an operator
    else
    {
      // While the operator has lower precedence than the last operator of the operators stack
      // and the operators stack is not empty yet
      while(
          (getOperatorsPrecedence(operatorsStack[operatorsStack.length-1], infixMathExprArray[i]) == operatorsPrecedence.HIGHER ||
          getOperatorsPrecedence(operatorsStack[operatorsStack.length-1], infixMathExprArray[i]) == operatorsPrecedence.EQUAL) &&
          operatorsStack.length >= 1)
        // Pop the last operator from the operators stack and
        // push it to the output queue
        outputQueue.push(operatorsStack.pop());

      // Push the operator onto the operators stack
      operatorsStack.push(infixMathExprArray[i]);
    }
  }

  // If the operators stack has got remaining operators
  // For each of them
  while(operatorsStack.length > 0)
    // Pop the last operator from the operators stack and
    // push it to the output queue
    outputQueue.push(operatorsStack.pop());

  return outputQueue;
}

// Function to perform a binary operation (binary due to the number
// of operands: two; not beetween binary numbers)
// returns a number
function singleMathOperation(firstOperand, secondOperand, operator)
{
  var result;

  switch(operator)
  {
    case operatorsEnum.PLUS:
      result = firstOperand + secondOperand;
      break;

    case operatorsEnum.MINUS:
      result = firstOperand - secondOperand;
      break;

    case operatorsEnum.MULT:
      result = firstOperand * secondOperand;
      break;

    case operatorsEnum.DIVIS:
      result = firstOperand / secondOperand;
      break;
  }

  return result;
}

// Function to parse a postfix math expression
// so as to get the final result
// returns a number
function postfixMathExprParser(postfixMathExprArray)
{
  var stack = [];
  var topValue, secondTopValue, result;

  for(var i = 0; i < postfixMathExprArray.length; i++)
  {
    // If the parser reaches an operand
    if(isNumber(postfixMathExprArray[i]))
      // Push it onto the stack
      stack.push(postfixMathExprArray[i]);

    // Else: If the parser reaches an operand
    else
    {
      // Pop the first value from the stack, store it and
      // convert it to number (it is a string)
      // it will be the first operand
      topValue = Number(stack.pop());

      // Pop the new first value from the stack, store
      // it and convert it to number (it is a string)
      // it will be the second operand
      secondTopValue = Number(stack.pop());

      // Evaluate the result of the operation
      result = singleMathOperation(secondTopValue, topValue, postfixMathExprArray[i]);

      // Push the result onto the stack
      stack.push(result);
    }
  }

  // The last element ramained in the stack is the result
  return stack[0];
}


// Functions invoked by events in the HTML document
function numButtonClicked(num)
{
  var digitsArea = document.getElementById("digitsArea");

  // Add the parameter number to the digitsArea
  var numberNode = document.createTextNode(num);
  digitsArea.appendChild(numberNode);
}

function operatorButtonClicked(operator)
{
  var digitsArea = document.getElementById("digitsArea");

  if(isDigitsAreaValidToAddOperator(digitsArea))
  {
    // Add the parameter operator to the digitsArea
    var operNode = document.createTextNode(operator);
    digitsArea.appendChild(operNode);
  }
}

function resultButtonClicked()
{
  var digitsArea = document.getElementById("digitsArea");

  var infixMathExpr = mathStringExprToArrayExpr(digitsArea.innerText);
  var postfixMathExpr = shuntingYardAlgorithm(infixMathExpr);
  var result = postfixMathExprParser(postfixMathExpr);

  digitsArea.innerText = result;
}
