var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

exports.config = {
    capabilities: {'browserName': 'chrome'},
    /*multiCapabilities: [
     {'browserName': 'chrome'},
     {'browserName': 'firefox'},
     {'browserName': 'opera'},
     {'browserName': 'safari'}
     ],*/

    //allScriptsTimeout: 30000,
    rootElement: "body",

    framework: 'jasmine2',
    jasmineNodeOpts: {
        showColors: true,
        isVerbose: true,
        includeStackTrace: true,
    },
    seleniumPort: 4840,

    /* Due to issues with slow Selenium startup due to RNG, see http://stackoverflow.com/questions/14058111/selenium-server-doesnt-bind-to-socket-after-being-killed-with-sigterm. */
    seleniumArgs: ["-Djava.security.egd=file:/dev/./urandom"],

    onPrepare: function () {
        browser.driver.manage().window().setSize(1440, 800);
        browser.get('http://localhost:8000/#');
        browser.getCapabilities().then(function (capabilities) {
            browser.capabilities = capabilities;
        });
        // Add a screenshot reporter and store screenshots to `/tmp/screnshots`:
        //see https://github.com/mlison/protractor-jasmine2-screenshot-reporter/issues/4
        /*jasmine.getEnv().addReporter(
            new HtmlScreenshotReporter({
                dest: 'target/screenshots',
                filename: 'failed-reports.html',
                ignoreSkippedSpecs: true,
                reportOnlyFailedSpecs: false,
                captureOnlyFailedSpecs: false,
                //pathBuilder: function(currentSpec, suites, browserCapabilities) {
                 // will return chrome/your-spec-name.png
                 //return browserCapabilities.get('browserName') + '/' + currentSpec.fullName;
                 //},
                 metadataBuilder: function(currentSpec, suites, browserCapabilities) {
                 return { id: currentSpec.id, os: browserCapabilities.get('browserName') };
                 }
            })
        );*/
    },
    suites: {
        login: './login/*.test.js',
        header: './common/*.test.js',
        case: './cases/*.test.js',
        users: './users/*.test.js'
    }
};