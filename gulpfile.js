var gulp 		= require('gulp'),
	jshint		= require('gulp-jshint'),
	webserver 	= require('gulp-webserver');

// Config vars
// If, after a while, there are a lot of config vars, we can move these to a separate file
var environment = {
	test: { proxy: 'http://test.openesdh.dk' },
	demo: { proxy: 'http://demo.openesdh.dk' },
	local: { proxy: 'http://localhost:8080'	}
};

var paths = {
	scripts: ['app/src/**/*.js'],
	css: []
};

// Setting up a local webserver
function createWebserver(config) {
	return gulp.src('./')
			.pipe(webserver({
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
			.pipe(jshint('.jshintrc'))
			.pipe(jshint.reporter('jshint-stylish'));
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