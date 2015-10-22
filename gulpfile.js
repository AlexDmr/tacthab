var gulp				= require('gulp')
  , gutil				= require("gulp-util")
  , eslint				= require('gulp-eslint')
  , webpack				= require("webpack")
  , ExtractTextPlugin	= require("extract-text-webpack-plugin")
  , uglify				= require('gulp-uglify')
  , watch				= require('gulp-watch')
  , cached				= require('gulp-cached')
  , remember			= require('gulp-remember')
  , jshint				= require('gulp-jshint')
  , stylish				= require('jshint-stylish-ex')
  , jshintOptions		= {	"laxbreak"	: true,
							"laxcomma"	: true,
							"asi"		: true,
							"esnext"	: true,
							"devel"		: true,
							"latedef"	: true,
							"undef"		: true,
							"unused"	: "vars",
							"globals"	: { "document"		: false
										  , "$"				: false
										  , "angular"		: false
										  , "__dirname"		: false
										  , "require"		: false
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
										  , "google"		: false
										  , "window"		: false
										  , "webkitSpeechRecognition"	: false
										  , "SpeechSynthesisUtterance"	: false
										  , "speechSynthesis"			: false
										  }
							}
  ;

function swallowError (error) {
	console.error("ESLINT:", error.toString());
	this.emit('end');
}

gulp.task('lint', function () {
    return gulp.src	( [ 'js/**/*.js'
					  , 'TactHab_modules/**/*.js'
					  , 'Server/**/*.js'
					  , '!./js/domReady.js'
					  , '!./js/async.js'
					  ]
					)
		.pipe(cached('scripts'))
		.pipe(jshint(jshintOptions))
		.pipe(jshint.reporter(stylish))
        // .pipe(eslint())
		// .on('error', swallowError)
        // .pipe(eslint.format())
        // .pipe(eslint.failOnError())
		.pipe(remember('scripts'))
		;
});

gulp.task("webpack", function(callback) {
    // run webpack
    webpack({
			entry	: {
				bundleEditor			: "./test/testEditor.js"
			},
			output	: {
				path			: "./test/",
				filename		: "[name].js",
			},
			progress: false,
			stats: {
				colors			: true ,
				modules			: false,
				reasons			: false
			},
			module	: {
				loaders: [
					{ test	: /\.css$/	, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
					{ test	: /\.html$/	, loader: 'raw-loader'},
					{ test: /\.(png|woff|jpg|jpeg|gif)$/, loader: 'url-loader?limit=100000' }
				]
			},
			plugins: [ new ExtractTextPlugin("[name].css")
					 ],
			failOnError	: false
    }, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log( "[webpack]"
				 , stats.toString( { colors		: true
								   , modules	: false
								   , chunck		: false
								   }
								 )
				 );
        callback();
    });
});




var filesToWatch =	[ 'css/**/*.css'
					, 'js/**/*.js'
					, 'js/**/*.css'
					, 'TactHab_modules/**/*.js'
					, 'Server/**/*.js'
					];


gulp.task('watch', function () {
  var watcher = gulp.watch(filesToWatch, ['lint', 'webpack']);
  watcher.on('change', function (event) {
    if (event.type === 'deleted') {                   // if a file is deleted, forget about it
      delete cached.caches.scripts[event.path];       // gulp-cached remove api
      remember.forget('scripts', event.path);         // gulp-remember remove api
    }
  });
});

gulp.task('default', ['lint', 'webpack', 'watch'], function() {
	console.log("Done!");
});



