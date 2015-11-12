angular
        .module('openeApp.activities')
        .controller('newActivitiesController', newActivitiesController);
    
    function newActivitiesController($interval, activitiesService){
        var vm = this;
        vm.pollInterval = $interval(poll, 10000);
        function poll(){
            activitiesService.countCurrentUserNewActivities().then(function(result){
                if(result.count == "0"){
                    vm.newActivitiesCount = "";
                }else{
                    vm.newActivitiesCount = "(" + result.count + ")";
                }
            });
        }
    }