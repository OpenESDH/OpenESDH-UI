angular
        .module('openeApp.documents')
        .provider('caseDocumentActionsService', CaseDocumentActionsServiceProvider);

function CaseDocumentActionsServiceProvider() {
    var availableItems = [];
    var availableButtons = [];
    this.addMenuItem = addMenuItem;
    this.addNewButton = addNewButton;
    this.$get = CaseDocumentActionsService;

    /**
     * 
     * @param labelKey - key for translation
     * @param serviceName - for injector
     * @param lockedWithCase - true - menu will be disabled on locked cases
     * @returns {CaseDocumentActionsServiceProvider}
     */
    function addMenuItem(labelKey, serviceName, lockedWithCase) {
        availableItems.push({
            labelKey: labelKey,
            serviceName: serviceName,
            lockedWithCase: lockedWithCase || false
        });
        return this;
    }

    function addNewButton(labelKey, serviceName, icon, lockedWithCase) {
        availableButtons.push({
            labelKey: labelKey,
            serviceName: serviceName,
            icon: icon,
            lockedWithCase: lockedWithCase || false
        });
        return this;
    }

    function CaseDocumentActionsService() {
        var service = {
            getMenuItems: getMenuItems,
            getButtons: getButtons
        };
        return service;

        function getMenuItems() {
            return availableItems;
        }
        
        function getButtons() {
            return availableButtons;
        }
    }
}