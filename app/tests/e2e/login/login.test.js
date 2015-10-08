describe('openESDH login page', function() {

    var globalHeader = require('../common/globalHeader.po.js');
    var loginPageBuilder = require('./loginPage.po.js');
    var loginPage = loginPageBuilder.getLoginPage();

    it('should be able to access login page and login to user dashboard', function() {
        loginPage.login();
        //detect the userMenu button
        expect(globalHeader.getHeaderMenuItem().userMenuBtn);
        loginPage.logout();
    });
});