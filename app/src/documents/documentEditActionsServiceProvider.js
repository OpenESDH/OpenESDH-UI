angular
        .module('openeApp.documents')
        .provider('documentEditActionsService', DocumentEditActionsServiceProvider);

function DocumentEditActionsServiceProvider() {
    var availableItems = [];
    this.addItem = addItem;
    this.$get = DocumentEditActionsService;

    /**
     * 
     * @param labelKey - key for translation
     * @param icon - icon key
     * @param serviceName - for injector
     * @param isVisible - gets called with argument 'doc'
     * @param isDisabled - gets called with argument 'doc'
     * @returns {DocumentEditActionsServiceProvider}
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


    function DocumentEditActionsService() {
        var service = {
            getActionItems: getActionItems
        };
        return service;

        function getActionItems() {
            return availableItems;
        }
    }
}