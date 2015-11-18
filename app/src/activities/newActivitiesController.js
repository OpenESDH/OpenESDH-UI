angular
        .module('openeApp.activities')
        .controller('newActivitiesController', newActivitiesController);
    
    function newActivitiesController(activitiesService){
        var vm = this;
        
        activitiesService.setActivitiesPoll(pollResult);
        
        function pollResult(result){
            if(result === undefined){
                return;
            }
            
            if(result.count == "0"){
                vm.newActivitiesCount = "";
            }else{
                vm.newActivitiesCount = "(" + result.count + ")";
            }
        }
    }