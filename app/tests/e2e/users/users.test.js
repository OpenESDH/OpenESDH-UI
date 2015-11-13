var userPage = require('./userPage.po.js');
var loginPage = require('../login/loginPage.po.js');

describe('openESDH case page tests', function () {

    //Executed before each of the "it" tests
    beforeEach(function () {
        loginPage.loginAsAdmin();
    });

    //logout and wait for 2 secs
    afterEach(function () {
        loginPage.logout();
    });

    it('login as admin and navigate to users page', function () {
        userPage.goToUsersPage();
        browser.driver.sleep(1000);
        expect(element(by.repeater('user in vm.allSystemUsers').row(0).column('userName')));
    });

    it('login, navigate to users page and create user as Admin', function () {
        userPage.goToUsersPage();
        browser.driver.sleep(1000);
        expect(element(by.repeater('user in vm.allSystemUsers').row(0).column('userName')));
        userPage.createUser();
    });

});