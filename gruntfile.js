var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function(grunt) {
  var files =	[ './js/**/*.js'
				, './TactHab_modules/**/*.js'
				// , './test/**/*.js'
				, '!./js/require.js'
				, '!./js/domReady.js'
				, '!./js/async.js'
				, '!./js/requirejs-plugins/**/*.js'
				];
  // Project configuration.
  grunt.initConfig({
    // This line makes your node configurations available for use
    pkg: grunt.file.readJSON('package.json'),
	webpack: {
		editor: {
			// webpack options
			entry	: {
				bundleEditor: "./test/testEditor.js"
			},
			output	: {
				path	: "./test/",
				filename: "[name].js",
			},
			stats: {
				// Configure the console output
				colors	: true,
				// modules	: true,
				// reasons	: true
			},
			module: {
				loaders: [
					{ test	: /\.css$/	
					, loader: ExtractTextPlugin.extract("style-loader", "css-loader")
					}
					 // {test: /\.html$/, loader: "raw!" }
					// {test: /\.css$/	, loader: "style!css" },
					//
				]
			},
			plugins: [ new ExtractTextPlugin("[name].css")
					 ],
			progress	: true,
			failOnError	: true
		},
	},
    eslint: {
		src   : files,
		options	: {
			config	: "eslint.json"
		}
    },
	flow: {
		files: files
		
	},
	// This is where we configure JSHint
    jshint: {
      // You get to make the name
      // The paths tell JSHint which files to validate
      myFiles: files,
	  options: {
				  "undef"		: true,
				  "unused"		: true,
				  "laxbreak"	: true,
				  "laxcomma"	: true,
				  "asi"			: true,
				  "esnext"		: true,
				  "devel"		: true,
				  "latedef"		: true,
				  "undef"		: true,
				  "unused"		: "vars",
				  "globals"		: { "document"	: false
								  , "__dirname"	: false
								  , "require"	: false
								  , "setTimeout"	: false
								  , "clearTimeout"	: false
								  , "clearInterval"	: false
								  , "exports"		: false
								  , "DOMParser"		: false
								  , "process"		: false
								  , "module"		: true
								  , "XMLHttpRequest": false
								  , "FormData"		: false
								  , "setInterval"	: false
								  , "Int8Array"		: false
								  }
				}
    },
    watch: {
      files: files,
      tasks: ['eslint', 'jshint', 'webpack']
    }
  });
  // Each plugin must be loaded following this pattern
  grunt.loadNpmTasks("gruntify-eslint");
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks("grunt-webpack");
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  grunt.registerTask('default', ['eslint', 'jshint', 'webpack', 'watch']);
 };
 