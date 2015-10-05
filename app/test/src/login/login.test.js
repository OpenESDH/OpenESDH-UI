describe('openESDH login page', function() {
    it('should be able to access login page and login to user dashboard', function() {
        browser.get('http://localhost:8000');

        var loginPageBuilder = require('../pages/LoginPage.js');
        var loginPage = loginPageBuilder.getLoginPage();
        loginPage.login();

        expect(element(by.buttonText("Administrator")) );
        browser.driver.sleep(2000);
        browser.waitForAngular();
        loginPage.logout();
    });
});