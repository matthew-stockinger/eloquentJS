"use strict";
const roads = [
  "Alice's House-Bob's House", "Alice's House-Cabin",
  "Alice's House-Post Office", "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop", "Marketplace-Farm",
  "Marketplace-Post Office", "Marketplace-Shop",
  "Marketplace-Town Hall", "Shop-Town Hall"
];

function buildGraph(edges) {
  let graph = Object.create(null);
  function addEdge(from, to) {
    if (graph[from] == undefined) {
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  }
  for (let [from, to] of edges.map(r => r.split("-"))) {
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}

const roadGraph = buildGraph(roads);

class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }

  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this;
    } else {
      let parcels = this.parcels.map(p => {
        if (p.place != this.place) return p;
        return {place: destination, address: p.address};
      }).filter(p => p.place != p.address);
      return new VillageState(destination, parcels);
    }
  }

  static random(parcelCount = 5) {
    let parcels = [];
    for (let i = 0; i < parcelCount; i++) {
      let address = randomPick(Object.keys(roadGraph));
      let place;
      do {
        place = randomPick(Object.keys(roadGraph));
      } while (place == address);
      parcels.push({place, address});
    }
    return new VillageState("Post Office", parcels);
  }
}

// let first = new VillageState(
//   "Post Office",
//   [{place: "Post Office", address: "Alice's House"}]
// );
// let next = first.move("Alice's House");

// console.log(next.place);
// // Alice's House
// console.log(next.parcels);
// // []
// console.log(first.place);
// // Post Office

function runRobot(state, robot, memory) {
  let turn;
  for (turn = 0;; turn++) {
    if (state.parcels.length == 0) {
      console.log(`Done in ${turn} turns`);
      break;
    }
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    console.log(`Moved to ${action.direction}`);
  }
  return turn;
}

function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

function randomRobot(state) {
  return {direction: randomPick(roadGraph[state.place])};
}

// let state = VillageState.random();
// console.log(state);
// console.log(roadGraph);
// runRobot(state, randomRobot);

const mailRoute = [
  "Alice's House", "Cabin", "Alice's House", "Bob's House",
  "Town Hall", "Daria's House", "Ernie's House",
  "Grete's House", "Shop", "Grete's House", "Farm",
  "Marketplace", "Post Office"
];

function routeRobot(state, memory) {
  if (memory.length == 0) memory = mailRoute;
  return {direction: memory[0], memory: memory.slice(1)};
}

// runRobot(VillageState.random(), routeRobot, []);

function findRoute(graph, from, to) {
  let work = [{at: from, route: []}];
  for (let i = 0; i < work.length; i++) {
    let {at, route} = work[i];
    for (let place of graph[at]) {
      if (place == to) return route.concat(place);
      if (!work.some(w => w.at == place)) {
        work.push({at: place, route: route.concat(place)});
      }
    }
  }
}

