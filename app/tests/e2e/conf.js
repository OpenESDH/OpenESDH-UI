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