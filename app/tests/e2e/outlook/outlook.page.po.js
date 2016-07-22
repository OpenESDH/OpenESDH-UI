var OutlookIntegration = function () {
    var ret = {
            selectCaseTypeBtn: element(by.id("create-case-btn"))
    };
    
    // This method gets a web session id. Just like the outlook plugin authenticates.
    // No user info is stored in the sessionService.
    ret.plainLogin = function(){
        browser.get('http://localhost:8000');
        
        return browser.executeAsyncScript(function(username, password, callback) {
                var http = angular.element(document.body).injector().get('$http');
                http.post("/api/login", {
                    username: username,
                    password: password
                }).then(function(data){
                    callback(data);
                });
            }, 
            browser.params.loginDetails.admin.username, 
            browser.params.loginDetails.admin.password
        ).then(function (output) {
            //console.log("!!!! call back invoked");
            return output;
        });
    };
    
    ret.goToSaveMailInCasePage = function(){
        browser.get('http://localhost:8000/#/outlook');
    }
    
    return ret;
};

module.exports = OutlookIntegration();