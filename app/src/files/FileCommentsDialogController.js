
angular
        .module('openeApp.files')
        .controller('FileCommentsDialogController', FileCommentsDialogController);

function FileCommentsDialogController($mdDialog, file) {
    var vm = this;
    vm.file = file;
    vm.close = close;

    function close() {
        $mdDialog.hide();
    }
}