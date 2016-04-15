var userPage = require('./userPage.po.js');
var loginPage = require('../login/loginPage.po.js');
var globalHeader = require('../common/globalHeader.po.js');

describe('openESDH users page tests', function() {
    console.log('openESDH users page tests');

    //Executed before each of the "it" tests
    beforeEach(function() {
        loginPage.login();
    });

    //logout and wait for 2 secs
    afterEach(function() {
        browser.driver.sleep(4000);//wait for toast message to hide
        loginPage.logout();
    });


    it('login as admin and navigate to users page', function() {
        console.log('login as admin and navigate to users page');
        userPage.goToUsersPage();
        browser.driver.sleep(1000);
        expect(element(by.repeater('user in vm.allSystemUsers').row(0).column('userName')));
    });

    it('login, navigate to users page and create user as Admin', function() {
        console.log('login, navigate to users page and create user as Admin');
        userPage.goToUsersPage();
        browser.driver.sleep(1000);
        expect(element(by.repeater('user in vm.allSystemUsers').row(0).column('userName')));
        userPage.createUser();
    });

    it('login, navigate to users page and open user edit as Admin', function() {
        console.log('login, navigate to users page and open user edit as Admin');
        userPage.goToUsersPage();
        browser.driver.sleep(1000);
        expect(element(by.repeater('user in vm.allSystemUsers').row(0).column('userName')));
        userPage.editUser();
    });

    it('login, navigate to users page and delete all created users', function() {
        console.log('login, navigate to users page and delete all created users');
        //some time for solr 
        browser.driver.sleep(5000);
        userPage.goToUsersPage();
        userPage.deleteUsers();
    });

});