angular
        .module('openeApp.documents')
        .controller('CaseDocumentsSendController', CaseDocumentsSendController);

function CaseDocumentsSendController($injector, $q, caseDocumentsSendItemsService) {
    var vm = this;
    vm.execute = execute;
    vm.menuItems = caseDocumentsSendItemsService.getMenuItems();

    vm.menuItems.map(function(item) {
        isVisible(item).then(function(result) {
            item.visible = result;
        });
    });

    function execute(caseId, menuItem) {
        var service = $injector.get(menuItem.serviceName);
        service.showDialog(caseId);
    }

    function isVisible(menuItem) {
        var service = $injector.get(menuItem.serviceName);
        if (service.isVisible) {
            return service.isVisible();
        }
        return $q.resolve(true);
    }

}
