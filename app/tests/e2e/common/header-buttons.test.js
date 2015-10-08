describe('openESDH header', function() {

    var globalHeader = require('./globalHeader.po.js');
    var loginPageBuilder = require('../login/loginPage.po.js');
    var loginPage = loginPageBuilder.getLoginPage();

    //Executed before each of the "it" tests
    beforeEach(function() {
        loginPage.login();
    });

    it('should display all widgets in the global header', function() {
        expect(globalHeader.getHeaderMenuItem().dashboardBtn);
        expect(globalHeader.getHeaderMenuItem().casesBtn);
        expect(globalHeader.getHeaderMenuItem().tasksBtn);
        expect(globalHeader.getHeaderMenuItem().searchBoxInput);
        expect(globalHeader.getHeaderMenuItem().userMenuBtn);

    });

    afterEach(function() {
        loginPage.logout();
        //wait for 2 secs just in case
    });

});