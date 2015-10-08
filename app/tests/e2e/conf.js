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
    specs: [
        './**/*.test.js'
    ]
};