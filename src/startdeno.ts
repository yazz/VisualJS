import esprima from "https://dev.jspm.io/esprima";

const program = 'const answer = 42';
console.log(esprima.tokenize(program))
