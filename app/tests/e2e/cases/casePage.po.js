var CasePage = function () {
    var globalHeaderMenu = require('../common/globalHeader.po.js');
    var oeUtils = require('../common/utils');


    return{
        goToCasesPage: goToCasesPage,
        fillCrudDialog: fillCrudDialog
    };

    /**
     * Go to the cases page.
     */
    function goToCasesPage() {
        globalHeaderMenu.getHeaderMenuItem().casesBtn.click();
    }

    function fillCrudDialog() {
        browser.waitForAngular();
        browser.driver.sleep(2000);
        var caseTitle = element(by.model('case.title'));
        var caseOwner = element(by.model('case.owner'));
        var caseJournalKey = element(by.model('case.journalKey'));//Need to be tested later
        var caseJournalFacet = element(by.model('case.journalFacet'));//Need to be tested later
        var caseDescription = element(by.model('case.description'));
        var okDialogBtn = element(by.css('[ng-click="vm.update(case)"]'));
        var cancalDialogBtn = element(by.css('[ng-click="vm.cancel(form)"]')).click();

        var caseTxtTitle = oeUtils.generateRandomString(8);
        caseTitle.sendKeys(caseTxtTitle);
        caseOwner.sendKeys("la");
        caseDescription.sendKeys(oeUtils.generateRandomString(20));
        okDialogBtn.click();
        return caseTxtTitle;
    }

};


module.exports.getCasePage = function () {
    return new CasePage();
};