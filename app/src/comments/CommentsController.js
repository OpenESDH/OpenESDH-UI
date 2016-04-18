    angular
        .module('openeApp.comments')
        .controller('CommentsController', CommentsController);
    
    function CommentsController($scope, $mdDialog, $translate, commentsService){
        var vm = this;
        vm.comments = [];
        vm.addComment = addComment;
        vm.deleteComment = deleteComment;
        vm.editComment = editComment;
        
        loadList();
        
        function loadList(){
            commentsService.getComments($scope.commentsNodeRef).then(function(result){
                vm.comments = result;
            });
        }
        
        function deleteComment(ev, comment){
            var confirm = $mdDialog.confirm()
                    .title($translate.instant('COMMON.CONFIRM'))
                    .textContent($translate.instant('COMMENTS.ARE_YOU_SURE_YOU_WANT_DELETE_COMMENT'))
                    .targetEvent(ev)
                    .ok($translate.instant('COMMON.YES'))
                    .cancel($translate.instant('COMMON.CANCEL'));
            $mdDialog.show(confirm).then(function() {
                commentsService.deleteComment(comment.nodeRef)
                    .then(loadList);
            });
        }
        
        function addComment(){
            showDialog(null);
        }
        
        function editComment(comment){
            showDialog(angular.copy(comment));
        }
        
        function showDialog(comment){
            $mdDialog.show({
                controller: CommentsDialogController,
                controllerAs: 'dlg',
                templateUrl: 'app/src/comments/view/commentDialog.html',
                parent: angular.element(document.body),
                targetEvent: null,
                clickOutsideToClose: true,
                locals: {
                    commentsNodeRef: $scope.commentsNodeRef,
                    comment: comment
                }
            }).then(loadList);
        }
        
        function CommentsDialogController($mdDialog, commentsService, commentsNodeRef, comment){
            var dlg = this;
            dlg.comment = comment == null ? {}  : comment;
            dlg.isNew = comment == null;
            dlg.save = save;
            dlg.cancel = function(){
                $mdDialog.cancel();
            };
            
            function save(){
                if(dlg.isNew){
                    commentsService.postComment(commentsNodeRef, dlg.comment.title, dlg.comment.content).then(function(){
                        $mdDialog.hide();
                    });
                }else{
                    commentsService.updateComment(dlg.comment.nodeRef, dlg.comment.title, dlg.comment.content).then(function(){
                        $mdDialog.hide();
                    });
                }
            }
        }
    }