var globalHeaderMenu = require('../common/globalHeader.po.js');
var oeUtils = require('../common/utils');

var AdminPage = function () {

    //All input fields in the dialog encapsulated in an object
    var userCUInputFields = {
        firstName: element(by.model('ucd.user.firstName')),
        lastName: element(by.model('ucd.user.lastName')),
        email: element(by.model('ucd.user.email')),
        enabled: element(by.model('ucd.user.enabled')),
        userName: element(by.model('ucd.user.userName')),
        password: element(by.model('ucd.user.password')),
        verifypassword: element(by.model('ucd.user.verifypassword')),
        desc: element(by.model('ucd.user.desc')),
        cuOkBtn: element(by.id('create-user-dialog-ok-btn')),
        cuCancelBtn: element(by.id('create-user-dialog-cancel-btn'))
    };

    return {
        goToPage: goToPage
    };

    /**
     * Go to the cases page.
     */
/*    function goToUsersPage() {
        globalHeaderMenu.getHeaderMenuItem().userMenuBtn.click().then(function () {
            var adminBtn = element(by.xpath('//a[@ui-sref=\'administration.users\']'));
            expect(adminBtn);
            adminBtn.click();
            browser.waitForAngular();
            browser.driver.sleep(1000);
        });
    }*/

    /**
     * Go to the cases page.
     */
    function goToPage(tabName) {
        globalHeaderMenu.getHeaderMenuItem().userMenuBtn.click().then(function () {
            var adminBtn = element(by.xpath('//a[@ui-sref=\'administration.'+tabName+'\']'));
            expect(adminBtn);
            adminBtn.click();
            browser.waitForAngular();
            browser.driver.sleep(1000);
        });
    }

    function createUser() {
        var createUserBtn = element(by.css('[ng-click="vm.createUser($event)"]'));
        expect(createUserBtn);
        createUserBtn.click().then(function () {
            browser.wait(protractor.ExpectedConditions.visibilityOf(userCUInputFields.firstName), 10000).then(function () {
                var userNameTxt= oeUtils.generateRandomString(4);
                var password= oeUtils.generateRandomString(10);
                var email= oeUtils.getRandomEmail();
                userCUInputFields.firstName.sendKeys(oeUtils.generateRandomString(5));
                userCUInputFields.lastName.sendKeys(oeUtils.generateRandomString(5));
                userCUInputFields.userName.sendKeys(userNameTxt);
                userCUInputFields.password.sendKeys(password);
                userCUInputFields.verifypassword.sendKeys(password);
                userCUInputFields.desc.sendKeys(oeUtils.generateRandomString(20));
                userCUInputFields.email.sendKeys(email);
                browser.wait(function () {
                    return userCUInputFields.cuOkBtn.isEnabled();
                });
                userCUInputFields.cuOkBtn.click().then(function () {
                    //console.log("****** User name: "+ userNameTxt+" *******");
                    //console.log("****** User password: "+ password+" *******");
                    //console.log("****** User email: "+ email+" *******");
                });
                //browser.wait(function () {
                //    return $$("md-dialog").count().then(function (count) {
                //        console.log("count " + count);
                //        return count === 0;
                //    });
                //});
                //TODO fix assertion
                //expect(element(by.xpath('//h1')).getText().toEqual(caseTxtTitle));
            });
        });
    }
};

module.exports = AdminPage();