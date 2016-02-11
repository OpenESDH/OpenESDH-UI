angular
        .module('openeApp.documents')
        .controller('CaseDocumentActionsController', CaseDocumentActionsController);

function CaseDocumentActionsController($injector, $q, caseDocumentActionsService) {
    var vm = this;
    vm.execute = execute;
    vm.menuItems = caseDocumentActionsService.getMenuItems();
    vm.otherButtons = caseDocumentActionsService.getButtons();

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