function goalOrientedRobot({place, parcels}, route) {
  if (route.length == 0) {
    let parcel = parcels[0];
    if (parcel.place != place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return {direction: route[0], memory: route.slice(1)};
}

// runRobot(VillageState.random(), goalOrientedRobot, []);

/************ Exercises *********************************************** */
/************ Measuring a Robot ************** */
function compareRobots(robot1, memory1, robot2, memory2) {
  let robot1turns = [];
  let robot2turns = [];
  for (let i = 0; i < 100; i++) {
    const state = VillageState.random();
    robot1turns.push(runRobot(state, robot1, memory1));
    robot2turns.push(runRobot(state, robot2, memory2));
  }
  const robot1avg = robot1turns.reduce((a, c) => a + c)/100;
  const robot2avg = robot2turns.reduce((a, c) => a + c)/100;
  console.log(`robot1 took an average of ${robot1avg} turns.`);
  console.log(`robot2 took an average of ${robot2avg} turns.`);
}

// compareRobots(routeRobot, [], goalOrientedRobot, []);

/******************* Robot Efficiency *********************** */
// let state1 = VillageState.random();
// console.log(state1);
// console.log(farthestStartParcel(roadGraph, state1.parcels));

function nearestStartParcel(graph, parcels) {
  let parcelPick = "";
  let pickDist = 0;
  for (const parcel of parcels) {
    let dist = findRoute(graph, "Post Office", parcel.place).length;
    if (!pickDist || dist < pickDist) {
      pickDist = dist;
      parcelPick = parcel;
    }
  }
  return parcelPick;
}

function farthestStartParcel(graph, parcels) {
  let parcelPick = "";
  let pickDist = 0;
  for (const parcel of parcels) {
    let dist = findRoute(graph, "Post Office", parcel.place).length;
    if (!pickDist || dist > pickDist) {
      pickDist = dist;
      parcelPick = parcel;
    }
  }
  return parcelPick;
}

function nearestParcel(graph, from, parcels) {
  let parcelPick = "";
  let pickDist = 0;
  for (const parcel of parcels) {
    let dist = findRoute(graph, from, parcel.place).length;
    if (!pickDist || dist < pickDist) {
      pickDist = dist;
      parcelPick = parcel;
    }
  }
  return parcelPick;
}

function nearestParcels(graph, from, parcels) {
  let parcelPicks = [];
  let pickDist = 0;
  for (const parcel of parcels) {
    let dist = findRoute(graph, from, parcel.place).length;
    if (!pickDist || dist < pickDist) {
      pickDist = dist;
      parcelPicks = [parcel];
    } else if (dist == pickDist) {
      parcelPicks.push(parcel);
    }
  }
  return parcelPicks;
}

// always starts with the nearest parcel.
function improvedRobot1({place, parcels}, route) {
  if (route.length == 0) {
    let parcel = nearestStartParcel(roadGraph, parcels);
    if (parcel.place != place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return {direction: route[0], memory: route.slice(1)};
}

// always starts with the farthest parcel.
function improvedRobot2({place, parcels}, route) {
  if (route.length == 0) {
    let parcel = farthestStartParcel(roadGraph, parcels);
    if (parcel.place != place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return {direction: route[0], memory: route.slice(1)};
}

// Improved by about 1 turn.
// compareRobots(improvedRobot2, [], goalOrientedRobot, []);

// attempt #3
// one complete pickup tour, then goalOriented dropoff. 
// less efficient.
// compareRobots(goalOrientedRobot, mailRoute, goalOrientedRobot, []);

// attempt #4
// always go to the nearest parcel after each delivery.
function improvedRobot4({place, parcels}, route) {
  if (route.length == 0) {
    let parcel = nearestParcel(roadGraph, place, parcels);
    if (parcel.place != place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return {direction: route[0], memory: route.slice(1)};
}

// compareRobots(improvedRobot4, [], goalOrientedRobot, []);


/************* Persistent Group ************************************ */
class PGroup {
  constructor(arr = []) {
    this.content = arr;
  }

  // replaced this with property definition below.
  // static get empty() {
  //   return new PGroup();
  // }

  add(member) {
    if (!this.has(member)) return new PGroup([...this.content, member]);
    else return this;
  }

  delete(member) {
    if (this.has(member)) {
      let i = this.content.indexOf(member);
      return new PGroup([
        ...this.content.slice(0, i), 
        ...this.content.slice(i + 1)
      ]);
    } else {
      return this;
    }
  }

  has(member) {
    return this.content.includes(member);
  }

  static from(iterable) {
    let res = new PGroup();
    for (const elt of iterable) {
      res = res.add(elt);
    }
    return res;
  }
}

PGroup.empty = new PGroup();

let a = PGroup.empty.add("a");
let ab = a.add("b");
let b = ab.delete("a");

console.log(b.has("b"));
// true
console.log(a.has("b"));
// false
console.log(b.has("a"));
// false

let s1 = new Set([1, 2, 3, 4, 5]);
let s = PGroup.from(s1);
console.log(s.has(3));
// true