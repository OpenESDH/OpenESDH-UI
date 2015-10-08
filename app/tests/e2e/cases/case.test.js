describe('openESDH case page tests', function() {

    var globalHeaderMenu = require('../common/globalHeader.po.js');
    var loginPageBuilder = require('../login/loginPage.po.js');
    var loginPage = loginPageBuilder.getLoginPage();

    //Executed before each of the "it" tests
    beforeEach(function() {
        loginPage.login();
    });

    //logout and wait for 2 secs
    afterEach(function() {
        loginPage.logout();
        //wait for 2 secs just in case
    });

    it('login and navigate to cases page', function() {

        globalHeaderMenu.getHeaderMenuItem().casesBtn.click();
        browser.driver.sleep(2000);
        //browser.waitForAngular();
        //TODO If we start targeting all these elements by their text content that we should consider when they're localised.
        expect(element(by.id("create-case-btn")) ); //by.repeater doesn't work with md-virtual repeat so we detect the create new case button instead.
        console.log("==> create case button detected.");
    });

    it('should create a case and wait for the case page to load',  function(){

        globalHeaderMenu.getHeaderMenuItem().casesBtn.click();
        var createCaseBtn = element(by.id("create-case-btn"));
        createCaseBtn.click();
        var stdCaseTypeBtn = element(by.css('[ng-click="vm.createCase($event, \'standard\')"]') );
        expect(stdCaseTypeBtn);
        stdCaseTypeBtn.click();

        element(by.css('[ng-click="vm.cancel(form)"]')).click();
    })

});