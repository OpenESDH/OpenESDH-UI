    angular
        .module('openeApp.systemsettings')
        .factory('partyRolesService', partyRolesService);
    
    function partyRolesService($http, alfrescoNodeUtils){
        return {
            getClassifierValues: getClassifierValues,
            saveClassifierValue: saveClassifierValue,
            deleteClassifierValue: deleteClassifierValue
        };
        
        function getClassifierValues(){
            return $http.get('/api/openesdh/party/roles').then(function(result){
                return result.data;
            });
        }
        
        function saveClassifierValue(partyRole){
            return $http.post('/api/openesdh/party/roles', partyRole);
        }
        
        function deleteClassifierValue(nodeRef){
            return $http.delete('/api/openesdh/party/roles/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri);
        }
    }