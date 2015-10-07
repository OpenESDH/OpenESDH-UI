var gulp = require('gulp'),
	$ 	 = require('gulp-load-plugins')();

// Config vars
// If, after a while, there are a lot of config vars, we can move these to a separate file
var environment = {
	test: { proxy: 'http://test.openesdh.dk' },
	demo: { proxy: 'http://demo.openesdh.dk' },
	local: { proxy: 'http://localhost:8080'	}
};

var paths = {
	scripts: ['app/src/**/*.module.js', 'app/src/**/*.js', '!app/src/**/*Spec.js'],
	css: []
};

var dist = {
	name: 'opene-app',
	folder: './dist/'
}

// Setting up a local webserver
function createWebserver(config) {
	return gulp.src('./')
			.pipe($.webserver({
				open: true, // Open up a browser automatically
				proxies: [{
					source: '/alfresco', 
					target: config.proxy + '/alfresco'
				}]
			}));
};

// Script tasks
gulp.task('scripts', function () {
	return gulp.src(paths.scripts)
			//.pipe($.wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
			//.pipe($.jshint('.jshintrc'))
			//.pipe($.jshint.reporter('jshint-stylish'))
			.pipe($.concat(dist.name + '.js'))
			.pipe(gulp.dest(dist.folder))
			.pipe($.rename({ suffix: '.min' }))
            .pipe($.stripDebug())
            .pipe($.ngAnnotate())
            .pipe($.uglify())
            .pipe(gulp.dest(dist.folder))
            .on('error', $.util.log)
});

// Css
gulp.task('css', function () {
	// Nothing here yet
});

// Set up watchers
gulp.task('watch', function () {
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.css, ['css']);
});

/** ----------------
 * Gulp runner tasks
 * (tasks to run from the CLI)
 */
gulp.task('dev', ['scripts', 'css', 'watch'], function () {
	createWebserver(environment.test);
});

gulp.task('demo', ['scripts', 'css', 'watch'], function () {
	createWebserver(environment.demo);
});

gulp.task('local', ['scripts', 'css', 'watch'], function () {
	createWebserver(environment.local);
});

/*
	Running '$ gulp'
	is equal to running '$ gulp dev'
	In other words, the default task is the 'dev' task
*/
gulp.task('default', ['dev']);