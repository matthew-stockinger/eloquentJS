/**************** Text Follow-Along ********************** */
class Matrix {
  constructor(width, height, element = (x, y) => undefined) {
    this.width = width;
    this.height = height;
    this.content = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.content[y * width + x] = element(x, y);
      }
    }
  }

  get(x, y) {
    return this.content[y * this.width + x];
  }

  set(x, y, value) {
    this.content[y * this.width + x] = value;
  }

  [Symbol.iterator]() {
    return new MatrixIterator(this);
  }
}

class MatrixIterator {
  constructor(matrix) {
    this.x = 0;
    this.y = 0;
    this.matrix = matrix;
  }

  next() {
    if (this.y == this.matrix.height) return { done: true };

    let value = {
      x: this.x,
      y: this.y,
      value: this.matrix.get(this.x, this.y)
    };

    this.x++;
    if(this.x == this.matrix.width) {
      this.x = 0;
      this.y++;
    }
    console.log({value, done: false});
    return {value, done: false};
  }
}

// let matrix = new Matrix(2, 2, (x, y) => `value ${x},${y}`);
// for (let {x, y, value} of matrix) {
//   console.log(x, y, value);
// }

class SymmetricMatrix extends Matrix {
  constructor(size, element = (x, y) => undefined) {
    super(size, size, (x, y) => {
      if (x < y) return element(y, x);
      else return element(x, y);
    });
  }

  set(x, y, value) {
    super.set(x, y, value);
    if (x != y) {
      super.set(y, x, value);
    }
  }
}

// let matrix = new SymmetricMatrix(5, (x, y) => `${x},${y}`);
// console.log(matrix.get(2, 3));

/*************** Exercises ************************************************ */
/*************** A Vector Type ******************* */
class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  plus(otherVec) {
    return new Vec(this.x + otherVec.x, this.y + otherVec.y);
  }

  minus(otherVec) {
    return new Vec(this.x - otherVec.x, this.y - otherVec.y);
  }

  get length() {
    return Math.sqrt(this.x**2 + this.y**2);
  }
}

console.log(new Vec(1, 2).plus(new Vec(2, 3)));
// Vec{x: 3, y: 5}
console.log(new Vec(1, 2).minus(new Vec(2, 3)));
// Vec{x: -1, y: -1}
console.log(new Vec(3, 4).length);
// 5

/******************* Groups ************************************ */
class Group {
  constructor() {
    this.content = [];
  }

  add(member) {
    if (!this.has(member)) this.content.push(member);
    return member;
  }

  delete(member) {
    if (this.has(member)) {
      this.content.splice(this.content.indexOf(member), 1);
    }
    return member;
  }

  has(member) {
    return this.content.includes(member);
  }

  static from(iterable) {
    let res = new Group();
    for (const elt of iterable) {
      res.add(elt);
    }
    return res;
  }

  [Symbol.iterator]() {
    return new GroupIterator(this);
  }
}

let group = Group.from([10, 20]);
console.log(group.has(10));
// true
console.log(group.has(30));
// false
group.add(10);
group.delete(10);
console.log(group.has(10));
// false

/*************************** Iterable Groups ***************** */
class GroupIterator {
  constructor(group) {
    this.group = group;
    this.currentIndex = 0;
  }

  next() {
    if (this.currentIndex >= this.group.content.length) return {done: true};
    
    let value = this.group.content[this.currentIndex];
    this.currentIndex++;
    return {value, done: false};
  }
}

group.add(30);
group.add(10);
for (const val of Group.from(["a", "b", "c"])) {
  console.log(val);
}

/************** Borrowing a Method **************** */
let map = {one: 1, two: 2, hasOwnProperty: 8};

console.log(Object.hasOwnProperty.call(map, "one"));