/******** Exercises **************** */
/* 1.) A Modular Robot */
// If you were to write that project as a modular program, what modules would you create? Which module would depend on which other module, and what would their interfaces look like?

// Which pieces are likely to be available prewritten on NPM? Would you prefer to use an NPM package or write them yourself?

/* My answer:

I would first use a module that exports a graph data structure.
This probably already exists on NPM.  There's probably also something out there that'll do the routing for me, too.

The other module would be my own creation.  It would deal with the state of mail on the graph, including the current locations of parcels and their destinations.  To keep things independent, it should allow any standard graph as input.  Perhaps it would expose a few different methods/algorithms for delivering all the mail.  Helper functions for doing this, such as randomPick, mailRoute, and findRoute should be private API.  The different robots would be public API.
*/


/* 2.) Roads Module */
const {buildGraph} = require('./graph');

let roads = [
  "Alice's House-Bob's House",   "Alice's House-Cabin",
  "Alice's House-Post Office",   "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop",          "Marketplace-Farm",
  "Marketplace-Post Office",     "Marketplace-Shop",
  "Marketplace-Town Hall",       "Shop-Town Hall"
];

roads = roads.map(edge => [
  edge.match(/.+(?=\-)/)[0], 
  edge.match(/(?<=\-).+/)[0]
]);

exports.roadGraph = buildGraph(roads);

/* 3.) Circular Dependencies */
