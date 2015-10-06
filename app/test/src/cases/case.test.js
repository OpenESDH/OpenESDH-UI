var globalHeaderMenu = require('../pages/GlobalHeader.js');
var loginPageBuilder = require('../pages/LoginPage.js');

describe('openESDH case page tests', function() {
    it('login and navigate to cases page', function() {
        var loginPage = loginPageBuilder.getLoginPage();
        loginPage.login();

        globalHeaderMenu.getHeaderMenuItem().casesBtn.click();
        browser.driver.sleep(2000);
        browser.waitForAngular();
        //TODO If we start targeting all these elements by their text content that we should consider when they're localised.
        expect(element(by.id("create-case-btn")) ); //by.repeater doesn't work with md-virtual repeat so we detect the create new case button instead.
        loginPage.logout();
    });

/*    */
});

describe('openESDH case page tests', function() {
    it('should create a case and wait for the case page to load',  function(){
        var loginPage = loginPageBuilder.getLoginPage();
        loginPage.login();

        globalHeaderMenu.getHeaderMenuItem().casesBtn.click();
        var createCaseBtn = element(by.id("create-case-btn"));
        createCaseBtn.click();
        var stdCaseTypeBtn = element(by.css('[ng-click="vm.createCase($event, \'standard\')"]') );
        expect(stdCaseTypeBtn);
        stdCaseTypeBtn.click();

        element(by.css('ng-click="vm.cancel(form)"')).click();
        loginPage.logout();
    })
});