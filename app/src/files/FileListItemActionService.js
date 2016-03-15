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
     * @returns {FileListItemActionServiceProvider}
     */
    function addItem(labelKey, icon, serviceName, isVisible) {
        availableItems.push({
            labelKey: labelKey,
            icon: icon,
            serviceName: serviceName,
            isVisible: isVisible
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