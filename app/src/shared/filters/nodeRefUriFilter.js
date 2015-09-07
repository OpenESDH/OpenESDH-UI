(function() {
    'use strict';
    
    angular
        .module('openeApp')
        .filter('nodeRefUri', nodeRefUriFilterFactory);
    
    nodeRefUriFilterFactory.$inject = ['alfrescoNodeUtils'];
    
    function nodeRefUriFilterFactory(alfrescoNodeUtils){
        function nodeRefUriFilter(nodeRef) {
            return alfrescoNodeUtils.processNodeRef(nodeRef).uri;
        }
        return nodeRefUriFilter;
    }
    
})();
    
