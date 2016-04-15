var CasePage = function() {
    var globalHeaderMenu = require('../common/globalHeader.po.js');

    return{
        goToCasesPage: goToCasesPage,
        deleteCases: deleteCases,
        createCaseSilent: createCaseSilent
    };

    /**
     * Go to the cases page.
     */
    function goToCasesPage() {
        globalHeaderMenu.getHeaderMenuItem().casesBtn.click();
    }

    function deleteCases(casesToDelete) {
        casesToDelete.forEach(_deleteCase);
    }

    /*
     * deletes case using angular services directly:
     * - caseService.getCaseInfo
     * - alfrescoFolderService.deleteFolder
     */
    function _deleteCase(caseId) {
        browser.executeAsyncScript(function(_caseId, callback) {
            var caseService = angular.element(document.body).injector().get('caseService');
            var alfrescoFolderService = angular.element(document.body).injector().get('alfrescoFolderService');
            caseService.getCaseInfo(_caseId).then(function(caseInfo) {
                alfrescoFolderService.deleteFolder(caseInfo.properties.nodeRef).then(callback);
            });
        }, caseId).then(function(response) {
        });
    }
    function createCaseSilent(type, props){
        return browser.executeAsyncScript(function(type, props, callback) {
                var caseService = angular.element(document.body).injector().get('caseService');
                caseService.createCase(type, props).then(function(nodeRef){
                    return caseService.getCaseId(nodeRef).then(callback);
                });
            },
            type,
            props
        ).then(function (caseId) {
            //console.log("!!!! case created " + caseId);
            return caseId;
        });
    }

};

module.exports = CasePage();