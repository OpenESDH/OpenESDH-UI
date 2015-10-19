
    angular
        .module('openeApp.documentCategories')
        .controller('DocumentCategoriesController', DocumentCategoriesController);

    function DocumentCategoriesController($scope, $mdDialog, $translate,
            documentCategoryService, PATTERNS, availableLanguages) {
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
                    .title($translate.instant('COMMON.CONFIRM'))
                    .content($translate.instant('DOCUMENT_CATEGORIES.ARE_YOU_SURE_YOU_WANT_TO_DELETE_DOCUMENT_CATEGORY_X', documentCategory.displayName))
                    .targetEvent(ev)
                    .ok($translate.instant('COMMON.YES'))
                    .cancel($translate.instant('COMMON.CANCEL'));
            $mdDialog.show(confirm).then(function() {
                documentCategoryService.deleteDocumentCategory(documentCategory.nodeRef).then(function() {
                    var currentCategory = vm.documentCategories.indexOf(documentCategory);
                    vm.documentCategories.splice(currentCategory, 1);

                });
            });
            ev.stopPropagation();
        }

        function showEdit(ev, documentCategory) {
            documentCategoryService
                    .getDocumentCategory(documentCategory.nodeRef)
                    .then(function(fullMultiLanguageDocumentCategory) {
                        $mdDialog
                                .show({
                                    controller: DocCategoryDialogController,
                                    controllerAs: 'dc',
                                    templateUrl: '/app/src/other/document_categories/view/documentCategoryCrudDialog.html',
                                    parent: angular.element(document.body),
                                    targetEvent: ev,
                                    clickOutsideToClose: true,
                                    locals: {
                                        documentCategory: fullMultiLanguageDocumentCategory
                                    }
                                }).then(function(response) {
                        });
                    });
        }

        function DocCategoryDialogController($scope, $mdDialog, documentCategory) {
            var dc = this;
            dc.documentCategory = documentCategory;
            dc.cancel = cancel;
            dc.save = save;
            dc.PATTERNS = PATTERNS;
            dc.availableLanguages = availableLanguages.keys;

            function cancel() {
                $mdDialog.cancel();
            }

            function save(form) {
                if (!form.$valid) {
                    return;
                }
                documentCategoryService.saveDocumentCategory(dc.documentCategory)
                        .then(refreshInfoAfterSuccess, saveError);
            }

            function refreshInfoAfterSuccess(savedDocumentCategory) {
                $mdDialog.hide();
                vm.loadList();
            }

            function saveError(response) {
                console.log(response);
            }
        }
    }