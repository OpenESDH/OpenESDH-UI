    angular
        .module('openeApp')
        .factory('commentsService', commentsService);
    
    function commentsService($http, alfrescoNodeUtils){
        return {
            postComment: postComment
        };
        
        function postComment(nodeRef, title, content){
            return $http.post('/api/node/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri + '/comments', {title: title, content: content}).then(function(result){
                return result;
            })
        }
    }