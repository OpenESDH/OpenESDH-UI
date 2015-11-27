var adminPage = require('../admin/adminPage.po.js');
var oeUtils = require('../common/utils');

var ContactsPage = function () {

    //All input fields in the dialog encapsulated in an object
    var contactPersonDlg = {
        firstName: element(by.model('person.firstName')),
        middleName: element(by.model('person.middleName')),
        lastName: element(by.model('person.lastName')),
        email: element(by.model('person.email')),
        addressLine1: element(by.model('person.addressLine1')),
        addressLine2: element(by.model('person.addressLine2')),
        postCode: element(by.model('person.postCode')),
        cityName: element(by.model('person.cityName')),
        countryCode: element(by.model('person.countryCode')),
        cprNumber: element(by.model('person.cprNumber')),
        phone: element(by.model('person.phone')),
        mobile: element(by.model('person.mobile')),
        website: element(by.model('person.website')),
        linkedin: element(by.model('person.linkedin')),
        im: element(by.model('person.IM')),
        notes: element(by.model('person.notes')),
        cuOkBtn: element(by.id('save-contact-person')),
        cuDeleteBtn: element(by.css('[ng-click="delete($event, person)"]')),
        cuCancelBtn: element(by.css('[ng-click="cancel()"]'))
    };
    var contactSearchInput = element(by.model('vm.searchQuery'));

    return {
        searchFilterInput: contactSearchInput,
        goToContactsPage: goToContactsPage,
        createContact: createContact,
        updateContact: updateContact
    };

    /**
     * Go to the contacts page.
     */
    function goToContactsPage() {
        adminPage.goToPage("contacts");
    }

    function createContact() {
        var createUserBtn = element(by.css('[ng-click="vm.showPersonEdit($event, null)"]'));
        expect(createUserBtn);
        return createUserBtn.click().then(function () {
            browser.wait(protractor.ExpectedConditions.visibilityOf(contactPersonDlg.firstName), 10000).then(function () {
                var firstName = oeUtils.generateRandomAlphabetString(5);
                var lastName = oeUtils.generateRandomAlphabetString(8);
                var cprNumber = oeUtils.getRandomNumber(10);
                var email = oeUtils.getRandomEmail();

                contactPersonDlg.firstName.sendKeys(firstName);
                contactPersonDlg.middleName.sendKeys(oeUtils.generateRandomAlphabetString(5));
                contactPersonDlg.lastName.sendKeys(lastName);
                contactPersonDlg.addressLine1.sendKeys(oeUtils.generateRandomAlphaNumericString(11));
                contactPersonDlg.addressLine2.sendKeys(oeUtils.generateRandomAlphabetString(9));
                contactPersonDlg.postCode.sendKeys(oeUtils.getRandomNumber(4));
                contactPersonDlg.cityName.sendKeys("Copenhagen");
                contactPersonDlg.countryCode.sendKeys("DK");
                contactPersonDlg.cprNumber.sendKeys(cprNumber);
                contactPersonDlg.email.sendKeys(email);
                contactPersonDlg.phone.sendKeys(oeUtils.getRandomNumber(8));
                contactPersonDlg.mobile.sendKeys(oeUtils.getRandomNumber(8));
                contactPersonDlg.notes.sendKeys(oeUtils.generateRandomAlphaNumericString(20));
                browser.wait(function () {
                    return contactPersonDlg.cuOkBtn.isEnabled();
                });
                contactPersonDlg.cuOkBtn.click().then(function () {
                    browser.driver.sleep(15000);//Wait a bit so the indexer can catch up in the backend
                    contactSearchInput.sendKeys(cprNumber);
                });
            });
        });
    }

    function updateContact(cprNumber, field, newValue) {
        browser.driver.sleep(500);
        //contactSearchInput.clear();
        console.log("---------> Cleared before update");
        //return contactSearchInput.sendKeys(cprNumber).then(function(){
            browser.waitForAngular();
            var editBtn = element(by.css('[ng-click="vm.showPersonEdit($event, person)"]'));
             return browser.wait(protractor.ExpectedConditions.visibilityOf(editBtn), 7000).then(function () {
                editBtn.click().then(function () {
                    browser.wait(protractor.ExpectedConditions.visibilityOf(contactPersonDlg.firstName), 7000).then(function () {
                        contactPersonDlg[field].clear();
                        contactPersonDlg[field].sendKeys(newValue);
                        /*browser.wait(function () {
                            return contactPersonDlg.cuOkBtn.isEnabled();
                        });*/
                        contactPersonDlg.cuOkBtn.click().then(function () {
                            browser.driver.sleep(3000);//Wait a bit so the indexer can catch up in the backend
                            //contactSearchInput.clear();
                        });
                    })
                });
            });
        //});
    }
};

module.exports = ContactsPage();