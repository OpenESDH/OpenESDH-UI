var LoginPage = function () {
    var globalHeaderMenu = require('./GlobalHeader.js');

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
        var userNameInput = element(by.xpath('//form//input[@id=\'input_0\']'));
        var passwordInput = element(by.xpath('//form//input[@id=\'input_1\']'));
        var loginBtn = element(by.xpath('//form/button')).click();

        userNameInput.sendKeys(userName);
        passwordInput.sendKeys(password);
        loginBtn.click();
        browser.driver.sleep(2);
        browser.waitForAngular();
    }

    function logout() {
        globalHeaderMenu.getHeaderMenuItem().userMenuBtn.click();
        element(by.xpath('//button[@id="logout"]')).click();
    }
};


module.exports.getLoginPage = function () {
    return new LoginPage();
};