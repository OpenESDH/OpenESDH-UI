    angular
        .module('openeApp.documents')
        .provider('sendDocumentsActionsService', SendDocumentsActionsServiceProvider);
    
    function SendDocumentsActionsServiceProvider(){
        
        var availableItems = [];
        
        this.addMenuItem = addMenuItem;
        this.$get = sendDocumentsActionsService;
        
        /**
         * 
         * @param labelKey - key for translation
         * @param serviceName - for injector
         * @param lockedWithCase - true - menu will be disabled on locked cases
         * @returns {SendDocumentsActionsServiceProvider}
         */
        function addMenuItem(labelKey, serviceName, lockedWithCase) {
            availableItems.push({
                labelKey: labelKey,
                serviceName: serviceName,
                lockedWithCase: lockedWithCase || false
            });
            return this;
        }
        
        function sendDocumentsActionsService(){
            return {
                getMenuItems: getMenuItems
            };
            
            function getMenuItems() {
                return availableItems;
            }
        }
    }