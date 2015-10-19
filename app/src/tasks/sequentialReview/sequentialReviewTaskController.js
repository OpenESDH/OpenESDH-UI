   
    angular.module('openeApp.sequentialReview.tasks')
        .controller('sequentialReviewTaskController', sequentialReviewTaskController);
    
    function sequentialReviewTaskController($controller) {
        angular.extend(this, $controller('baseTaskController', {}));
        var vm = this;
        vm.canSave = canSave;
        
        init();
        
        function init(){
            vm.reviewOutcomeProperty = 'wf_seqReviewOutcome';
            vm.reviewOutcomeApprove = 'Approve';
            vm.reviewOutcomeReject = 'Reject';
            vm.init().then(function(result){
                var commentsJson = vm.task.properties['wf_comments'];
                if(commentsJson == null){
                    vm.taskComments = [];
                }else{
                    vm.taskComments = angular.fromJson(commentsJson).reverse();
                }    
            });
        }
        
        function canSave(){
            var vm = this;
            if(vm.task == undefined){
                return false;
            }
            var comment = vm.task.properties.bpm_comment;
            return comment != null && comment.length > 1;
        }
        
    }