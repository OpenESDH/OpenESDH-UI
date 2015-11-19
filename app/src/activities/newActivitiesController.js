angular
        .module('openeApp.activities')
        .controller('newActivitiesController', newActivitiesController);
    
    function newActivitiesController(activitiesService){
        var vm = this;
        vm.pollInterval = $interval(poll, 10000);
        function poll(){
            if(!sessionService.getUserInfo()) {
                // Stop polling - if we got no session
                return $interval.cancel(vm.pollInterval);
            }
            
            if(result.count == "0"){
                vm.newActivitiesCount = "";
            }else{
                vm.newActivitiesCount = "(" + result.count + ")";
            }
        }
    }