    angular.module('openeApp.common.directives')
        .directive('fileDropUpload', fileDropUpload);
     
     function fileDropUpload($mdDialog){
         return {
             restrict: 'E',
             templateUrl: 'app/src/common/directives/fileDropUpload/view/fileDropUpload.html',
             transclude: true,
             scope: {
                 folderNodeRef: "&",
                 onComplete: "&"
             },
             link: link
         };
         
         function link(scope){
             scope.uploadFiles = uploadFiles;

             function uploadFiles(files){
                 if(!files){
                     return;
                 }
                 
                 $mdDialog.show({
                     controller: FileUploadDialog,
                     controllerAs: 'dlg',
                     templateUrl: 'app/src/common/directives/fileDropUpload/view/filesUploadDialog.html',
                     parent: angular.element(document.body),
                     targetEvent: null,
                     clickOutsideToClose: false,
                     locals: {
                         files: files,
                         folderNodeRef: scope.folderNodeRef()
                     }
                 }).then(function(){
                     if(scope.onComplete != undefined){
                         scope.onComplete();    
                     }
                 });
             }
             
             function FileUploadDialog($scope, $mdDialog, $timeout, alfrescoUploadService, fileUtilsService, files, folderNodeRef){
                 var dlg = this;
                 dlg.files = [];
                 dlg.removeFile = removeFile;
                 
                 files.forEach(function(file){
                     if(file.$error){
                         return;
                     }
                     
                     file.thumb = fileUtilsService.getFileIcon(file.name, 24);
                     file.progress = 0;
                     file.upload = alfrescoUploadService.uploadFileTrackProgress(file, folderNodeRef).xhr(function(xhr){
                         file.abort = function(){
                             xhr.abort();
                             file.upload.aborted = true;
                         };
                     }).then(function(response){
                           $timeout(function () {
                             file.data = response.data;
                             checkAllUploaded();
                           });
                     }, null, function(evt){
                         file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                     });
                     
                     dlg.files.push(file);
                 });
                 
                 function removeFile(file){
                     if(file.progress < 100 && !file.upload.aborted){
                         file.abort();
                     }
                     
                     var fileIndex = dlg.files.indexOf(file);
                     if(fileIndex > -1){
                         dlg.files.splice(fileIndex, 1);
                     }
                     checkAllUploaded();
                 }
                 
                 function checkAllUploaded(){
                     var filesInProgress = dlg.files.filter(function(file){
                         return file.progress < 100 && !file.upload.aborted
                     });
                     if(filesInProgress == 0){
                         $mdDialog.hide();
                     }
                 }
             }
         }
     }