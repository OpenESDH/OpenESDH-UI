var contactsPage = require('./contactsPage.po.js');
var loginPage = require('../login/loginPage.po.js');
/*
var origFn = browser.driver.controlFlow().execute;
 browser.driver.controlFlow().execute = function() {
 var args = arguments;

 // queue 100ms wait
 origFn.call(browser.driver.controlFlow(), function() {
 return protractor.promise.delayed(50);
 });

 return origFn.apply(browser.driver.controlFlow(), args);
 };*/

describe('openESDH case page tests', function () {

    //Executed before each of the "it" tests
    beforeEach(function () {
        loginPage.loginAsAdmin();
    });

    //logout and wait for 2 secs
    afterEach(function () {
        browser.driver.sleep(5000);//Wait 5 secs for any md-toast dialogs to disappear
        loginPage.logout();
    });

  /*  it('should create contact person as admin and then delete the contact', function () {
        var cCprNumber;
        contactsPage.goToContactsPage(); //assertion is done in the adminPage.goToPage method
        contactsPage.createContact()

        contactsPage.searchFilterInput.getAttribute('value').then(function (textValue) {
            cCprNumber = textValue;

            browser.waitForAngular();
            
            var editButtton = element(by.css('[ng-click="vm.showPersonEdit($event, person)"]'));
            browser.wait(EC.visibilityOf(editButtton), 10000);
            editButtton.click()

            browser.waitForAngular();

            var dlgDeleteBtn = element(by.css('[ng-click="delete($event, person)"]'));
            browser.wait(EC.visibilityOf(dlgDeleteBtn), 5000);
            expect(dlgDeleteBtn);
            dlgDeleteBtn.click()

            var delConfirmBtn = element(by.css('[ng-click="dialog.hide()"]'));
            browser.wait(EC.visibilityOf(delConfirmBtn), 5000);
            expect(delConfirmBtn);
            delConfirmBtn.click()

        });
    }, 60 * 1000);
*/
    it('should create contact person as admin update the CPR number and then delete the contact', function () {
        contactsPage.goToContactsPage();
        var cCprNumber, updatedCPRNumber = "2212972099";
        contactsPage.createContact().then(function () {
            contactsPage.searchFilterInput.getAttribute('value').then(function (textValue) {
                cCprNumber = textValue;
                contactsPage.updateContact(cCprNumber, 'cprNumber', updatedCPRNumber).then(function () {
                    console.log("---------> Done updating");
                    contactsPage.searchFilterInput.clear();
                    browser.driver.sleep(500);
                    contactsPage.searchFilterInput.sendKeys(updatedCPRNumber).then(function () {
                        browser.waitForAngular();
                        var editButtton = element(by.css('[ng-click="vm.showPersonEdit($event, person)"]'));
                        console.log("---------> Waiting for edit button");
                        browser.wait(protractor.ExpectedConditions.visibilityOf(editButtton), 7000).then(function () {
                            editButtton.click().then(function () {
                                var dlgDeleteBtn = element(by.id('delete-contact-person'));
                                expect(dlgDeleteBtn);
                                dlgDeleteBtn.click().then(function () {
                                    var delConfirmBtn = element(by.css('[ng-click="dialog.hide()"]'));
                                    expect(delConfirmBtn);
                                    delConfirmBtn.click().then(function () {
                                        //expect(element.all(by.repeater('person in vm.persons.items').row(0))).toEqual(undefined);
                                    });
                                });
                            });
                        })
                    })
                });
            });
        });
    });

});