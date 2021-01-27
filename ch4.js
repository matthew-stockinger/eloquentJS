/*************************** The Sum of a Range *********************/
function range(start, end, step = 1) {
  let res = [];
  if (step < 0) {
    for (let i = start; i >= end; i += step) {
      res.push(i);
    }
  } else {
    for (let i = start; i <= end; i += step) {
      res.push(i);
    }
  }
  return res;
}

function sum(arr) {
  return arr.reduce((acc, curr) => acc + curr);
}

console.log(sum(range(1, 10)));
console.log(range(1, 10, 2));
console.log(range(5, 2, -1));


/* Reverse Array */
function reverseArray(arr) {
  let res = [];
  for (let element of arr) {
    res.unshift(element);
  }
  return res;
}

function reverseArrayInPlace(arr) {
  let copy = [...arr];
  for (let i = 0; i < arr.length; i++) {
    arr[arr.length - i - 1] = copy[i];
  }
}

console.log(reverseArray(["A", "B", "C"]));
// → ["C", "B", "A"];
let arrayValue = [1, 2, 3, 4, 5];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);
// → [5, 4, 3, 2, 1]


/***********************************  A List ************************/
// function arrayToList(arr, list = {}) {
//   if (arr.length === 1) {
//     list.value = arr[0];
//     list.rest = null;
//     return list;
//   } else {
//     list = {
//       value: arr[0],
//       rest: arrayToList(arr.slice(1), list)
//     };
//     return list;
//   }
// }

function arrayToList(arr) {
  let list = {}
  for (let element of arr.reverse()) {
    list = {
      value: element,
      rest: "rest" in list ? list : null
    };
  }
  return list;
}

function listToArray(list) {
  const res = [];
  while ("value" in list) {
    res.push(list.value);
    list = list.rest || {};
  }
  return res;
}

function prepend(elt, list) {
  return {
    value: elt,
    rest: list
  }
}

// function nth(n, list) {
//   let res = list;
//   let count = 1;
//   while (count < n) {
//     if (n === 1) return list;
//     if (n < 1) return undefined;
//     res = res.rest;
//     count += 1;
//   }
//   return res.value || undefined;
// }

function nth(list, n) {
  if (n < 0) {
    return undefined;
  } else if (n === 0) {
    return list ? list.value : undefined;
  } else {
    return nth(list.rest, n - 1);
  }
}

console.log(arrayToList([10, 20]));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(listToArray(arrayToList([10, 20, 30])));
// → [10, 20, 30]
console.log(prepend(10, prepend(20, null)));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(nth(arrayToList([10, 20, 30]), 1));
// → 20


/**************** Deep Comparison ************************ */
// reflection on this one:
// probably better to do a series of tests for inequities, returning false for
// those.  Then, if x and y pass through all those tests, return true.
// however, this works, and has some elegantness of its own.
function deepEqual(x, y) {
  let xObject = typeof x === 'object';
  let yObject = typeof y === 'object';
  if (xObject && yObject && x !== null && y !== null) {
    let res = true;
    if (Object.keys(x).length !== Object.keys(y).length) return false;
    for (let key of Object.keys(x)) {
      if (!key in y) {
        return false;
      } else if (typeof x[key] === 'object') {
        res = res && deepEqual(x[key], y[key]);
      } else {
        res = res && x[key] === y[key];
      }
    }
    return res;
  } else {
    return x === y;
  }
}

let obj = {here: {is: "an"}, object: 2};
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, {here: 1, object: 2}));
// → false
console.log(deepEqual(obj, {here: {is: "an"}, object: 2}));
// → true
console.log(deepEqual(obj, {here: {is: "an"}, objet: 2}));
// → false
console.log(deepEqual(arrayToList([1, 2, 3]), arrayToList([1, 2, 3])));
// → true;
console.log(arrayToList([1, 2, 3]) === arrayToList([1, 2, 3]));
// false