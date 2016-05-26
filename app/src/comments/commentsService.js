    angular
        .module('openeApp.comments')
        .factory('commentsService', commentsService);
    
    function commentsService($http, alfrescoNodeUtils){
        return {
            postComment: postComment,
            deleteComment: deleteComment,
            updateComment: updateComment,
            getComments: getComments
        };
        
        function postComment(nodeRef, title, content){
            return $http.post('/api/node/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri + '/comments', {title: title, content: content}).then(function(result){
                return result;
            });
        }
        
        function deleteComment(nodeRef){
            return $http.delete('/api/comment/node/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri);
        }
        
        function updateComment(nodeRef, title, content){
            return $http.put('/api/comment/node/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri, {title: title, content: content});
        }
        
        function getComments(nodeRef){
            return $http.get('/api/node/' + alfrescoNodeUtils.processNodeRef(nodeRef).uri + '/comments', {params: {reverse: true}}).then(function(result){
                return result.data;
            });
        }
    }