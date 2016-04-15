var globalHeaderMenu = require('../common/globalHeader.po.js');

var LoginPage = function() {

    var public = {};

    /**
     * Default login as admin.
     */
    public.login = function(noLog) {
        if (!noLog) {
            console.log('\n');
        }
        public.loginAs(browser.params.loginDetails.admin.username, browser.params.loginDetails.admin.password);
    };

    public.loginAsAdmin = function() {
        public.loginAs(browser.params.loginDetails.admin.username, browser.params.loginDetails.admin.password);
    };

    public.loginAsUser = function(user) {
        public.loginAs(browser.params.loginDetails[user].username, browser.params.loginDetails[user].password);
    };

    /**
     * Lpgin as an arbitral user
     * @param userName
     * @param password
     */
    public.loginAs = function(userName, password) {
        //following PageObject pattern define the functions here.
        browser.get('http://localhost:8000');
        //The fields
        var userNameInput = element(by.model('vm.credentials.username'));
        var passwordInput = element(by.model('vm.credentials.password'));
        var loginBtn = element(by.css('[ng-click="vm.login(vm.credentials)"]')).click();

        userNameInput.sendKeys(userName);
        passwordInput.sendKeys(password);
        loginBtn.click();
        browser.driver.sleep(2000);
    };

    public.logout = function(timeoutBefore, timeoutAfter) {
        browser.driver.sleep(timeoutBefore || 1000);//e.g. wait for toast message to hide
        globalHeaderMenu.getHeaderMenuItem().userMenuBtn.click();
        element(by.xpath('//button[@id="logout"]')).click();
        browser.driver.sleep(timeoutAfter || 1000);
    };

    return public;
};

module.exports = LoginPage();
