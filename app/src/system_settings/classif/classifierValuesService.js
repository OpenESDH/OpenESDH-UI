    angular
        .module('openeApp.systemsettings')
        .factory('classifierValuesService', classifierValuesService);
    
    function classifierValuesService($http, alfrescoNodeUtils){
        return {
            getClassifierValues: getClassifierValues,
            saveClassifierValue: saveClassifierValue,
            deleteClassifierValue: deleteClassifierValue
        };
        
        function getClassifierValues(classifType){
            return $http.get('/api/openesdh/classifer/' + classifType).then(function(result){
                return result.data;
            });
        }
        
        function saveClassifierValue(classifType, classifValue){
            return $http.post('/api/openesdh/classifer/' + classifType, classifValue);
        }
        
        function deleteClassifierValue(classifType, nodeRef){
            return $http.delete('/api/openesdh/classifer/' + classifType + "/" + alfrescoNodeUtils.processNodeRef(nodeRef).uri);
        }
    }