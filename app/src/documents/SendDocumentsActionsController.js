    angular
        .module('openeApp.documents')
        .controller('SendDocumentsActionsController', SendDocumentsActionsController);
    
    function SendDocumentsActionsController($injector, $q, sendDocumentsActionsService){
        var vm = this;
        vm.execute = execute;
        vm.menuItems = sendDocumentsActionsService.getMenuItems();

        vm.menuItems.map(function(item) {
            isVisible(item).then(function(result) {
                item.visible = result;
            });
        });

        function execute(caseId, menuItem, docCtrl) {
            var service = $injector.get(menuItem.serviceName);
            service.showDialog(caseId, docCtrl);
        }

        function isVisible(menuItem) {
            var service = $injector.get(menuItem.serviceName);
            if (service.isVisible) {
                return service.isVisible();
            }
            return $q.resolve(true);
        }
    }