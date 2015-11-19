
angular
            .module('openeApp.systemsettings')
        .controller('DocumentTypesController', DocumentTypesController);

function DocumentTypesController($scope, $mdDialog, $translate,
        documentTypeService, PATTERNS, availableLanguages) {
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
                .title($translate.instant('COMMON.CONFIRM'))
                .textContent($translate.instant('DOCUMENT_TYPES.ARE_YOU_SURE_YOU_WANT_TO_DELETE_DOCUMENT_TYPE_X', {title: documentType.displayName}))
                .targetEvent(ev)
                .ok($translate.instant('COMMON.YES'))
                .cancel($translate.instant('COMMON.CANCEL'));
        $mdDialog.show(confirm).then(function() {
            documentTypeService.deleteDocumentType(documentType.nodeRef).then(function() {
                var currentType = vm.documentTypes.indexOf(documentType);
                vm.documentTypes.splice(currentType, 1);

            });
        });
        ev.stopPropagation();
    }

    function showEdit(ev, documentType) {
        if(!documentType) return showDialog(ev, null);

        documentTypeService
            .getDocumentType(documentType.nodeRef)
            .then(function(fullMultiLanguageDocumentType) {
                return showDialog(ev, fullMultiLanguageDocumentType);
            });
    }

    function showDialog(ev, docType) {
        var doc = docType ? docType : null;
        $mdDialog.show({
            controller: DocTypeDialogController,
            controllerAs: 'dt',
            templateUrl: '/app/src/system_settings/document_types/view/documentTypeCrudDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
               documentType: doc
            }
        }).then(function(response) {
        });
    }

    function DocTypeDialogController($scope, $mdDialog, documentType) {
        var dt = this;
        dt.documentType = documentType;
        dt.cancel = cancel;
        dt.save = save;
        dt.PATTERNS = PATTERNS;
        dt.availableLanguages = availableLanguages.keys;

        function cancel() {
            $mdDialog.cancel();
        }

        function save(form) {
            if (!form.$valid) {
                return;
            }
            documentTypeService.saveDocumentType(dt.documentType)
                    .then(refreshInfoAfterSuccess, saveError);
        }

        function refreshInfoAfterSuccess(savedDocumentType) {
            $mdDialog.hide();
            vm.loadList();
        }

        function saveError(response) {
            console.log(response);
        }
    }
}