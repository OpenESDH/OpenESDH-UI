var globalHeaderMenu = require('../common/globalHeader.po.js');

var LoginPage = function () {
    
    var public = {};

    /**
     * Default login as admin.
     * TODO might want to abstract the password out to a file and pull that in as a dep
     */
    public.login = function() {
        public.loginAs("admin", "bullerfisk1992");
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
    }

    public.logout = function() {
        globalHeaderMenu.getHeaderMenuItem().userMenuBtn.click();
        element(by.xpath('//button[@id="logout"]')).click();
        browser.driver.sleep(2000);
    }

    return public;
};

module.exports = LoginPage();
