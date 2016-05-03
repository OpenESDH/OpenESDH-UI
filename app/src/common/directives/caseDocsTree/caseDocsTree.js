    angular.module('openeApp.common.directives')
        .directive('caseDocsTree', caseDocsTree);
     
     function caseDocsTree(fileUtilsService){
         return {
             restrict: 'E',
             templateUrl: 'app/src/common/directives/caseDocsTree/view/caseDocsTree.html',
             require: "?ngModel",
             link: link
         };
         
         function link(scope, element, attrs){
             scope.items = [];
             scope.$watch(attrs.ngModel, function(docs){
                 if(docs === undefined){
                     return;
                 }
                 var items = angular.copy(docs);
                 setThumbs(items);
                 scope.items = items;
             });
         }
         
         function setThumbs(items) {
             var mimeTypeProperty = 'mimetype';
             items.forEach(function(item) {
                 if(item.folder === true){
                     item.thumbNailURL = fileUtilsService.getFolderIcon(24);
                     if(item.children && item.children.length > 0){
                         setThumbs(item.children);
                     }
                 }else{
                     item.thumbNailURL = fileUtilsService.getFileIconByMimetype(item[mimeTypeProperty], 24);
                     if(item.attachments && item.attachments.length > 0){
                         setThumbs(item.attachments);
                     }
                 }
             });
         }
     }