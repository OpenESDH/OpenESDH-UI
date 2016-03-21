
    angular
        .module('openeApp.activities')
        .provider('activitiesService', activitiesServiceProvider);

    function activitiesServiceProvider(){
        
        var activitiesPoll = null;
        var pollRunning = false; // to prevent subsequent call when session expired
        
        this.$get = activitiesService;
        
        function activitiesService($http, $interval, sessionService) {
            return {
                getUserActivities: getUserActivities,
                countCurrentUserNewActivities: countCurrentUserNewActivities,
                setCurrentUserLastReadActivityFeedId: setCurrentUserLastReadActivityFeedId,
                setActivitiesPoll: setActivitiesPoll
            };
            
            function setActivitiesPoll(callback){
                var _this = this;
                if(activitiesPoll != null){
                    //unregister previous poll and set a new one
                    cancelPoll();
                }    
                
                activitiesPoll = $interval(function(){
                    if(!sessionService.getUserInfo()) {
                        // Stop polling - if we got no session
                        return cancelPoll();
                    }
                    if(pollRunning){
                        return;
                    }
                    pollRunning = true;
                    _this.countCurrentUserNewActivities().then(function(result){
                        pollRunning = false;
                        return result;
                    }).then(callback);
                }, 10000);
            }
            
            function getUserActivities(skipCount, maxItems){
                var url = "/api/openesdh/activities/feed";
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
                var url = "/api/openesdh/activities/feed/new/count";
                return $http.get(url, {transformRequest: angular.noop}).then(function(result){                    
                    return result.data;
                }, function(error){
                    if(error.status == 401){
                        //stop polling if unauthorized or session expired
                        return cancelPoll();
                    }
                });          
            }
            
            function setCurrentUserLastReadActivityFeedId(feedId){
                var url = "/api/openesdh/activities/feed/last/read/id/" + feedId;
                return $http.post(url).then(function(result){
                    return result.data;
                });
            }
            
            function cancelPoll(){
                if(activitiesPoll != null){
                    $interval.cancel(activitiesPoll);
                    activitiesPoll = null;    
                }
                pollRunning = false;
            }
        }
    }
    