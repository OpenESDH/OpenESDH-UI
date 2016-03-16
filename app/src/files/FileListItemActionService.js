angular
        .module('openeApp.files')
        .provider('fileListItemActionService', FileListItemActionServiceProvider);

function FileListItemActionServiceProvider() {
    var availableItems = [];
    this.addItem = addItem;
    this.$get = FileListItemActionService;

    /**
     * 
     * @param labelKey - key for translation
     * @param icon - icon key
     * @param serviceName - for injector
     * @param isVisible - gets called with argument 'file'
     * @param isDisabled - gets called with argument 'file'
     * @returns {FileListItemActionServiceProvider}
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

    function FileListItemActionService() {
        var service = {
            getItems: getItems
        };
        return service;

        function getItems() {
            return availableItems;
        }
    }
}