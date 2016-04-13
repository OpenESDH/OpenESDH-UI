var CasePage = function () {
    var globalHeaderMenu = require('../common/globalHeader.po.js');

    return{
        goToCasesPage: goToCasesPage,
        deleteCases: deleteCases
    };

    /**
     * Go to the cases page.
     */
    function goToCasesPage() {
        globalHeaderMenu.getHeaderMenuItem().casesBtn.click();
    }
    
    function deleteCases(casesToDelete){
        browser.driver.sleep(5000);
        goToCasesPage();
        browser.driver.sleep(2000);

        for (i = 0; i < casesToDelete.length; i++) {
            var caseId = casesToDelete.pop();

            element(by.xpath('//button[@data-case-id="' + caseId + '"]'))
                    .click().then(function() {
                element(by.xpath('//md-dialog[@aria-label=\'ConfirmAre you sure ...\']//button[@aria-label=\'Yes\']'))
                        .click().then(function() {
//                    console.log('deleted');
                });
            });
        }
    }

};

module.exports = CasePage();