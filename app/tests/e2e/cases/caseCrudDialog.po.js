var CaseCrudDialog = function () {
    var oeUtils = require('../common/utils');
    var caseTitle = element(by.model('case.title'));
    var caseOwner = element(by.model('case.owner'));
    var caseJournalKey = element(by.model('case.journalKey'));//Need to be tested later
    var caseJournalFacet = element(by.model('case.journalFacet'));//Need to be tested later
    var caseStartDate = element(by.model('case.startDate'));//Need to be tested later
    var caseDescription = element(by.model('case.description'));
    var okDialogBtn = element(by.id('create-case-dlg-ok-btn'));
    var cancalDialogBtn = element(by.id('create-case-dlg-cancel-btn')).click();


    return {
        fillCrudDialog: fillCrudDialog
    };

    function fillCrudDialog() {
        var caseTxtTitle = oeUtils.generateRandomAlphaNumericString(8);
        browser.waitForAngular().then(function(){
            console.log("Popped Up. Waiting...");
            browser.wait(protractor.ExpectedConditions.visibilityOf(caseTitle), 10000).then(function() {
                caseTitle.sendKeys(caseTxtTitle);
                caseOwner.sendKeys("la");
                caseDescription.sendKeys(oeUtils.generateRandomAlphabetString(20));
                browser.wait(function () {
                    return okDialogBtn.isEnabled().then(function (value) {
                        return value;
                    });
                });
                okDialogBtn.click();
                browser.driver.sleep(1000);
                return caseTxtTitle;
            });
        });
    }

};


module.exports = CaseCrudDialog();