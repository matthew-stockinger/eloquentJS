/************************************* Exercises ********************* */

/**************** Retry ************************* */
class MultiplicatorUnitFailure extends Error { }

function primitiveMultiply(a, b) {
  if (Math.random() < 0.2) {
    return a * b;
  } else {
    throw new MultiplicatorUnitFailure("Klunk");
  }
}

function reliableMultiply(a, b) {
  while (1) {
    try {
      return primitiveMultiply(a, b);
    } catch (e) {
      if (e instanceof MultiplicatorUnitFailure) {
        continue;
        // without loop, could use recursion:
        // return reliableMultiply(a, b);
      } else {
        throw e;
      }
    }
  }
}

// console.log(primitiveMultiply(8, 8));
// 64 or error.
console.log(reliableMultiply(8, 8));
// → 64

/******************* The Locked Box ********************* */
const box = {
  locked: true,
  unlock() { this.locked = false; },
  lock() { this.locked = true; },
  _content: [],
  get content() {
    if (this.locked) throw new Error("Locked!");
    return this._content;
  }
};

/* Write a function called withBoxUnlocked that takes a function value as argument, unlocks the box, runs the function, and then ensures that the box is locked again before returning, regardless of whether the argument function returned normally or threw an exception. */

function withBoxUnlocked(body) {
  if (box.locked === false) {
    body();
  } else {
    box.unlock();
    try {
      body();
    } finally {
      box.lock();
    }
  }
}

withBoxUnlocked(function () {
  box.content.push("gold piece");
});

// box.unlock();

try {
  withBoxUnlocked(function () {
    throw new Error("Pirates on the horizon! Abort!");
  });
} catch (e) {
  console.log("Error raised: " + e);
}
console.log(box.locked);
// → true