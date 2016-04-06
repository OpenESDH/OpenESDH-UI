
angular
        .module('openeApp.files')
        .controller('FileCommentsDialogController', FileCommentsDialogController);

function FileCommentsDialogController($mdDialog, file, commentsService) {
    var vm = this;
    vm.file = file;
    vm.close = close;
    vm.addComment = addComment;
    vm.newComment = "";

    function close() {
        $mdDialog.cancel();
    }
    
    function addComment(){
        if(vm.newComment.length == 0){
            return;
        }
        commentsService.postComment(vm.file.nodeRef, null, vm.newComment).then(function(){
            $mdDialog.hide();
        });
    }
}