    angular.module('openeApp.common.directives')
        .directive('fileDropUpload', fileDropUpload);
     
     function fileDropUpload(filesService, $timeout, fileUtilsService){
         return {
             restrict: 'E',
             templateUrl: 'app/src/common/directives/fileDropUpload/view/fileDropUpload.html',
             scope: {
                 form: '=',
                 filesModel: '=',
                 fileAddonSrc: '&',
                 onInit: '&'
             },
             link: link
         };
         
         function link(scope){
             scope.appendFileAddon = false;
             scope.uploadFiles = uploadFiles;
             scope.removeFile = removeFile;
             scope.files = [];
             
             if(scope.fileAddonSrc != undefined && scope.fileAddonSrc() != undefined){
                 scope.appendFileAddon = true;
                 scope.fileAddon = scope.fileAddonSrc();
             }
             
             if(scope.onInit != undefined){
                 scope.onInit({scope: scope});
             }
             
             function uploadFiles(files){
                 if(!files){
                     return;
                 }
                 files.forEach(function(file){
                     if(file.$error){
                         return;
                     }
                     
                     file.thumb = fileUtilsService.getFileIcon(file.name, 24);
                     file.progress = 0;
                     file.upload = filesService.uploadTempFile(file).xhr(function(xhr){
                         file.abort = function(){
                             xhr.abort();
                             file.upload.aborted = true;
                         };
                     }).then(function(response){
                           $timeout(function () {
                             file.data = response.data;
                             validate();
                             if(scope.filesModel != undefined){
                                 scope.filesModel.push(file.data);
                             }
                           });
                     }, null, function(evt){
                         file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                     });
                     
                     scope.files.push(file);
                     validate();
                 });
             }
             
             function removeFile(file){
                 if(file.progress < 100 && !file.upload.aborted){
                     file.abort();
                 }
                 
                 var fileIndex = scope.files.indexOf(file);
                 if(fileIndex > -1){
                     scope.files.splice(fileIndex, 1);
                 }
                 
                 if(scope.filesModel != undefined){
                     var modelIndex = scope.filesModel.indexOf(file.data);
                     if(modelIndex > -1){
                         scope.filesModel.splice(modelIndex, 1);
                     }
                 }
                 
                 validate();
             }
             
             function validate(){
                 if(scope.form == undefined){
                     return;
                 }
                 var filesInProgress = scope.files.filter(function(file){
                     return file.progress < 100 && !file.upload.aborted
                 });
                 if(filesInProgress.length != 0){
                     scope.form.$setValidity('filesInProgress', false);
                 }else{
                     scope.form.$setValidity('filesInProgress', true);
                 }
             }
         }
     }