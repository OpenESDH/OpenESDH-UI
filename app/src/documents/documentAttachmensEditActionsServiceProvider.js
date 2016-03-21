angular
        .module('openeApp.documents')
        .provider('documentAttachmentEditActionsService', DocumentAttachmentEditActionsServiceProvider);

function DocumentAttachmentEditActionsServiceProvider() {
    var availableItems = [];
    this.addItem = addItem;
    this.$get = CaseDocumentAttachmentEditActionsService;

    /**
     * 
     * @param labelKey - key for translation
     * @param icon - icon key
     * @param serviceName - for injector
     * @param isVisible - gets called with arguments 'attachment, documentEditable'
     * @param isDisabled - gets called with arguments 'attachment, documentEditable'
     * @returns {DocumentAttachmentEditActionsServiceProvider}
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


    function CaseDocumentAttachmentEditActionsService() {
        var service = {
            getActionItems: getActionItems
        };
        return service;

        function getActionItems() {
            return availableItems;
        }
    }
}