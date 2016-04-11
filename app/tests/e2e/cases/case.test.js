var casePage = require('./casePage.po.js');
var loginPage = require('../login/loginPage.po.js');
var oeUtils = require('../common/utils');

describe('openESDH case page tests', function() {

    //Executed before each of the "it" tests
    beforeEach(function() {
        loginPage.login();
    });

    //logout and wait for 2 secs
    afterEach(function() {
        loginPage.logout();
    });

    it('login and navigate to cases page', function() {
        casePage.goToCasesPage();
        browser.driver.sleep(2000);
        //TODO If we start targeting all these elements by their text content that we should consider when they're localised.
        expect(element(by.id("create-case-btn"))); //by.repeater doesn't work with md-virtual repeat so we detect the create new case button instead.
    });

    it('should create a case and wait for the case page to load', function() {
        casePage.goToCasesPage();
        var createCaseBtn = element(by.id("create-case-btn"));
        createCaseBtn.click();

        browser.driver.sleep(2000);
        browser.waitForAngular().then(function() {
            element.all(by.repeater('caseType in ctrl.registeredCaseTypes')).then(function(menuitems) {
                var stdCaseTypeBtn = menuitems[0].element(by.buttonText('Standard case'));

                expect(stdCaseTypeBtn);
                stdCaseTypeBtn.click().then(function() {
                    //Fill the crud form and click create
                    var caseTitle = element(by.model('vm.case.prop_cm_title'));
                    var caseOwner = element(by.model('$mdAutocompleteCtrl.scope.searchText'));
                    var caseJournalKey = element(by.model('vm.case.prop_oe_journalKey'));//Need to be tested later
                    var caseJournalFacet = element(by.model('vm.case.prop_oe_journalFacet'));//Need to be tested later
                    var caseDescription = element(by.model('vm.case.prop_cm_description'));
                    var okDialogBtn = element(by.css('[ng-click="vm.save()"]'));
                    var cancelDialogBtn = element(by.css('[ng-click="vm.cancel()"]'));

                    browser.waitForAngular().then(function() {
                        browser.wait(protractor.ExpectedConditions.visibilityOf(caseTitle), 10000).then(function() {
                            var caseTxtTitle = oeUtils.generateRandomString(8);
                            caseTitle.sendKeys(caseTxtTitle);
                            caseOwner.clear().sendKeys("la");
                            element(by.css('[ng-click="$mdAutocompleteCtrl.select($index)"]')).click();
                            caseDescription.sendKeys(oeUtils.generateRandomString(20));
                            //browser.driver.sleep(2000);
                            //browser.waitForAngular();
                            browser.wait(function() {
                                return okDialogBtn.isEnabled().then(function(value) {
                                    return value;
                                }); 
                            });
                            okDialogBtn.click();
                            browser.waitForAngular().then(function() {
                                browser.driver.sleep(2000);
                                //TODO fix assertion
                                //expect(element(by.xpath('//h1')).getText().toEqual(caseTxtTitle));
                            });
                        });
                    });

                });
            });
        });
    });
});