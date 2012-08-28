var fs = require("fs"),
	jshint = require("jshint").JSHINT,
	targets = [
		"src/js/ui.coverflow.js"
	],
	config = {
		// unfiltered forin
		forin : true,
		// allow the new keyword
		nonew : false,
		evil : true,
		browser : true,
		// allow == null
		eqnull : true,
		expr : true,
		curly : true,
		// no trailing ws
		trailing : true,
		// don't tell me how to format my code buddy..
		strict : false,
		// crockfords whitespace settings - NOPE
		white : false,
		// no undefined vars
		undef : true,
		smarttabs : true,
		noarg : true,
		noempty : true,
		// require ===
		eqeqeq : true,
		// no bitwise operators plz
		bitwise : true,
		indent : 4,
		nomen : false,
		laxbreak : true,
		loopfunc : true,
		predef : [
			"jQuery",
			"Modernizr"
		],
		maxerr: 100
	},
	content = "";

(function() {
	if( typeof jshint == "undefined") {
		console.log("Install JSHint first - run `npm install -g jshint` as root.");
		return;
	}

	targets.forEach( function( file, key ) {
		content = fs.readFileSync( file , "utf8");
		if ( !! content && jshint( content, config ) ) {
			console.log( "JSHint check passed for file: " + file );
		} else {
			console.log( "JSHint found errors." );
			jshint.errors.forEach(function( e ) {
				if ( !e ) { return; }
				var str = e.evidence ? e.evidence : "",
				character = e.character === true ? "EOL" : "C" + e.character;
				if ( str ) {
					str = str.replace( /\t/g, " " ).trim();
					console.log( file + ": [line " + e.line + ":" + character + "] " + e.reason + "\n  " + str + "\n");
				}
			});
		}
	});
})();
