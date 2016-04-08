
    angular
        .module('openeApp.systemsettings')
        .controller('DocumentTypesController', DocumentTypesController);

    function DocumentTypesController($controller, documentTypeService) {
        angular.extend(this, $controller('ClassifierValuesController', {classifierValuesService: documentTypeService}));
        var vm = this;
        vm.deleteConfirmMessage = 'DOCUMENT_TYPES.ARE_YOU_SURE_YOU_WANT_TO_DELETE_DOCUMENT_TYPE_X';
        vm.dialogTitleMessageKey = 'DOCUMENT_TYPES.CREATE_EDIT_DOC_TYPE';
        vm.newClassifValueMessageKey = 'DOCUMENT_TYPES.CREATE_NEW_DOC_TYPE';
        
        vm.loadList();
    }