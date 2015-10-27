var CasePage = function () {
    var globalHeaderMenu = require('../common/globalHeader.po.js');

    return{
        goToCasesPage: goToCasesPage
    };

    /**
     * Go to the cases page.
     */
    function goToCasesPage() {
        globalHeaderMenu.getHeaderMenuItem().casesBtn.click();
    }

};

module.exports = CasePage();