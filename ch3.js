/*
by starting from the number 1 and repeatedly either adding 5 or multiplying by 3, an infinite set of numbers can be produced. How would you write a function that, given a number, tries to find a sequence of such additions and multiplications that produces that number?

For example, the number 13 could be reached by first multiplying by 3 and then adding 5 twice, whereas the number 15 cannot be reached at all.
*/

function thirtyFive(n) {
  if (n === 1) {
    return [];
  } else if (n < 1 || !Number.isInteger(n)) {
    return null;
  } else {
    let next = thirtyFive(n / 3);
    if (next) {
      return ['x3', ...next];
    } else {
      next = thirtyFive(n - 5);
      return next ? ['+5', ...next] : null;
    }
  }
}

console.log(thirtyFive(13));
console.log(thirtyFive(15));