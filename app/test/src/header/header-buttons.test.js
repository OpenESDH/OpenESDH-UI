describe('openESDH header', function() {
    it('should display all widgets in the global header', function() {
        var globalHeader = require('../pages/GlobalHeader.js');
        var loginPageBuilder = require('../pages/LoginPage.js');
        var loginPage = loginPageBuilder.getLoginPage();
        loginPage.login();

        expect(globalHeader.getHeaderMenuItem().dashboardBtn);
        expect(globalHeader.getHeaderMenuItem().casesBtn);
        expect(globalHeader.getHeaderMenuItem().tasksBtn);
        expect(globalHeader.getHeaderMenuItem().searchBoxInput);
        expect(globalHeader.getHeaderMenuItem().userMenuBtn);

        //wait for 4 secs just in case
        browser.driver.sleep(4000);
        loginPage.logout();
    });
});