const ini = `
searchengine=https://duckduckgo.com/?q=$1
spitefulness=9.7

; comments are preceded by a semicolon...
; each section concerns an individual enemy
[larry]
fullname=Larry Doe
type=kindergarten bully
website=http://www.geocities.com/CapeCanaveral/11451

[davaeorn]
fullname=Davaeorn
type=evil wizard
outputdir=/home/marijn/enemies/davaeorn
`;

function parseINI(string) {
  // Start with an object to hold the top-level fields
  let result = {};
  let section = result;
  string.split(/\r?\n/).forEach(line => {
    let match;
    if (match = line.match(/^(\w+)=(.*)$/)) {
      section[match[1]] = match[2];
    } else if (match = line.match(/^\[(.*)\]$/)) {
      section = result[match[1]] = {};
    } else if (!/^\s*(;.*)?$/.test(line)) {
      throw new Error("Line '" + line + "' is not valid.");
    }
  });
  return result;
}

console.log(parseINI(`
name=Vasilis
[address]
city=Tessaloniki`));

/************* Exercises ************************* */
/* Regexp Golf */
// car and cat
verify(/ca[rt]/,
  ["my car", "bad cats"],
  ["camper", "high art"]);

// pop and prop
verify(/pr?op/,
  ["pop culture", "mad props"],
  ["plop", "prrrop"]);

// ferret, ferry, and ferrari
verify(/ferr(et|y|ari)/,
  ["ferret", "ferry", "ferrari"],
  ["ferrum", "transfer A"]);

// any word ending in ious
verify(/ious\b/,
  ["how delicious", "spacious room"],
  ["ruinous", "consciousness"]);

// a whitespace character followed by a period, comma, colon, or semicolon
verify(/\s[\.,:;]/,
  ["bad punctuation ."],
  ["escape the period"]);

// a word longer than six characters
verify(/\w{7,}/,
  ["Siebentausenddreihundertzweiundzwanzig"],
  ["no", "three small words"]);

// a word without the letter e (or E)
verify(/\b([a-d]|[f-z])+\b/i,
  ["red platypus", "wobbling nest"],
  ["earth bed", "learning ape", "BEET"]);


function verify(regexp, yes, no) {
  // Ignore unfinished exercises
  if (regexp.source == "...") return;
  for (let str of yes) if (!regexp.test(str)) {
    console.log(`Failure to match '${str}'`);
  }
  for (let str of no) if (regexp.test(str)) {
    console.log(`Unexpected match for '${str}'`);
  }
}


/* Quoting Style */
let text = "'I'm the cook,' he said, 'it's my job.'";
let text2 = "'I'm Matt's mother's cook,' he said, 'it's my job.'";
// find all single quotes with stuff in between.  match it all.
console.log(text.replace(/'(((\w+'\w+)|[\w\s,\.])+)'/g, `"$1"`));
console.log(text2.replace(/'(((\w+'\w+)|[\w\s,\.])+)'/g, `"$1"`));
// find any single quote with an adjacent nonword char.
console.log(text2.replace(/^'|'$|'(\W)|(\W)'/g, `$2"$1`));
// → "I'm the cook," he said, "it's my job."


/* Numbers again */
// Fill in this regular expression.
let number = /^[\+\-]?((\d?\.?\d+)|(\d+\.?\d*))(e[\+\-]?\d+)?$/i;

// Tests:
for (let str of ["1", "-1", "+15", "1.55", ".5", "5.",
                 "1.3e2", "1E-4", "1e+12"]) {
  if (!number.test(str)) {
    console.log(`Failed to match '${str}'`);
  }
}
for (let str of ["1a", "+-1", "1.2.3", "1+1", "1e4.5",
                 ".5.", "1f5", "."]) {
  if (number.test(str)) {
    console.log(`Incorrectly accepted '${str}'`);
  }
}