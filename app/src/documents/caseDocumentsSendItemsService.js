angular
        .module('openeApp.documents')
        .provider('caseDocumentsSendItemsService', CaseDocumentsSendItemsServiceProvider);

function CaseDocumentsSendItemsServiceProvider() {
    var availableItems = [];
    this.addMenuItem = addMenuItem;
    this.$get = CaseDocumentsSendItemsService;

    function addMenuItem(labelKey, serviceName) {
        availableItems.push({
            labelKey: labelKey,
            serviceName: serviceName
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