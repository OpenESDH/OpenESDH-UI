var outlookPage = require('./outlook.page.po.js');
var casePage = require('../cases/casePage.po.js');
var loginPage = require('../login/loginPage.po.js');
var userPage = require('../users/userPage.po.js');

describe('OpenESDH outlook integration page', function() {
    // Ignoring this test temporary since it heavily depends on solar search queries and requires long sleeps.
    // TODO: Unignore this test once case list query refactored to use CMIS.
    return;
    
    var caseId = null;
    
    beforeEach(function(){
        return outlookPage.plainLogin().then(function(){
            userPage.getCurrentUser().then(function(user){
                var caseProps = {
                        assoc_base_owners_added: user.nodeRef,
                        prop_cm_title: "Test Search Email Case"
                };
                return casePage.createCaseSilent('simple:case', caseProps).then(function(createdCaseId){
                    caseId = createdCaseId;
                });
            });    
        });
    });
    
    // logout and wait for 2 secs
    afterEach(function() {
        var casesToDelete = [];
        if(caseId != null){
            casesToDelete.push(caseId);
        }
        casePage.deleteCases(casesToDelete);
        browser.get('http://localhost:8000');
        loginPage.logout();
    });
    
    var testTitle = '\nShould be able to save outlook email into existing case'; 
    it(testTitle, function() {
        var createdCaseId = null;
        console.log(testTitle);
        outlookPage.goToSaveMailInCasePage();
        var searchCase = element(by.css('input[type="search"]'));
        var foundCase = element(by.css('[ng-click="$mdAutocompleteCtrl.select($index)"]'));
        var docTitle = element(by.model('vm.subject'));
        var okDialogBtn = element(by.css('[ng-click="vm.saveEmailWithCase(form)"]'));
        browser.driver.sleep(12000);
        searchCase.sendKeys(caseId);
        browser.waitForAngular().then(function() {
            foundCase.click();
        });
        docTitle.sendKeys("Test Search Email Case Document");
        browser.wait(function() {
            return okDialogBtn.isEnabled().then(function(value) {
                return value;
            }); 
        }, 1000).then(function(){
            expect(okDialogBtn.isEnabled()).toBe(true);
        });
    });
});