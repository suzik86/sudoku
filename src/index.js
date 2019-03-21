module.exports = function solveSudoku(matrix) {
 
  function fillSolution(row, col, value) {
    matrix[row][col] = value;
    let items = getRow(9, row).concat(getCol(9, col)).concat(getSquare(3 * Math.floor(row/3) + Math.floor(col/3)));
    
    for (let i = 0; i < items.length; i++) {
      let currentValue = matrix[items[i][0]][items[i][1]];
      if (typeof(currentValue) == "object" && currentValue.has(value)) {
          currentValue.delete(value);
          if (currentValue.size == 1) {
            fillSolution(items[i][0], items[i][1], currentValue.values().next().value);            
          }  
      }      
    }    
  }

  function findMissing(arr) {
    let reference = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let empty = [];
    for (let i in arr) {
      let coord = arr[i];
      let row = coord[0];
      let col = coord[1];
      let value = matrix[row][col];
      if (value == 0 || typeof(value) === "object") {
        empty.push(arr[i]);
      } else {
        reference.delete(value);        
      }      
    }  
    if (reference.size == 1) {
      fillSolution(empty[0][0], empty[0][1], reference.values().next().value);
      empty = [];
    }  
    for (let i = empty.length - 1; i >= 0; i--){
      let value = matrix[empty[i][0]][empty[i][1]];
      if (value == 0) {
        value = reference;        
      } else {
        value = findIntersection(value, reference);
      }
      matrix[empty[i][0]][empty[i][1]] = value;

      if (typeof(value) != 'object') {
        empty.splice(i, 1);
      }
    }

    let resultObj = {};
    for (let i = 0; i < empty.length; i++ ) {
      let coord = empty[i];
      let row = coord[0];
      let col = coord[1];
      let value = matrix[row][col];   
      for (let item of value) {
        
        if (!resultObj.hasOwnProperty(item)) {
          resultObj[item] = [];
        }
        resultObj[item].push(coord);
      }
    }

    for (key in resultObj){
      let value = resultObj[key];
      if (value.length == 1) {        
        matrix[value[0][0]][value[0][1]] = parseInt(key);
      }
    }
    
    //printMatrix();
    
    return reference;
  }

  function findIntersection (a, b) {
    let result = new Set();
    for (let item of a) {
      if (b.has(item)) {
        result.add(item);
      }
    }
    if (result.size == 1) {
      return result.values().next().value;
    } 
    return result;  
  }

  function getRow (size, row) {
    let rowArray = [];
    for (let col = 0; col < size; col ++) {
      rowArray.push([row, col]);
    }
    return rowArray;  
  }

  function getCol(size, col) {
    let columnArray = [];
    for (let row = 0; row < size; row ++) {
      columnArray.push([row, col]);
    }
    return columnArray;
  }

  function getSquare (n){
    let row = Math.floor(n/3)*3;
    let col = (n%3)*3; 
    return [
      [row, col], [row, col+1], [row, col+2],
      [row+1, col], [row+1, col+1], [row+1, col+2],  
      [row+2, col], [row+2, col+1], [row+2, col+2], 
    ];    
  }
  

  function checkSolved (matrix) {
    for (let i = 0; i < matrix.length; i++) {
      let row = matrix[i];
      for (let j = 0; j < row.length; j++) {
        let value = row[j];
        if (typeof(value) === "object") {
          return false;
        }
      }
    }
    return true;    
  }

  function printMatrix() {
    for (let i = 0; i < matrix.length; i++) {
      console.log(matrix[i].map(
        function(item) {
          if (typeof(item) == 'object') {
            return '{'+Array.from(item).join(',')+'}'}
          else {
            return item;
          }  
        }).join(', '));
    }
    console.log('');
  }


  const size = 9;

  for ( let i = 1; i < 50; i++) {  
    
    for (let i = 0; i < 9; i++) {
      findMissing(getRow(9, i));
    }    
    
    for (let i = 0; i < 9; i++) {
      findMissing(getCol(9, i));
    }
    
    for (let i = 0; i < 9; i++) {
      findMissing(getSquare(i));
    }

    if (checkSolved(matrix)) {
      break;
    } 
  }  

  return matrix;
  
};

