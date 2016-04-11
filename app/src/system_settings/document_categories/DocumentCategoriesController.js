
    angular
        .module('openeApp.systemsettings')
        .controller('DocumentCategoriesController', DocumentCategoriesController);

    function DocumentCategoriesController($controller) {
        angular.extend(this, $controller('ClassifierValuesController', {classifType: 'dcategory'}));
        var vm = this;
        vm.deleteConfirmMessage = 'DOCUMENT_CATEGORIES.ARE_YOU_SURE_YOU_WANT_TO_DELETE_DOCUMENT_CATEGORY_X';
        vm.dialogTitleMessageKey = 'DOCUMENT_CATEGORIES.CREATE_EDIT_DOC_CATEGORY';
        vm.newClassifValueMessageKey = 'DOCUMENT_CATEGORIES.CREATE_NEW_DOC_CATEGORY';
        
        vm.loadList();
    }