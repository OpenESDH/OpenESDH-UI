angular
        .module('openeApp.documents')
        .provider('caseDocumentsSendItemsService', CaseDocumentsSendItemsServiceProvider);

function CaseDocumentsSendItemsServiceProvider() {
    var availableItems = [];
    this.addMenuItem = addMenuItem;
    this.$get = CaseDocumentsSendItemsService;

    /**
     * 
     * @param labelKey - key for translation
     * @param serviceName - for injector
     * @param lockedWithCase - true - menu will be disabled on locked cases
     * @returns {CaseDocumentsSendItemsServiceProvider}
     */
    function addMenuItem(labelKey, serviceName, lockedWithCase) {
        availableItems.push({
            labelKey: labelKey,
            serviceName: serviceName,
            lockedWithCase: lockedWithCase || false
        });
        return this;
    }

    function CaseDocumentsSendItemsService() {
        var service = {
            getMenuItems: getMenuItems
        };
        return service;

        function getMenuItems() {
            return availableItems;
        }
    }
}