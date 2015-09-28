(function() {

    angular
            .module('openeApp.documentTypes')
            .controller('DocumentTypesController', DocumentTypesController);

    DocumentTypesController.$inject = ['$scope', '$mdDialog', 'documentTypeService'];

    function DocumentTypesController($scope, $mdDialog, documentTypeService) {
        var vm = this;
        vm.documentTypes = [];
        vm.loadList = loadList;
        vm.showEdit = showEdit;
        vm.doDelete = doDelete;

        vm.loadList();

        function loadList() {
            documentTypeService.getDocumentTypes().then(function(data) {
                vm.documentTypes = data;
                return data;
            });
        }

        function doDelete(ev, documentType) {
            var confirm = $mdDialog.confirm()
                    .title('Confirmation')
                    .content('Are you sure you want to delete document type?')
                    .ariaLabel('Document type delete confirmation')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                documentTypeService.deleteDocumentType(documentType.nodeRef).then(function() {
                    var currentType = vm.documentTypes.indexOf(documentType);
                    vm.documentTypes.splice(currentType, 1);

                });
            });
            ev.stopPropagation();
        }
        
        function showEdit(ev, documentType) {
            $mdDialog
                    .show({
                        controller: DocTypeDialogController,
                        controllerAs: 'dt',
                        templateUrl: '/app/src/other/document_types/view/documentTypeCrudDialog.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        locals: {
                            documentType: angular.copy(documentType)
                        }
                    }).then(function(response) {
                    });
        }

        function DocTypeDialogController($scope, $mdDialog, documentType) {
            var dt = this;
            dt.documentType = documentType;
            dt.cancel = cancel;
            dt.save = save;

            function cancel() {
                $mdDialog.cancel();
            };

            function save(form) {
                if (!form.$valid) {
                    return;
                }
                documentTypeService.saveDocumentType(dt.documentType)
                            .then(refreshInfoAfterSuccess, saveError);
            };

            function refreshInfoAfterSuccess(savedDocumentType) {
                $mdDialog.hide();
                vm.loadList();
            }

            function saveError(response) {
                console.log(response);
            }
        }
    }
})();
