    angular
        .module('openeApp')
        .factory('formProcessorService', formProcessorService);

    function formProcessorService($http, alfrescoNodeUtils) {
        return {
            createNode: createNode,
            updateNode: updateNode
        };
        
        function createNode(type, props){
            return $http.post('/api/type/' + type + '/formprocessor', props).then(function (response) {
                var nodeRef = response.data.persistedObject;
                return nodeRef;
            });
        }
        
        function updateNode(nodeRef, props){
            return $http.post('/api/node/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri + '/formprocessor', props).then(function (response) {
                return response.data;
            });
        }
    }