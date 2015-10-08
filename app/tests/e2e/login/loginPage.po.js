var LoginPage = function () {
    var globalHeaderMenu = require('../common/globalHeader.po.js');


    return{
        login: login,
        loginAs: loginAs,
        logout: logout
    };

    /**
     * Default login as admin.
     *
     * TODO might want to abstract the password out to a file and pull that in as a dep
     */
    function login() {
        loginAs("admin", "admin");
    }

    /**
     * Lpgin as an arbitral user
     * @param userName
     * @param password
     */
    function loginAs(userName, password) {
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

    function logout() {
        globalHeaderMenu.getHeaderMenuItem().userMenuBtn.click();
        element(by.xpath('//button[@id="logout"]')).click();
        browser.driver.sleep(2000);
    }
};


module.exports.getLoginPage = function () {
    return new LoginPage();
};