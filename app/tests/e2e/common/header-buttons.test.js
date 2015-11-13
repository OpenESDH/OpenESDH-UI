var globalHeader = require('./globalHeader.po.js');
var loginPage = require('../login/loginPage.po.js');

describe('openESDH header', function() {

    //Executed before each of the "it" tests
    beforeEach(function() {
        loginPage.loginAsAdmin();
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