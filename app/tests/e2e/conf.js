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
    },
    suites: {
        login:  './login/*.test.js',
        header: './common/*.test.js',
        case:   './cases/*.test.js',
        users:  './users/*.test.js'
    }
};
