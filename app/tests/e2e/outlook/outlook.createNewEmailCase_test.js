var outlookPage = require('./outlook.page.po.js');
var loginPage = require('../login/loginPage.po.js');

describe('OpenESDH outlook integration page', function() {
    
    // logout and wait for 2 secs
    afterEach(function() {
        browser.get('http://localhost:8000');
        loginPage.logout();
    });
    
    var testTitle = '\nShould be able to create new case on outlook integration page'; 
    it(testTitle, function() {
        console.log(testTitle);
        outlookPage.plainLogin();
        outlookPage.goToSaveMailInCasePage();
        
        var selectCaseTypeBtn = outlookPage.selectCaseTypeBtn;
        selectCaseTypeBtn.click();
        
        browser.driver.sleep(2000);
        browser.waitForAngular().then(function() {
            element.all(by.repeater('caseType in ctrl.registeredCaseTypes')).then(function(menuitems) {
                var stdCaseTypeBtn = menuitems[0].element(by.buttonText('standard case'));
                expect(stdCaseTypeBtn);
                stdCaseTypeBtn.click().then(function() {
                    var caseTitle = element(by.model('vm.case.prop_cm_title'));
                    var docTitle = element(by.model('vm.subject'));
                    var okDialogBtn = element(by.css('[ng-click="vm.saveEmailWithCase(form)"]'));
                    expect(okDialogBtn.isEnabled()).toBe(false);
                    browser.waitForAngular().then(function() {
                        browser.wait(protractor.ExpectedConditions.visibilityOf(caseTitle), 10000).then(function() {
                            caseTitle.sendKeys("Test New Email Case");
                            docTitle.sendKeys("Test New Email Case Document");
                            browser.wait(function() {
                                return okDialogBtn.isEnabled().then(function(value) {
                                    return value;
                                }); 
                            }, 1000).then(function(){
                                expect(okDialogBtn.isEnabled()).toBe(true);
                            });
                        });
                    });
                });
            });
        });
    });

});