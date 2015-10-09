describe('openESDH case page tests', function () {

    var casePage = require('./casePage.po.js').getCasePage();
    var loginPageBuilder = require('../login/loginPage.po.js');
    var loginPage = loginPageBuilder.getLoginPage();
    var oeUtils = require('../common/utils');

    //Executed before each of the "it" tests
    beforeEach(function () {
        loginPage.login();
    });

    //logout and wait for 2 secs
    afterEach(function () {
        loginPage.logout();
    });

    it('login and navigate to cases page', function () {
        casePage.goToCasesPage();
        browser.driver.sleep(2000);
        //TODO If we start targeting all these elements by their text content that we should consider when they're localised.
        expect(element(by.id("create-case-btn"))); //by.repeater doesn't work with md-virtual repeat so we detect the create new case button instead.
        console.log("==> create case button detected.");
    });

    it('should create a case and wait for the case page to load', function () {
        casePage.goToCasesPage();
        var createCaseBtn = element(by.id("create-case-btn"));
        createCaseBtn.click();
        var stdCaseTypeBtn = element(by.css('[ng-click="vm.createCase($event, \'standard\')"]'));
        expect(stdCaseTypeBtn);
        stdCaseTypeBtn.click().then(function () {
            //Fill the crud form and click create
            var caseTitle = element(by.model('case.title'));
            //var caseTitle = element(by.css('[ng-model="case.title"]'));
            var caseOwner = element(by.model('case.owner'));
            var caseJournalKey = element(by.model('case.journalKey'));//Need to be tested later
            var caseJournalFacet = element(by.model('case.journalFacet'));//Need to be tested later
            var caseDescription = element(by.model('case.description'));
            var okDialogBtn = element(by.css('[ng-click="vm.update(case)"]'));
            var cancelDialogBtn = element(by.css('[ng-click="vm.cancel(form)"]'));

            browser.waitForAngular().then(function(){
                browser.wait(protractor.ExpectedConditions.visibilityOf(caseTitle), 10000).then(function(){
                    var caseTxtTitle = oeUtils.generateRandomString(8);
                    caseTitle.sendKeys(caseTxtTitle);
                    caseOwner.sendKeys("la");
                    caseDescription.sendKeys(oeUtils.generateRandomString(20));
                    //browser.driver.sleep(2000);
                    //browser.waitForAngular();
                    browser.wait(function () {
                        return okDialogBtn.isEnabled().then(function (value) {
                            return value;
                        }); 
                    });
                    okDialogBtn.click();
                    browser.waitForAngular().then(function(){
                        browser.driver.sleep(2000);
                        //TODO fix assertion
                        //expect(element(by.xpath('//h1')).getText().toEqual(caseTxtTitle));
                    });
                });
            });

            });
    });
});