var gulp = require('gulp'),
        $ = require('gulp-load-plugins')(),
        fs = require('fs'),
        proxy = require('http-proxy-middleware');

// Config vars
// If, after a while, there are a lot of config vars, we can move these to a separate file
var environment = {
    test: {
        proxy: 'http://test.openesdh.dk',
        spp: 'http://test.openesdh.dk:7070'
    },
    demo: {
        proxy: 'http://demo.openesdh.dk',
        spp: 'http://demo.openesdh.dk:7070'    
    },
    local: {
        proxy: 'http://localhost:8080',
        spp: 'http://localhost:7070'
    }
};

var paths = {
    scripts: ['app/src/**/*.module.js', 'app/src/**/*.js', '!app/src/**/*Spec.js', '!app/src/modules/test/**/*.js', '!app/src/modules/**/tests/**/*.js'],
    scss: ['app/src/app.scss', 'app/src/**/*.scss'],
    e2e_tests: ['app/tests/e2e/**/*test.js', 'app/src/modules/**/*test.js'],
    protractorConfigFile: 'app/tests/e2e/conf.js'
};

var dist = {
    name: 'opene-app',
    folder: './dist/'
};

var openeModules = [{
        sourceUrl: 'https://github.com/OpenESDH/openesdh-staff-ui.git',
        moduleName: 'staff',
        moduleId: 'openeApp.cases.staff'
    },
    {
        sourceUrl: 'https://github.com/OpenESDH/openesdh-doc-templates-ui.git',
        moduleName: 'doctemplates',
        moduleId: 'openeApp.doctemplates'
    },
    {
        //must be introduced after 'doctemplates'
        sourceUrl: 'https://github.com/OpenESDH/openesdh-addo-ui.git',
        moduleName: 'addo',
        moduleId: 'openeApp.addo'
    },
    {
        sourceUrl: 'https://github.com/OpenESDH/openesdh-project-rooms-ui.git',
        moduleName: 'projectRooms',
        moduleId: 'openeApp.projectRooms'
    },
    {
        sourceUrl: 'https://github.com/OpenESDH/openesdh-googledocs-ui.git',
        moduleName: 'googledocs',
        moduleId: 'openeApp.google.docs'
    },
    {
        sourceUrl: 'https://github.com/OpenESDH/openesdh-staff-templates-ui.git',
        moduleName: 'staffTemplates',
        moduleId: 'openeApp.staffTemplates'
    }];

var runOpeneModules = [];

// Setting up a local webserver
function createWebserver(config) {
    return gulp.src('./')
            .pipe($.webserver({
                open: false, // Open up a browser automatically
                host: '0.0.0.0', // hostname needed if you want to access the server from anywhere on your local network
                middleware: [
                   proxy('/alfresco/**/documentLibrary/**', {target: config.spp, changeOrigin: true})
                ],
                proxies: [{
                    source: '/alfresco/opene/cases',
                    target: config.spp + '/alfresco/opene/cases'
                },
                {
                        source: '/alfresco',
                        target: config.proxy + '/alfresco'
                    }]
            }));
}

function includeOpeneModules(content) {
    if (runOpeneModules.length === 0) {
        return content;
    }
    var modules = 'opene-modules\n            ' + runOpeneModules.join() + ',';
    return content.replace(/opene-modules/g, modules);
}

// Script tasks
gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
            .pipe($.wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
            //.pipe($.jshint('.jshintrc'))
            //.pipe($.jshint.reporter('jshint-stylish'))
            .pipe($.concat(dist.name + '.js'))
            .pipe($.change(includeOpeneModules))
            .pipe($.change(includeAppConfigParams))
            .pipe(gulp.dest(dist.folder))
            .pipe($.rename({suffix: '.min'}))
            .pipe($.stripDebug())
            .pipe($.ngAnnotate())
            .pipe($.uglify())
            .pipe(gulp.dest(dist.folder))
            .on('error', $.util.log);
});

// Css
gulp.task('css', function() {
    return gulp.src(paths.scss)
            .pipe($.wrap('/** ---------------- \n * Filepath: <%= file.relative %>\n */\n<%= contents %>'))
            .pipe($.concat(dist.name + '.scss'))
            .pipe($.sass())
            .pipe(gulp.dest(dist.folder))
            .pipe($.rename({suffix: '.min'}))
            .pipe($.minifyCss())
            .pipe(gulp.dest(dist.folder))
            .on('error', $.util.log);
});

// UI-test
gulp.task('e2e-tests', function() {
    gulp.src(paths.e2e_tests)
            .pipe($.protractor.protractor({
                configFile: paths.protractorConfigFile
            }))
            .on('error', function(e) {
                throw e;
            });
});

function includeAppConfigParams(content) {
    var argv = require('yargs').argv;
    if (argv.title) {
        content = content.replace("appName: 'OpenESDH'", "appName: '" + argv.title + "'");
    }
    if (argv.logo) {
        content = content.replace("logoSrc: './app/assets/images/logo-light.svg'", "logoSrc: '" + argv.logo + "'");
    }
    return content;
}

// Set up watchers
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.scss, ['css']);
});

/** ----------------
 * Gulp runner tasks
 * (tasks to run from the CLI)
 */

/*
 * This task is used to just build the scripts and css.
 * Useful if you want to deploy to production (e.g. with Apache).
 */
gulp.task('build', ['scripts', 'css']);

gulp.task('dev', ['build', 'watch'], function() {
    createWebserver(environment.test);
});

gulp.task('demo', ['build', 'watch'], function() {
    createWebserver(environment.demo);
});

gulp.task('local', ['build', 'watch'], function() {
    createWebserver(environment.local);
});

/* Tests */
gulp.task('ui-test', ['e2e-tests']);

/*
 Running '$ gulp'
 is equal to running '$ gulp dev'
 In other words, the default task is the 'dev' task
 */
gulp.task('default', ['dev']);

gulp.task('all-modules', openeModules.map(function(module) {
    return module.moduleName;
}));

gulp.task('all-modules-install', openeModules.map(function(module) {
    return module.moduleName + '-install';
}));

for (var i = 0; i < openeModules.length; i++) {
    var module = openeModules[i];
    installModuleTask(module);
    useModuleTask(module);
}

function installModuleTask(module) {
    gulp.task(module.moduleName + '-install', function() {
        console.log("Installing module", module.moduleName);
        installModule({
            sourceUrl: module.sourceUrl,
            moduleName: module.moduleName
        });
    });
}

function useModuleTask(module) {
    gulp.task(module.moduleName, function() {
        useOpeneModule({
            moduleName: module.moduleName,
            moduleId: module.moduleId
        });
    });
}

function useOpeneModule(opt) {
    if (fs.existsSync('./app/src/modules/' + opt.moduleName)) {
        runOpeneModules.push("'" + opt.moduleId + "'");
        return;
    }
    throw "No module found: " + opt.moduleName + ". Use gulp " + opt.moduleName + "-install";
}

function installModule(opt) {
    if (fs.existsSync('./app/src/modules/' + opt.moduleName)) {
        $.git.pull('origin', 'develop', {cwd: './app/src/modules/' + opt.moduleName}, function(err) {
            if (err)
                throw err;
            console.log("Module " + opt.moduleName + " updated.");
        });
    } else {
        $.git.clone(opt.sourceUrl, {args: './app/src/modules/' + opt.moduleName}, function(err) {
            if (err)
                throw err;
            console.log("Module " + opt.moduleName + " installed.");
        });

    }
}