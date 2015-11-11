
    angular
        .module('openeApp.activities')
        .factory('activitiesService', activitiesService);

    function activitiesService($http) {
        return {
            getUserActivities: getUserActivities,
            countCurrentUserNewActivities: countCurrentUserNewActivities,
            setCurrentUserLastReadActivityFeedId: setCurrentUserLastReadActivityFeedId
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
        
        function countCurrentUserNewActivities(){
            var url = "/alfresco/s/api/openesdh/activities/feed/new/count";
            return $http.get(url).then(function(result){
                return result.data;
            });          
        }
        
        function setCurrentUserLastReadActivityFeedId(feedId){
            var url = "/api/openesdh/activities/feed/last/read/id/" + feedId;
            return $http.post(url).then(function(result){
                return result.data;
            });
        }
    }