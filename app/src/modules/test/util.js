var path = require('path');
var curDir = path.dirname(module.filename);
var appSrcIndex = curDir.lastIndexOf('\\app\\src');
if(appSrcIndex == -1){
    appSrcIndex = curDir.lastIndexOf('/app/src');
}
var appRootDir = curDir.substr(0, appSrcIndex);
var tests_base = appRootDir + '/app/tests/e2e';

module.exports = {
        tests_base: tests_base
};