     angular.module('openeApp.common.directives')
        .directive('caseDocsSelector', caseDocsSelector);
     
     function caseDocsSelector(caseDocumentsService, fileUtilsService){
         return {
             restrict: 'E',
             templateUrl: 'app/src/common/directives/caseDocsSelector/view/caseDocsSelector.html',
             scope: {
                 caseId: '&',
                 docsFolderNodeRef: '&',
                 selectedDocs: '='
             },
             link: link
         };
         
         function link(scope){
             scope.docFolderItems = [];
             scope.onItemSelectionChanged = onItemSelectionChanged;
             if(scope.caseId != undefined && scope.caseId() != undefined){
                 caseDocumentsService.getDocumentsFolderNodeRef(scope.caseId()).then(function(result){
                     scope.folderNodeRef = result.caseDocsFolderNodeRef;
                     loadDocuments(scope);
                 });
             }else{
                 scope.folderNodeRef = scope.docsFolderNodeRef();
                 loadDocuments(scope);
             }
             
             function onItemSelectionChanged(item){
                 if(item.selected === true){
                     onSelectItem(item);
                 }else{
                     onUnselectedItem(item);
                 }
                 updateSelectedDocsModel(scope);
             }
         }
         
         function loadDocuments(scope){
             caseDocumentsService.getDocsFolderHierarchy(scope.folderNodeRef).then(function(response) {
                 scope.docFolderItems = response.documents;
                 setParentAndThumbs(scope.docFolderItems);
             });
         }
         
         function setParentAndThumbs(items, parent) {
             var mimeTypeProperty = 'mimetype';
             items.forEach(function(item) {
                 if(item.folder === true){
                     item.thumbNailURL = fileUtilsService.getFolderIcon(24);
                     if(item.children && item.children.length > 0){
                         setParentAndThumbs(item.children, item);
                     }
                 }else{
                     item.thumbNailURL = fileUtilsService.getFileIconByMimetype(item[mimeTypeProperty], 24);
                     if(item.attachments && item.attachments.length > 0){
                         setParentAndThumbs(item.attachments, item);
                     }
                 }
                 if(parent != undefined){
                     item.parent = parent;
                 }
             });
         }
         
         function onSelectItem(item){
             var parent = item.parent;
             
             if(parent === undefined){
                 return;
             }
             
             if(!parent.selected){
                 parent.selected = true;
                 onSelectItem(parent);
             }
         }
         
         function onUnselectedItem(item){
             if(item.folder && item.children != undefined){                        
                 item.children.forEach(function(child){
                     child.selected = false;
                     onUnselectedItem(child);
                 });
             }else if(item.attachments != undefined){
                 item.attachments.forEach(function(attachment){
                     attachment.selected = false;
                 });
             }
         }
         
         function updateSelectedDocsModel(scope){
             scope.selectedDocs = getSelectedItems(scope.docFolderItems);
         }
         
         function getSelectedItems(items){
             return items.filter(function(item){
                 return item.selected === true;
             }).map(function(item){
                 
                 var resultItem = angular.copy(item);
                 delete resultItem.selected;
                 delete resultItem.parent;
                 delete resultItem.thumbNailURL;
                 delete resultItem.expanded;
                 
                 if(item.folder){
                     resultItem.children = getSelectedItems(item.children);
                 }else{
                     resultItem.attachments = item.attachments.filter(function(attachment){
                         return attachment.selected === true;
                     }).map(function(attachment){
                         var resultAttachment = angular.copy(attachment);
                         delete resultAttachment.selected;
                         delete resultAttachment.parent;
                         delete resultAttachment.thumbNailURL;
                         return resultAttachment;
                     });
                 }
                 return resultItem;
             });
         }
     }