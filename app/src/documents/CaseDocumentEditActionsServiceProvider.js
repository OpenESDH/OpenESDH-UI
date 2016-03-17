angular
        .module('openeApp.documents')
        .provider('caseDocumentEditActionsService', CaseDocumentEditActionsServiceProvider);

function CaseDocumentEditActionsServiceProvider() {
    var availableItems = [];
    this.addItem = addItem;
    this.$get = CaseDocumentEditActionsService;

    /**
     * 
     * @param labelKey - key for translation
     * @param icon - icon key
     * @param serviceName - for injector
     * @param isVisible - gets called with argument 'file'
     * @param isDisabled - gets called with argument 'file'
     * @returns {CaseDocumentEditActionsServiceProvider}
     */
    function addItem(labelKey, icon, serviceName, isVisible, isDisabled) {
        availableItems.push({
            labelKey: labelKey,
            icon: icon,
            serviceName: serviceName,
            isVisible: isVisible,
            isDisabled: isDisabled
        });
        return this;
    }


    function CaseDocumentEditActionsService() {
        var service = {
            getActionItems: getActionItems
        };
        return service;

        function getActionItems() {
            return availableItems;
        }
    }
}