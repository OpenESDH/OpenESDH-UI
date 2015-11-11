
    angular
        .module('openeApp.activities')
        .factory('activitiesService', activitiesService);

    function activitiesService($http) {
        return {
            getUserActivities: getUserActivities
        };
        
        function getUserActivities(skipCount, maxItems){
            var url = "/alfresco/s/api/openesdh/activities/feed";
            var config = {
                params: {}
            };
            if(skipCount != undefined){
                config.params.skipCount = skipCount;
            }
            if(maxItems != undefined){
                config.params.maxItems = maxItems;
            }
            return $http.get(url, config).then(function(result){
                return result.data;
            });
        }
    }