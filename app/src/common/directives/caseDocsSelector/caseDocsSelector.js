     angular.module('openeApp.common.directives')
        .directive('caseDocsSelector', caseDocsSelector);
     
     function caseDocsSelector(caseDocumentsService, fileUtilsService){
         return {
             restrict: 'E',
             templateUrl: 'app/src/common/directives/caseDocsSelector/view/caseDocsSelector.html',
             scope: {
                 caseId: '&',
                 docsFolderNodeRef: '&',
                 selectedDocs: '=',
                 selectFolders: '&',
                 selectLockedDocs: '&',
                 selectDocNodeRefs: '&',
                 itemAddonSrc: '&',
                 singleSelect: '&',
                 directChildSelect: '&'
             },
             link: link
         };
         
         function link(scope){
             scope.docFolderItems = [];
             scope.onItemSelectionChanged = onItemSelectionChanged;
             scope.updateModel = updateModel;
             scope.folderSelect = false;
             scope.lockedDocsSelect = true;
             scope.docNodeRefsSelect = false;
             scope.appendItemAddon = false;
             scope.isSingleSelect = false;
             scope.singleSelectedItem = null;
             scope.isDirectChildSelect = false;
             
             if(scope.singleSelect != undefined && scope.singleSelect() === true){
                 scope.isSingleSelect = true;
             }
             
             if(scope.selectLockedDocs != undefined && scope.selectLockedDocs() === false){
                 scope.lockedDocsSelect = false;
             }
             
             if(scope.selectFolders != undefined && scope.selectFolders() === true){
                 scope.folderSelect = true;
             }
             
             if(scope.selectDocNodeRefs != undefined && scope.selectDocNodeRefs() === true){
                 scope.docNodeRefsSelect = true;
             }
             
             if(scope.itemAddonSrc != undefined && scope.itemAddonSrc() != undefined){
                 scope.appendItemAddon = true;
                 scope.itemAddon = scope.itemAddonSrc();
             }
             
             if(scope.directChildSelect != undefined && scope.directChildSelect() === true){
                 scope.isDirectChildSelect = true;
             }
             
             if(scope.caseId != undefined && scope.caseId() != undefined){
                 caseDocumentsService.getDocumentsFolderNodeRef(scope.caseId()).then(function(result){
                     scope.folderNodeRef = result.caseDocsFolderNodeRef;
                     loadDocuments(scope);
                 });
             }else{
                 scope.folderNodeRef = scope.docsFolderNodeRef();
                 loadDocuments(scope);
             }
             
             function updateModel(){
                 updateSelectedDocsModel(scope);
             }
             
             function onItemSelectionChanged(item){
                 if(scope.isSingleSelect){
                     scope.singleSelectedItem = null;
                     if(item.selected === true){
                         removeSelections();
                         item.selected = true;
                         scope.singleSelectedItem = item;
                     }
                 }else if(item.selected === true){
                     onSelectItem(item);
                 }else{
                     onUnselectedItem(item);
                 }
                 
                 updateSelectedDocsModel(scope);
             }
             
             function onSelectItem(item){
                 var parent = item.parent;
                 
                 if(parent === undefined || scope.isDirectChildSelect){
                     return;
                 }
                 
                 if(!parent.selected){
                     if(parent.folder && !scope.folderSelect){
                         return;
                     }
                     parent.selected = true;
                     onSelectItem(parent);
                 }
             }
             
             function removeSelections(){
                 scope.docFolderItems.forEach(function(item){
                     item.selected = false;
                     onUnselectedItem(item);
                 });
             }
             
             function onUnselectedItem(item){
                 if(scope.isDirectChildSelect){
                     return;
                 }
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
         
         function updateSelectedDocsModel(scope){
             
             if(scope.folderSelect){
                 scope.selectedDocs = getSelectedItems(scope.docFolderItems, scope);
                 return;
             }
             
             var selectedDocs = [];
             if(scope.isSingleSelect){
                 if(scope.singleSelectedItem != null){
                     selectedDocs.push(scope.singleSelectedItem);
                 }
             }else{
                 getSelectedDocuments(scope.docFolderItems);                 
             }             
             scope.selectedDocs = selectedDocs;
             
             function getSelectedDocuments(items){
                 items.forEach(function(item){
                     
                     if(item.folder){
                         getSelectedDocuments(item.children);
                         return;
                     }
                     
                     if(scope.isDirectChildSelect){
                         item.attachments.filter(function(attachment){
                             return attachment.selected === true;
                         }).forEach(function(attachment){
                             if(scope.docNodeRefsSelect){
                                 selectedDocs.push(attachment.nodeRef);
                             }else{
                                 var copy = plainCopy(attachment);
                                 selectedDocs.push(copy);    
                             }
                         });
                     }
                     
                     if(!item.selected){
                         return;
                     }
                     
                     if(scope.docNodeRefsSelect){
                         selectedDocs.push(item.mainDocNodeRef);
                         item.attachments.filter(function(attachment){
                             return attachment.selected === true;
                         }).forEach(function(attachment){
                             selectedDocs.push(attachment.nodeRef);
                         });
                         return;
                     }
                     
                     var resultItem = plainCopy(item);
                     if(!scope.isDirectChildSelect){
                         resultItem.attachments = getSelectedAttachments(item.attachments);
                     }
                     selectedDocs.push(resultItem);
                 })
             }
         }
         
         function getSelectedItems(items, scope){
             return items.filter(function(item){
                 return item.selected === true;
             }).map(function(item){
                 
                 var resultItem = plainCopy(item);
                 
                 if(item.folder){
                     resultItem.children = getSelectedItems(item.children);
                 }else{
                     resultItem.attachments = getSelectedAttachments(item.attachments)
                 }
                 
                 return resultItem;
             });
         }
         
         function getSelectedAttachments(attachments){
             return attachments.filter(function(attachment){
                 return attachment.selected === true;
             }).map(function(attachment){
                 return plainCopy(attachment);
             });
         }
         
         function plainCopy(item){
             var resultItem = angular.copy(item);
             delete resultItem.selected;
             delete resultItem.parent;
             delete resultItem.thumbNailURL;
             delete resultItem.expanded;
             return resultItem;
         }
     }