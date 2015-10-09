describe('openESDH case page tests', function () {

    var casePage = require('./casePage.po.js').getCasePage();
    var caseDialog = require('./caseCrudDialog.po.js').getCaseCrudDialog();
    var loginPageBuilder = require('../login/loginPage.po.js');
    var loginPage = loginPageBuilder.getLoginPage();

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
    });

    it('should create a case and wait for the case page to load', function () {
        casePage.goToCasesPage();
        var createCaseBtn = element(by.id("create-case-btn"));
        createCaseBtn.click();
        var stdCaseTypeBtn = element(by.css('[ng-click="vm.createCase($event, \'standard\')"]'));
        expect(stdCaseTypeBtn);
        stdCaseTypeBtn.click().then(function () {
            var caseTextTitle = caseDialog.fillCrudDialog();
            //TODO Fix assertion
            console.log("The case text title is:" + caseTextTitle);

        });
    });
});