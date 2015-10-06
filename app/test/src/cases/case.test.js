var globalHeaderMenu = require('../pages/GlobalHeader.js');
var loginPageBuilder = require('../pages/LoginPage.js');

describe('openESDH case page tests', function() {
    it('login and navigate to cases page', function() {
        var loginPage = loginPageBuilder.getLoginPage();
        loginPage.login();

        globalHeaderMenu.getHeaderMenuItem().casesBtn.click();
        browser.driver.sleep(2000);
        browser.waitForAngular();
        expect(element(by.buttonText("CREATE NEW CASE")) ); //by.repeater doesn't work with md-virtual repeat so we detect the create new case button instead.

        loginPage.logout();
    });

    it('should create a case and wait for the case page to load',  function(){

    })
});