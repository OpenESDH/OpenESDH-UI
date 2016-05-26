var globalHeader = require('../common/globalHeader.po.js');
var loginPage = require('./loginPage.po.js');

describe('openESDH login page', function() {

    it('should be able to access login page and login to user dashboard', function() {
        console.log('\nshould be able to access login page and login to user dashboard');
        loginPage.login(true);
        //detect the userMenu button
        expect(globalHeader.getHeaderMenuItem().userMenuBtn);
        loginPage.logout();
    });
});