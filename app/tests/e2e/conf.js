var env = require('./__appConf/environment.js');

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
    onPrepare: function() {
        browser.driver.manage().window().setSize(1440, 800);
    },
    suites: {
        login: './login/*.test.js',
        header: './common/*.test.js',
        case: './cases/*.test.js'
    }/*,
    specs: [
        './!**!/!*.test.js'
    ]*/
};