var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

exports.config = {
    capabilities: {'browserName': 'chrome'},
    /*multiCapabilities: [
        {'browserName': 'chrome'},
        {'browserName': 'firefox'},
        {'browserName': 'opera'},
        {'browserName': 'safari'}
    ],*/
    framework: 'jasmine2',
    jasmineNodeOpts: {
        showColors: true
    },
    seleniumPort: 4840,

    /* Due to issues with slow Selenium startup due to RNG, see http://stackoverflow.com/questions/14058111/selenium-server-doesnt-bind-to-socket-after-being-killed-with-sigterm. */
    seleniumArgs: ["-Djava.security.egd=file:/dev/./urandom"],

    onPrepare: function() {
        browser.driver.manage().window().setSize(1440, 800);
        browser.get('http://localhost:8000/#');
        // Add a screenshot reporter and store screenshots to `/tmp/screnshots`:
        jasmine.getEnv().addReporter(
            new HtmlScreenshotReporter({
                dest: 'target/screenshots',
                filename: 'failed-reports.html',
                ignoreSkippedSpecs: true,
                reportOnlyFailedSpecs: false,
                captureOnlyFailedSpecs: true
                /*pathBuilder: function(currentSpec, suites, browserCapabilities) {
                    // will return chrome/your-spec-name.png
                    return browserCapabilities.get('browserName') + '/' + currentSpec.fullName;
                },
                metadataBuilder: function(currentSpec, suites, browserCapabilities) {
                    return { id: currentSpec.id, os: browserCapabilities.get('browserName') };
                }*/
            })
        );
    },
    suites: {
        login:  './login/*.test.js',
        header: './common/*.test.js',
        case:   './cases/*.test.js',
        users:  './users/*.test.js'
    }
};
