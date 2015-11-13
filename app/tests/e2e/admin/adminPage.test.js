var adminPage = require('./adminPage.po.js');
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
        adminPage.goToPage("users");
        browser.driver.sleep(500);
        expect(element(by.repeater('user in vm.allSystemUsers').row(0).column('userName')));
    });

    it('login as admin and navigate to groups page', function () {
        adminPage.goToPage("groups");
        browser.driver.sleep(500);
        expect(element(by.repeater('g in vm.groups').row(0).column('displayName')));
    });


});