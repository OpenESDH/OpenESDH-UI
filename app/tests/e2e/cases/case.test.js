var casePage = require('./casePage.po.js');
var loginPage = require('../login/loginPage.po.js');
var oeUtils = require('../common/utils');

describe('openESDH case page tests as admin', function () {

    //<editor-fold desc="Before and after procedure">
    //Executed before each of the "it" tests
    beforeEach(function () {
        loginPage.login();
    });

    //logout and wait for 2 secs
    afterEach(function () {
        loginPage.logout();
    });
    //</editor-fold>

    it('login and navigate to cases page', function () {
        casePage.goToCasesPage();
        browser.driver.sleep(2000);
        //TODO If we start targeting all these elements by their text content that we should consider when they're localised.
        expect(element(by.id("create-case-btn"))); //by.repeater doesn't work with md-virtual repeat so we detect the create new case button instead.
    });

    it('should create a case and wait for the case page to load', function () {
        casePage.goToCasesPage();
        var createCaseBtn = element(by.id("create-case-btn"));
        createCaseBtn.click();

        element.all(by.repeater('caseType in ctrl.registeredCaseTypes')).then(function(menuitems) {
            var stdCaseTypeBtn = menuitems[0].element(by.buttonText('Standard case'));

            expect(stdCaseTypeBtn);
            stdCaseTypeBtn.click().then(function () {
                //Fill the crud form and click create
                var caseTitle = element(by.model('vm.case.prop_cm_title'));
                var caseOwner = element(by.model('vm.case.assoc_base_owners_added'));
                var caseJournalKey = element(by.model('vm.case.prop_oe_journalKey'));//Need to be tested later
                var caseJournalFacet = element(by.model('vm.case.prop_oe_journalFacet'));//Need to be tested later
                var caseDescription = element(by.model('vm.case.prop_cm_description'));
                var okDialogBtn = element(by.css('[ng-click="vm.save()"]'));
                var cancelDialogBtn = element(by.css('[ng-click="vm.cancel()"]'));

                browser.waitForAngular().then(function(){
                    browser.wait(protractor.ExpectedConditions.visibilityOf(caseTitle), 10000).then(function(){
                        var caseTxtTitle = oeUtils.generateRandomString(8);
                        caseTitle.sendKeys(caseTxtTitle);
                        caseOwner.sendKeys("la");
                        caseDescription.sendKeys(oeUtils.generateRandomString(20));
                        browser.wait(function () {
                            return okDialogBtn.isEnabled().then(function (value) {
                                return value;
                            }); 
                        });
                        okDialogBtn.click();
                        browser.waitForAngular().then(function(){
                            //TODO fix assertion
                            var caseTitleHeader = element(by.cssContainingText('.case-page-title',caseTxtTitle));
                            caseTitleHeader.getText().then(function(text){
                                console.log("==> The case title test is:", text);
                                expect(text.indexOf(caseTitleHeader) >=0);
                            }) ;
                            element(by.css('[ng-href="#/cases"]')).click();
                        });
                    });
                });

            });
        });
    });
});

/**
 * This test requires that the user be part of the CaseSimpleCreator group
 */
describe('openESDH case page tests as a CaseCreator group member', function () {

    //<editor-fold desc="Before and after procedure">
    //Executed before each of the "it" tests
    beforeEach(function () {
        loginPage.loginAs("lanre", "test");
    });

    //logout and wait for 2 secs
    afterEach(function () {
        loginPage.logout();
    });
    //</editor-fold>

    it('login and navigate to cases page', function () {
        casePage.goToCasesPage();
        browser.driver.sleep(2000);
        //TODO If we start targeting all these elements by their text content that we should consider when they're localised.
        expect(element(by.id("create-case-btn"))); //by.repeater doesn't work with md-virtual repeat so we detect the create new case button instead.
    });

    it('should create a case and wait for the case page to load', function () {
        casePage.goToCasesPage();
        var createCaseBtn = element(by.id("create-case-btn"));
        createCaseBtn.click();

        element.all(by.repeater('caseType in ctrl.registeredCaseTypes')).then(function(menuitems) {
            var stdCaseTypeBtn = menuitems[0].element(by.buttonText('Standard case'));

            expect(stdCaseTypeBtn);
            stdCaseTypeBtn.click().then(function () {
                //Fill the crud form and click create
                var caseTitle = element(by.model('vm.case.prop_cm_title'));
                var caseOwner = element(by.model('vm.case.assoc_base_owners_added'));
                var caseJournalKey = element(by.model('vm.case.prop_oe_journalKey'));//Need to be tested later
                var caseJournalFacet = element(by.model('vm.case.prop_oe_journalFacet'));//Need to be tested later
                var caseDescription = element(by.model('vm.case.prop_cm_description'));
                var okDialogBtn = element(by.css('[ng-click="vm.save()"]'));
                var cancelDialogBtn = element(by.css('[ng-click="vm.cancel()"]'));

                browser.waitForAngular().then(function(){
                    browser.wait(protractor.ExpectedConditions.visibilityOf(caseTitle), 10000).then(function(){
                        var caseTxtTitle = oeUtils.generateRandomString(8);
                        caseTitle.sendKeys(caseTxtTitle);
                        caseOwner.sendKeys("la");
                        caseDescription.sendKeys(oeUtils.generateRandomString(20));
                        //browser.driver.sleep(2000);
                        browser.wait(function () {
                            return okDialogBtn.isEnabled().then(function (value) {
                                return value;
                            }); 
                        });
                        okDialogBtn.click();
                        browser.waitForAngular().then(function(){
                            //browser.driver.sleep(2000);
                            //TODO fix assertion
                            var caseTitleHeader = element(by.cssContainingText('.case-page-title',caseTxtTitle));
                            caseTitleHeader.getText().then(function(text){
                                console.log("==> The case title test is:", text);
                                expect(text.indexOf(caseTitleHeader) >=0);
                            }) ;
                            element(by.css('[ng-href="#/cases"]')).click();
                        });
                    });
                });

            });
        });
    });
});