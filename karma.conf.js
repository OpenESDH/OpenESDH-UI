module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-aria/angular-aria.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-material/angular-material.js',
      'app/src/**/*.js'
    ],

    autoWatch : false,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    singleRun: true,

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
