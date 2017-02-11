(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.simpleSqlParser = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports.sql2ast = require('./src/sql2ast.js');
module.exports.ast2sql = require('./src/ast2sql.js');

},{"./src/ast2sql.js":5,"./src/sql2ast.js":6}],2:[function(require,module,exports){
// pass
var Parsimmon = {};

Parsimmon.Parser = (function() {
  "use strict";

  // The Parser object is a wrapper for a parser function.
  // Externally, you use one to parse a string by calling
  //   var result = SomeParser.parse('Me Me Me! Parse Me!');
  // You should never call the constructor, rather you should
  // construct your Parser from the base parsers and the
  // parser combinator methods.
  function Parser(action) {
    if (!(this instanceof Parser)) return new Parser(action);
    this._ = action;
  };

  var _ = Parser.prototype;

  function makeSuccess(index, value) {
    return {
      status: true,
      index: index,
      value: value,
      furthest: -1,
      expected: []
    };
  }

  function makeFailure(index, expected) {
    return {
      status: false,
      index: -1,
      value: null,
      furthest: index,
      expected: [expected]
    };
  }

  function mergeReplies(result, last) {
    if (!last) return result;
    if (result.furthest > last.furthest) return result;

    var expected = (result.furthest === last.furthest)
      ? result.expected.concat(last.expected)
      : last.expected;

    return {
      status: result.status,
      index: result.index,
      value: result.value,
      furthest: last.furthest,
      expected: expected
    }
  }

  function assertParser(p) {
    if (!(p instanceof Parser)) throw new Error('not a parser: '+p);
  }

  function formatExpected(expected) {
    if (expected.length === 1) return expected[0];

    return 'one of ' + expected.join(', ')
  }

  function formatGot(stream, error) {
    var i = error.index;

    if (i === stream.length) return ', got the end of the stream'


    var prefix = (i > 0 ? "'..." : "'");
    var suffix = (stream.length - i > 12 ? "...'" : "'");

    return ' at character ' + i + ', got ' + prefix + stream.slice(i, i+12) + suffix
  }

  var formatError = Parsimmon.formatError = function(stream, error) {
    return 'expected ' + formatExpected(error.expected) + formatGot(stream, error)
  };

  _.parse = function(stream) {
    var result = this.skip(eof)._(stream, 0);

    return result.status ? {
      status: true,
      value: result.value
    } : {
      status: false,
      index: result.furthest,
      expected: result.expected
    };
  };

  // [Parser a] -> Parser [a]
  var seq = Parsimmon.seq = function() {
    var parsers = [].slice.call(arguments);
    var numParsers = parsers.length;

    return Parser(function(stream, i) {
      var result;
      var accum = new Array(numParsers);

      for (var j = 0; j < numParsers; j += 1) {
        result = mergeReplies(parsers[j]._(stream, i), result);
        if (!result.status) return result;
        accum[j] = result.value
        i = result.index;
      }

      return mergeReplies(makeSuccess(i, accum), result);
    });
  };


  var seqMap = Parsimmon.seqMap = function() {
    var args = [].slice.call(arguments);
    var mapper = args.pop();
    return seq.apply(null, args).map(function(results) {
      return mapper.apply(null, results);
    });
  };

  /**
   * Allows to add custom primitive parsers
   */
  var custom = Parsimmon.custom = function(parsingFunction) {
    return Parser(parsingFunction(makeSuccess, makeFailure));
  };

  var alt = Parsimmon.alt = function() {
    var parsers = [].slice.call(arguments);
    var numParsers = parsers.length;
    if (numParsers === 0) return fail('zero alternates')

    return Parser(function(stream, i) {
      var result;
      for (var j = 0; j < parsers.length; j += 1) {
        result = mergeReplies(parsers[j]._(stream, i), result);
        if (result.status) return result;
      }
      return result;
    });
  };

  // -*- primitive combinators -*- //
  _.or = function(alternative) {
    return alt(this, alternative);
  };

  _.then = function(next) {
    if (typeof next === 'function') {
      throw new Error('chaining features of .then are no longer supported, use .chain instead');
    }

    assertParser(next);
    return seq(this, next).map(function(results) { return results[1]; });
  };

  // -*- optimized iterative combinators -*- //
  // equivalent to:
  // _.many = function() {
  //   return this.times(0, Infinity);
  // };
  // or, more explicitly:
  // _.many = function() {
  //   var self = this;
  //   return self.then(function(x) {
  //     return self.many().then(function(xs) {
  //       return [x].concat(xs);
  //     });
  //   }).or(succeed([]));
  // };
  _.many = function() {
    var self = this;

    return Parser(function(stream, i) {
      var accum = [];
      var result;
      var prevResult;

      for (;;) {
        result = mergeReplies(self._(stream, i), result);

        if (result.status) {
          i = result.index;
          accum.push(result.value);
        }
        else {
          return mergeReplies(makeSuccess(i, accum), result);
        }
      }
    });
  };

  // equivalent to:
  // _.times = function(min, max) {
  //   if (arguments.length < 2) max = min;
  //   var self = this;
  //   if (min > 0) {
  //     return self.then(function(x) {
  //       return self.times(min - 1, max - 1).then(function(xs) {
  //         return [x].concat(xs);
  //       });
  //     });
  //   }
  //   else if (max > 0) {
  //     return self.then(function(x) {
  //       return self.times(0, max - 1).then(function(xs) {
  //         return [x].concat(xs);
  //       });
  //     }).or(succeed([]));
  //   }
  //   else return succeed([]);
  // };
  _.times = function(min, max) {
    if (arguments.length < 2) max = min;
    var self = this;

    return Parser(function(stream, i) {
      var accum = [];
      var start = i;
      var result;
      var prevResult;

      for (var times = 0; times < min; times += 1) {
        result = self._(stream, i);
        prevResult = mergeReplies(result, prevResult);
        if (result.status) {
          i = result.index;
          accum.push(result.value);
        }
        else return prevResult;
      }

      for (; times < max; times += 1) {
        result = self._(stream, i);
        prevResult = mergeReplies(result, prevResult);
        if (result.status) {
          i = result.index;
          accum.push(result.value);
        }
        else break;
      }

      return mergeReplies(makeSuccess(i, accum), prevResult);
    });
  };

  // -*- higher-level combinators -*- //
  _.result = function(res) { return this.map(function(_) { return res; }); };
  _.atMost = function(n) { return this.times(0, n); };
  _.atLeast = function(n) {
    var self = this;
    return seqMap(this.times(n), this.many(), function(init, rest) {
      return init.concat(rest);
    });
  };

  _.map = function(fn) {
    var self = this;
    return Parser(function(stream, i) {
      var result = self._(stream, i);
      if (!result.status) return result;
      return mergeReplies(makeSuccess(result.index, fn(result.value)), result);
    });
  };

  _.skip = function(next) {
    return seq(this, next).map(function(results) { return results[0]; });
  };

  _.mark = function() {
    return seqMap(index, this, index, function(start, value, end) {
      return { start: start, value: value, end: end };
    });
  };

  _.desc = function(expected) {
    var self = this;
    return Parser(function(stream, i) {
      var reply = self._(stream, i);
      if (!reply.status) reply.expected = [expected];
      return reply;
    });
  };

  // -*- primitive parsers -*- //
  var string = Parsimmon.string = function(str) {
    var len = str.length;
    var expected = "'"+str+"'";

    return Parser(function(stream, i) {
      var head = stream.slice(i, i+len);

      if (head === str) {
        return makeSuccess(i+len, head);
      }
      else {
        return makeFailure(i, expected);
      }
    });
  };

  var regex = Parsimmon.regex = function(re, group) {
    var anchored = RegExp('^(?:'+re.source+')', (''+re).slice((''+re).lastIndexOf('/')+1));
    var expected = '' + re;
    if (group == null) group = 0;

    return Parser(function(stream, i) {
      var match = anchored.exec(stream.slice(i));

      if (match) {
        var fullMatch = match[0];
        var groupMatch = match[group];
        if (groupMatch != null) return makeSuccess(i+fullMatch.length, groupMatch);
      }

      return makeFailure(i, expected);
    });
  };

  var succeed = Parsimmon.succeed = function(value) {
    return Parser(function(stream, i) {
      return makeSuccess(i, value);
    });
  };

  var fail = Parsimmon.fail = function(expected) {
    return Parser(function(stream, i) { return makeFailure(i, expected); });
  };

  var letter = Parsimmon.letter = regex(/[a-z]/i).desc('a letter')
  var letters = Parsimmon.letters = regex(/[a-z]*/i)
  var digit = Parsimmon.digit = regex(/[0-9]/).desc('a digit');
  var digits = Parsimmon.digits = regex(/[0-9]*/)
  var whitespace = Parsimmon.whitespace = regex(/\s+/).desc('whitespace');
  var optWhitespace = Parsimmon.optWhitespace = regex(/\s*/);

  var any = Parsimmon.any = Parser(function(stream, i) {
    if (i >= stream.length) return makeFailure(i, 'any character');

    return makeSuccess(i+1, stream.charAt(i));
  });

  var all = Parsimmon.all = Parser(function(stream, i) {
    return makeSuccess(stream.length, stream.slice(i));
  });

  var eof = Parsimmon.eof = Parser(function(stream, i) {
    if (i < stream.length) return makeFailure(i, 'EOF');

    return makeSuccess(i, null);
  });

  var test = Parsimmon.test = function(predicate) {
    return Parser(function(stream, i) {
      var char = stream.charAt(i);
      if (i < stream.length && predicate(char)) {
        return makeSuccess(i+1, char);
      }
      else {
        return makeFailure(i, 'a character matching '+predicate);
      }
    });
  };

  var oneOf = Parsimmon.oneOf = function(str) {
    return test(function(ch) { return str.indexOf(ch) >= 0; });
  };

  var noneOf = Parsimmon.noneOf = function(str) {
    return test(function(ch) { return str.indexOf(ch) < 0; });
  };

  var takeWhile = Parsimmon.takeWhile = function(predicate) {
    return Parser(function(stream, i) {
      var j = i;
      while (j < stream.length && predicate(stream.charAt(j))) j += 1;
      return makeSuccess(j, stream.slice(i, j));
    });
  };

  var lazy = Parsimmon.lazy = function(desc, f) {
    if (arguments.length < 2) {
      f = desc;
      desc = undefined;
    }

    var parser = Parser(function(stream, i) {
      parser._ = f()._;
      return parser._(stream, i);
    });

    if (desc) parser = parser.desc(desc)

    return parser;
  };

  var index = Parsimmon.index = Parser(function(stream, i) {
    return makeSuccess(i, i);
  });

  //- fantasyland compat

  //- Monoid (Alternative, really)
  _.concat = _.or;
  _.empty = fail('empty')

  //- Applicative
  _.of = Parser.of = Parsimmon.of = succeed

  _.ap = function(other) {
    return seqMap(this, other, function(f, x) { return f(x); })
  };

  //- Monad
  _.chain = function(f) {
    var self = this;
    return Parser(function(stream, i) {
      var result = self._(stream, i);
      if (!result.status) return result;
      var nextParser = f(result.value);
      return mergeReplies(nextParser._(stream, result.index), result);
    });
  };

  return Parser;
})();
module.exports = Parsimmon;

},{}],3:[function(require,module,exports){
module.exports = require('./build/parsimmon.commonjs');
exports.version = require('./package.json').version;

},{"./build/parsimmon.commonjs":2,"./package.json":4}],4:[function(require,module,exports){
module.exports={
  "_args": [
    [
      {
        "name": "parsimmon",
        "raw": "parsimmon@0.7.0",
        "rawSpec": "0.7.0",
        "scope": null,
        "spec": "0.7.0",
        "type": "version"
      },
      "D:\\Users\\David\\Documents\\EscaleDigitale\\simpleSqlParser"
    ]
  ],
  "_from": "parsimmon@0.7.0",
  "_id": "parsimmon@0.7.0",
  "_inCache": true,
  "_installable": true,
  "_location": "/parsimmon",
  "_npmUser": {
    "email": "jjmadkisson@gmail.com",
    "name": "jayferd"
  },
  "_npmVersion": "1.4.14",
  "_phantomChildren": {},
  "_requested": {
    "name": "parsimmon",
    "raw": "parsimmon@0.7.0",
    "rawSpec": "0.7.0",
    "scope": null,
    "spec": "0.7.0",
    "type": "version"
  },
  "_requiredBy": [
    "/"
  ],
  "_resolved": "https://registry.npmjs.org/parsimmon/-/parsimmon-0.7.0.tgz",
  "_shasum": "652fc7cbade73c5edb42a266ec556c906d82c9fb",
  "_shrinkwrap": null,
  "_spec": "parsimmon@0.7.0",
  "_where": "D:\\Users\\David\\Documents\\EscaleDigitale\\simpleSqlParser",
  "author": {
    "email": "jneen at jneen dot net",
    "name": "Jeanine Adkisson"
  },
  "bugs": {
    "url": "https://github.com/jneen/parsimmon/issues"
  },
  "dependencies": {
    "pjs": "5.x"
  },
  "description": "A monadic LL(infinity) parser combinator library",
  "devDependencies": {
    "chai": "1.5.x",
    "mocha": "1.8.x",
    "uglify-js": "2.x"
  },
  "directories": {},
  "dist": {
    "shasum": "652fc7cbade73c5edb42a266ec556c906d82c9fb",
    "tarball": "https://registry.npmjs.org/parsimmon/-/parsimmon-0.7.0.tgz"
  },
  "files": [
    "index.js",
    "src",
    "test",
    "Makefile",
    "package.json",
    "build/parsimmon.commonjs.js",
    "build/parsimmon.browser.js",
    "build/parsimmon.browser.min.js"
  ],
  "homepage": "https://github.com/jneen/parsimmon",
  "keywords": [
    "parsing",
    "parse",
    "parser combinators"
  ],
  "main": "index.js",
  "maintainers": [
    {
      "email": "jjmadkisson@gmail.com",
      "name": "jayferd"
    },
    {
      "email": "jneen@jneen.net",
      "name": "jneen"
    }
  ],
  "name": "parsimmon",
  "optionalDependencies": {},
  "readme": "ERROR: No README data found!",
  "repository": {
    "type": "git",
    "url": "git://github.com/jneen/parsimmon.git"
  },
  "scripts": {
    "test": "make test"
  },
  "version": "0.7.0"
}

},{}],5:[function(require,module,exports){
'use strict';

module.exports = function(astObject) {
	/*if (typeof ast === 'object' && ast.status === true) ast = ast.value;
	else return false;*/
	if (typeof astObject !== 'object' || astObject.status !== true) return false;

	function select(ast) {
		var result = 'SELECT ';
		result += ast.select.map(function(item) {
			return item.expression;
		}).join(', ');
		return result;
	}

	function from(ast) {
		var result = '';
		if (ast.from.length > 0) {
			result += 'FROM ';
			result += ast.from.map(function(item) {
				return item.expression;
			}).join(', ');
		}
		return result;
	}

	function join(ast) {
		return ast.join.map(function(item) {
			var result = '';
			if (item.type === 'inner') result += 'INNER JOIN ';
			else if (item.type === 'left') result += 'LEFT JOIN ';
			else if (item.type === 'right') result += 'RIGHT JOIN ';
			else return '';
			result += item.table;
			if (item.alias !== null) result += ' AS ' + item.alias;
			result += ' ON ';
			result += item.condition.expression;
			return result;
		}).join(' ');
	}

	function where(ast) {
		var result = '';
		if (ast.where !== null) result += 'WHERE ' + ast.where.expression;
		return result;
	}

	function group(ast) {
		var result = '';
		if (ast.group.length > 0) {
			result += 'GROUP BY ';
			result += ast.group.map(function(item) {
				return item.expression;
			}).join(', ');
		}
		return result;
	}

	function order(ast) {
		var result = '';
		if (ast.order.length > 0) {
			result += 'ORDER BY ';
			result += ast.order.map(function(item) {
				return item.expression;
			}).join(', ');
		}
		return result;
	}

	function limit(ast) {
		var result = '';
		if (ast.limit !== null) {
			result += 'LIMIT ';
			if (ast.limit.from !== null) result += ast.limit.from + ', ';
			result += ast.limit.nb;
		}
		return result;
	}

	function into(ast) {
		return 'INSERT INTO ' + ast.into.expression;
	}

	function values(ast) {
		var result = '';
		var targets = ast.values.filter(function(item) {
			return item.target !== null;
		});
		if (targets.length > 0) {
			result += '(';
			result += targets.map(function(item) {
				return item.target.expression;
			}).join(', ');
			result += ') ';
		}
		result += 'VALUES (';
		result += ast.values.map(function(item) {
			return item.value;
		}).join(', ');
		result += ')';
		return result;
	}

	function table(ast) {
		return 'UPDATE ' + ast.table.expression;
	}

	function update(ast) {
		var result = 'SET ';
		result += ast.values.map(function(item) {
			return item.target.expression + ' = ' + item.value;
		}).join(', ');
		return result;
	}

	var ast = astObject.value;
	var parts = [];
	if (ast.type === 'select') {
		parts.push(select(ast));
		parts.push(from(ast));
		parts.push(join(ast));
		parts.push(where(ast));
		parts.push(group(ast));
		parts.push(order(ast));
		parts.push(limit(ast));
	}
	else if (ast.type === 'insert') {
		parts.push(into(ast));
		parts.push(values(ast));
	}
	else if (ast.type === 'update') {
		parts.push(table(ast));
		parts.push(update(ast));
		parts.push(where(ast));
	}
	else if (ast.type === 'delete') {
		parts.push('DELETE');
		parts.push(from(ast));
		parts.push(where(ast));
	}
	else return false;

	return parts.filter(function(item) {
		return item !== '';
	}).join(' ');
};

},{}],6:[function(require,module,exports){
'use strict';
var Parsimmon = require('parsimmon');

/********************************************************************************************
	ALIASES
********************************************************************************************/

var seq = Parsimmon.seq;
var alt = Parsimmon.alt;
var regex = Parsimmon.regex;
var string = Parsimmon.string;
var optWhitespace = Parsimmon.optWhitespace;
var whitespace = Parsimmon.whitespace;
var lazy = Parsimmon.lazy;



/********************************************************************************************
	COMMON PATTERNS
********************************************************************************************/

// Make a parser optionnal
// "empty" parameter will be returned as result if the optionnal parser can't match
function opt(parser, empty) {
	if (typeof empty == 'undefined') return parser.or(Parsimmon.succeed([]));
	return parser.or(Parsimmon.succeed(empty));
}

// Join results of a parser
function mkString(node) {
	return node.join('');
}

// Add an item to an optionnal list and return the final list
function mergeOptionnalList(node) {
	node[0].push(node[1]);
	return node[0];
}

// Generate a parser that accept a comma-separated list of something
function optionnalList(parser) {
	return seq(
		parser.skip(optWhitespace).skip(string(',')).skip(optWhitespace).many(),
		parser.skip(optWhitespace)
	).map(mergeOptionnalList);
}

// Remove first and last character of a string
function removeQuotes(str) {
	return str.replace(/^([`'"])(.*)\1$/, '$2');
}

// Add the starting and ending char positions of matches of a given parser
function getPos(parser) {
	return seq(
		Parsimmon.index,
		parser,
		Parsimmon.index
	).map(function(node) {
		var pos = {
			start: node[0],
			end: node[2],
		};
		if (typeof node[1] == 'object') {
			var n = node[1];
			n.position = pos;
			return n;
		}
		else {
			pos.out = node[1];
			return pos;
		}
	});
}



/********************************************************************************************
	LOW LEVEL PARSERS
********************************************************************************************/

// The name of a column/table
var colName = alt(
	regex(/(?!(FROM|WHERE|GROUP BY|ORDER BY|LIMIT|INNER|LEFT|RIGHT|JOIN|ON|VALUES|SET)\s)[a-z*][a-z0-9_]*/i),
	regex(/`[^`\\]*(?:\\.[^`\\]*)*`/)
);

// A string
var str = alt(
	regex(/"[^"\\]*(?:\\.[^"\\]*)*"/),
	regex(/'[^'\\]*(?:\\.[^'\\]*)*'/)
);

// A function expression
var func = seq(
	alt(
		regex(/[a-zA-Z0-9_]+\(/),
		string('(')
		),
	/*eslint-disable no-use-before-define*/
	opt(lazy(function() {
		return argList;
	})).map(mkString),
	/*eslint-enable no-use-before-define*/
	string(')')
).map(mkString);

// A table.column expression
var tableAndColumn = seq(
	colName,
	string('.'),
	colName
);

// An operator
var operator = alt(
	string('+'),
	string('-'),
	string('*'),
	string('/'),
	string('&&'),
	string('&'),
	string('~'),
	string('||'),
	string('|'),
	string('^'),
	regex(/XOR/i),
	string('<=>'),
	string('='),
	string('!='),
	string('>='),
	string('>>'),
	string('>'),
	string('<='),
	string('<<'),
	string('<'),
	regex(/IS NULL/i),
	regex(/IS NOT/i),
	regex(/IS NOT NULL/i),
	regex(/IS/i),
	regex(/LIKE/i),
	regex(/NOT LIKE/i),
	string('%'),
	regex(/MOD/i),
	regex(/NOT/i),
	regex(/OR\s/i),	// A space is forced after so this doesn't get mixed up with ORDER BY
	regex(/AND/i),
	regex(/IN/i)
);

// A number
var number = regex(/[-]?\d+\.?\d*/);



/********************************************************************************************
	EXPRESSION PARSERS
********************************************************************************************/

// List (following IN, for example)
var list = seq(
	string('('),
	optWhitespace,
	seq(
		alt(
			number,
			str
		),
		optWhitespace,
		opt(string(',')),
		optWhitespace,
		opt(
			alt(
				number,
				str
			)
		)
	).map(mkString),
	optWhitespace,
	string(')')
).map(mkString);

// Expression
var expression = seq(
	alt(
		tableAndColumn.map(function(node) {
			return {
				expression: node.join(''),
				table: removeQuotes(node[0]),
				column: removeQuotes(node[2]),
			};
		}),
		func.map(function(node) {
			return {
				expression: node,
				table: null,
				column: null,
			};
		}),
		colName.map(function(node) {
			return {
				expression: node,
				table: null,
				column: removeQuotes(node),
			};
		}),
		str.map(function(node) {
			return {
				expression: node,
				table: null,
				column: null,
			};
		}),
		number.map(function(node) {
			return {
				expression: node,
				table: null,
				column: null,
			};
		}),
		list.map(function(node) {
			return {
				expression: node,
				table: null,
				column: null,
			};
		})
	),
	opt(seq(
		optWhitespace,
		operator,
		opt(seq(
			optWhitespace,
			lazy(function() {
				return expression;
			}).map(function(node) {
				return node.expression;
			})
		).map(mkString), null)
	).map(mkString), null)
).map(function(node) {
	if (node[1] !== null) {
		node[0] = node[0].expression;
		return {
			expression: node.join(''),
			table: null,
			column: null,
		};
	}
	else return node[0];
});

// Expression following a SELECT statement
var colListExpression = seq(
	expression,
	opt(	// Alias
		seq(
			optWhitespace,
			opt(regex(/AS\s/i)),
			alt(colName, str)
		).map(function(node) {
			var n = {};
			n.alias = removeQuotes(node[2]);
			n.expression = node.join('');
			return n;
		}),
		null
	)
).map(function(node) {
	var n = node[0];
	n.alias = (node[1] !== null) ? node[1].alias : null;
	n.expression += ((node[1] !== null) ? node[1].expression : '');
	return n;
});

// Expression inside a function
var argListExpression = expression.map(function(node) {
	return node.expression;
});

// Expression following a FROM statement
var tableListExpression = seq(
	alt(
		tableAndColumn.map(mkString),
		colName
	),
	opt(	// Alias
		seq(
			optWhitespace,
			opt(regex(/AS\s/i)),
			alt(colName, str)
		).map(function(node) {
			return {
				alias: removeQuotes(node[2]),
				expression: node.join(''),
			};
		}),
		null
	)
).map(function(node) {
	var n = {};
	n.table = node[0];
	n.alias = (node[1] !== null) ? node[1].alias : null;
	n.expression = node[0] + ((node[1] !== null) ? node[1].expression : '');
	return n;
});

// JOIN expression (including JOIN statements)
var joinExpression = seq(
	opt(seq(
		regex(/INNER|LEFT|RIGHT/i),
		whitespace
	).map(function(node) {
		return node[0].toLowerCase();
	}), null),
	regex(/JOIN/i),
	optWhitespace,
	getPos(tableListExpression),
	optWhitespace,
	regex(/ON/i),
	optWhitespace,
	getPos(expression)
).map(function(node) {
	var n = {};
	n.type = node[0] || 'inner';
	n.table = node[3].table;
	n.alias = node[3].alias;
	n.position = node[3].position;
	n.condition = {
		expression: node[7].expression,
		position: node[7].position,
	};
	return n;
});

// Expression following a WHERE statement
var whereExpression = getPos(expression).map(function(node) {
	return {
		expression: node.expression,
		position: node.position,
	};
});

// Expression following an ORDER BY statement
var orderListExpression = seq(
	expression,
	opt(seq(
		optWhitespace,
		regex(/ASC|DESC/i)
	), null)
).map(function(node) {
	return {
		expression: node[0].expression + ((node[1] !== null) ? node[1].join('') : ''),
		order: (node[1] !== null) ? node[1][1] : 'ASC',
		table: node[0].table,
		column: node[0].column,
	};
});

// Expression following a LIMIT statement
var limitExpression = seq(
	number,
	opt(seq(
		optWhitespace,
		string(','),
		optWhitespace,
		number
	), null)
).map(function(node) {
	if (node[1] === null) {
		return {
			from: null,
			nb: parseInt(node[0], 10),
		};
	}
	else {
		return {
			from: parseInt(node[0], 10),
			nb: parseInt(node[1][3], 10),
		};
	}
});

// Expression designating a column before VALUES in INSERT query
var insertColListExpression = alt(
	tableAndColumn.map(function(node) {
		return {
			expression: node.join(''),
			column: removeQuotes(node[2]),
		};
	}),
	colName.map(function(node) {
		return {
			expression: node,
			column: removeQuotes(node),
		};
	})
);

// Expression following a VALUES statement
var valueExpression = expression.map(function(node) {
	return node.expression;
});

// Expression that assign a value to a column
var assignExpression = seq(
	insertColListExpression,
	optWhitespace,
	string('='),
	optWhitespace,
	expression
).map(function(node) {
	return {
		target: node[0],
		value: node[4].expression,
	};
});



/********************************************************************************************
	HIGH LEVEL PARSERS
********************************************************************************************/

// List of arguments inside a function
var argList = seq(
	seq(argListExpression, optWhitespace, string(','), optWhitespace).map(mkString).many(),
	argListExpression.skip(optWhitespace)
).map(mergeOptionnalList);

// List of expressions following a SELECT statement
var colList = optionnalList(getPos(colListExpression));

// List of table following a FROM statement
var tableList = optionnalList(getPos(tableListExpression));

// List of table following an GROUP BY statement
var groupList = optionnalList(getPos(expression));

// List of table following an ORDER BY statement
var orderList = optionnalList(getPos(orderListExpression));

// List of joins (including JOIN statements)
var joinList = optWhitespace.then(joinExpression).skip(optWhitespace).many();

// List of columns before VALUES in INSERT query
var insertColList = optionnalList(insertColListExpression);

// List of values following a VALUES statement
var valuesList = optionnalList(valueExpression);

// List of assign expression following a SET statement
var assignList = optionnalList(assignExpression);



/********************************************************************************************
	MAIN PARSERS
********************************************************************************************/

// SELECT parser
var selectParser = seq(
	regex(/SELECT/i).skip(optWhitespace).then(opt(colList)),
	opt(regex(/FROM/i).skip(optWhitespace).then(opt(tableList)), []),
	opt(joinList),
	opt(regex(/WHERE/i).skip(optWhitespace).then(opt(whereExpression)), null),
	opt(regex(/\s?GROUP BY/i).skip(optWhitespace).then(opt(groupList))),
	opt(regex(/\s?ORDER BY/i).skip(optWhitespace).then(opt(orderList))),
	opt(regex(/\s?LIMIT/i).skip(optWhitespace).then(opt(limitExpression)), null)
).map(function(node) {
	return {
		type: 'select',
		select: node[0],
		from: node[1],
		join: node[2],
		where: node[3],
		group: node[4],
		order: node[5],
		limit: node[6],
	};
});

// INSERT parser
var insertParser = seq(
	regex(/INSERT INTO/i).skip(optWhitespace).then(tableListExpression),
	optWhitespace,
	opt(
		seq(
			string('('),
			insertColList,
			string(')')
		).map(function(node) {
			return node[1];
		})
	),
	optWhitespace,
	regex(/VALUES\s?\(/i).skip(optWhitespace).then(valuesList),
	string(')')
).map(function(node) {
	var values = [];
	var bigger = Math.max(node[2].length, node[4].length);

	for (var i = 0; i < bigger; ++i) {
		values[i] = {
			target: node[2][i] || null,
			value: node[4][i] || null,
		};
	}

	return {
		type: 'insert',
		into: node[0],
		values: values,
	};
});

// UPDATE parser
var updateParser = seq(
	regex(/UPDATE/i).skip(optWhitespace).then(tableListExpression),
	optWhitespace,
	regex(/SET/i).skip(optWhitespace).then(assignList),
	optWhitespace,
	opt(regex(/WHERE/i).skip(optWhitespace).then(opt(whereExpression)), null)
).map(function(node) {
	return {
		type: 'update',
		table: node[0],
		values: node[2],
		where: node[4],
	};
});

// DELETE parser
var deleteParser = seq(
	regex(/DELETE FROM/i).skip(optWhitespace).then(opt(tableList)),
	opt(regex(/WHERE/i).skip(optWhitespace).then(opt(whereExpression)), null)
).map(function(node) {
	return {
		type: 'delete',
		from: node[0],
		where: node[1],
	};
});

// Main parser
var p = alt(selectParser, insertParser, updateParser, deleteParser);



/********************************************************************************************
	PUBLIC FUNCTIONS
********************************************************************************************/

module.exports = function(sql) {
	var result = p.parse(sql);
	if (result.status === false) result.error = Parsimmon.formatError(sql, result);
	return result;
};

},{"parsimmon":3}]},{},[1])(1)
});