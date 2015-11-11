angular
        .module('openeApp.activities')
        .controller('newActivitiesController', newActivitiesController);
    
    function newActivitiesController($timeout, activitiesService){
        var vm = this;
        
        (function poll(){
            activitiesService.countCurrentUserNewActivities().then(function(result){
                if(result.count == "0"){
                    vm.newActivitiesCount = "";
                }else{
                    vm.newActivitiesCount = "(" + result.count + ")";
                }
                $timeout(poll, 60000);
            });
        })();
        
    }