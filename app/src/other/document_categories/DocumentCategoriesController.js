(function() {

    angular
            .module('openeApp.documentCategories')
            .controller('DocumentCategoriesController', DocumentCategoriesController);

    DocumentCategoriesController.$inject = ['$scope', '$mdDialog', 'documentCategoryService', 'PATTERNS'];

    function DocumentCategoriesController($scope, $mdDialog, documentCategoryService, PATTERNS) {
        var vm = this;
        vm.documentCategories = [];
        vm.loadList = loadList;
        vm.showEdit = showEdit;
        vm.doDelete = doDelete;

        vm.loadList();

        function loadList() {
            documentCategoryService.getDocumentCategories().then(function(data) {
                vm.documentCategories = data;
                return data;
            });
        }

        function doDelete(ev, documentCategory) {
            var confirm = $mdDialog.confirm()
                    .title('Confirmation')
                    .content('Are you sure you want to delete document category?')
                    .ariaLabel('Document category delete confirmation')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                documentCategoryService.deleteDocumentCategory(documentCategory.nodeRef).then(function() {
                    var currentCategory = vm.documentCategories.indexOf(documentCategory);
                    vm.documentCategories.splice(currentCategory, 1);

                });
            });
            ev.stopPropagation();
        }
        
        function showEdit(ev, documentCategory) {
            $mdDialog
                    .show({
                        controller: DocCategoryDialogController,
                        controllerAs: 'dc',
                        templateUrl: '/app/src/other/document_categories/view/documentCategoryCrudDialog.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        locals: {
                            documentCategory: angular.copy(documentCategory)
                        }
                    }).then(function(response) {
                    });
        }

        function DocCategoryDialogController($scope, $mdDialog, documentCategory) {
            var dc = this;
            dc.documentCategory = documentCategory;
            dc.cancel = cancel;
            dc.save = save;
            dc.PATTERNS = PATTERNS;

            function cancel() {
                $mdDialog.cancel();
            };

            function save(form) {
                if (!form.$valid) {
                    return;
                }
                documentCategoryService.saveDocumentCategory(dc.documentCategory)
                            .then(refreshInfoAfterSuccess, saveError);
            };

            function refreshInfoAfterSuccess(savedDocumentCategory) {
                $mdDialog.hide();
                vm.loadList();
            }

            function saveError(response) {
                console.log(response);
            }
        }
    }
})();
