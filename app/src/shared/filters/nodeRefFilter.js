(function() {
    'use strict';
    
    angular
        .module('openeApp')
        .filter('nodeRef', nodeRefFilterFactory);
    
    nodeRefFilterFactory.$inject = ['alfrescoNodeUtils'];
    
    function nodeRefFilterFactory(alfrescoNodeUtils){
        function nodeRefFilter(nodeRef) {
            return alfrescoNodeUtils.processNodeRef(nodeRef).uri;
        }
        return nodeRefFilter;
    }
    
})();
    
