var globalHeaderMenu = require('../common/globalHeader.po.js');

var LoginPage = function () {
    
    var public = {};

    /**
     * Default login as admin.
     */
    public.login = function() {
        public.loginAs(browser.params.loginDetails.admin.username, browser.params.loginDetails.admin.password);
    };

    public.loginAsAdmin = function () {
        public.loginAs(browser.params.loginDetails.admin.username, browser.params.loginDetails.admin.password);
    };

    public.loginAsUser = function () {
        public.loginAs(browser.params.loginDetails.user.username, browser.params.loginDetails.user.password);
    }

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

    public.logout = function() {
        globalHeaderMenu.getHeaderMenuItem().userMenuBtn.click();
        element(by.xpath('//button[@id="logout"]')).click();
        browser.driver.sleep(2000);
    };

    return public;
};

module.exports = LoginPage();
