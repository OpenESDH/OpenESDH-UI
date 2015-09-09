(function() {
    'use strict';

    angular
        .module('openeApp')
        .factory('documentPreviewService', DocumentPreviewService);

    DocumentPreviewService.$inject = ['$mdDialog', 'alfrescoDocumentService', 'alfrescoDownloadService', 'PDFViewerService', 'sessionService'];

    function DocumentPreviewService($mdDialog, alfrescoDocumentService, alfrescoDownloadService, pdf, sessionService) {
        
        var templatesUrl = 'app/src/shared/services/document/preview/view/';
        
        var service = {                
            previewDocument: previewDocument,
            _getPluginByMimeType: _getPluginByMimeType,
            plugins: getPlugins()
        };
        return service;
        
        function previewDocument(nodeRef){
            var _this = this;
            alfrescoDocumentService.retrieveSingleDocument(nodeRef).then(function(item){
                var plugin = _this._getPluginByMimeType(item);
                previewDialog(plugin);                
            });
        }
        
        function previewDialog(plugin){
            return $mdDialog.show({
                controller: DialogController,
                templateUrl: templatesUrl + 'previewDialog.html',
                parent: angular.element(document.body),
                targetEvent: null,
                clickOutsideToClose: true,
                locals: {
                    plugin: plugin
                }
            });
        }
        
        function DialogController($scope, $mdDialog, plugin) {
            
            $scope.config = plugin;
            $scope.viewerTemplateUrl = templatesUrl + plugin.templateUrl;
            
            $scope.cancel = function() {
              $mdDialog.cancel();
            };
            
            $scope.close = function(){
                $mdDialog.hide();
            };
            
            $scope.download = function(){
                alfrescoDownloadService.downloadFile($scope.config.nodeRef, $scope.config.fileName);
            };
            
            if(plugin.init){
                plugin.init($scope);
            }
            
        }
        
        function getPlugins(){
            var plugins = [
                           audioViewer(),
                           pdfViewer(),
                           imageViewer(),
                           videoViewer(),
                           strobeMediaPlayback()
                       ];
            return plugins;
        }
        
        function _getPluginByMimeType(item){
            var mimeType = item.node.mimetype;
            var resultPlugin = null;
            for(var i in this.plugins){
                var plugin = this.plugins[i];
                if(plugin.acceptsMimeType(mimeType)){
                    resultPlugin = plugin;
                    break;
                }
            }
            
            if(resultPlugin == null){
                resultPlugin = {
                    templateUrl: 'cannotPreview.html',
                };
            }
            
            resultPlugin.nodeRef = item.node.nodeRef;
            resultPlugin.fileName = item.location.file;
            resultPlugin.contentUrl = '/alfresco/service' + item.node.contentURL + '?alf_ticket='+sessionService.getUserInfo().ticket;
            resultPlugin.itemSize = item.node.size;
            resultPlugin.mimeType = item.node.mimetype;
            
            return resultPlugin;
        }
        
        function audioViewer(){
            var viewer = {
                    mimeTypes: ['audio/x-wav'],
                    templateUrl: 'audio.html'
                };
            var result = generalPlaybackPlugin();
            return angular.extend(result, viewer);
        }
        
        function videoViewer(){
            var viewer = {
                mimeTypes: [
                            'video/ogg',
                            'video/webm',
                            'video/x-m4v',
                            'video/mp4'
                            ],
                templateUrl: 'video.html'
            };
            var result = generalPlaybackPlugin();
            return angular.extend(result, viewer);
        }
        
        function strobeMediaPlayback(){
            var viewer = {
                mimeTypes: [
                            'video/x-m4v',
                            'video/x-flv',
                            'video/mp4',
                            'video/quicktime',
                            'audio/mpeg'
                            ],
                templateUrl: 'strobeMediaPlayBack.html'
            };
            
            var result = generalPlaybackPlugin();
            return angular.extend(result, viewer);
        }
        
        function imageViewer(mimeType){
            var viewer = {
                mimeTypes: [
                            'image/png',
                            'image/gif',
                            'image/jpeg'
                            ],
                templateUrl: 'image.html',
                maxItemSize: 2000000,
                init: function($scope){
                    $scope.itemMaxSizeExceeded = (this.itemSize && parseInt(this.itemSize) > this.maxItemSize);
                    if($scope.itemMaxSizeExceeded === false){
                        $scope.imageUrl = $scope.config.contentUrl;
                    }
                }
            };
            var result = generalPreviewPlugin();
            return angular.extend(result, viewer);
        }
        
        function pdfViewer(){
            return {
                templateUrl: 'pdf.html',
                init: function($scope){
                    $scope.viewer = pdf.Instance("viewer");

                    $scope.nextPage = function() {
                        $scope.viewer.nextPage();
                    };

                    $scope.prevPage = function() {
                        $scope.viewer.prevPage();
                    };

                    $scope.pageLoaded = function(curPage, totalPages) {
                        $scope.currentPage = curPage;
                        $scope.totalPages = totalPages;
                    };
                },
                acceptsMimeType: function(mimeType){
                    return mimeType == 'application/pdf';
                }
            };
        }
        
        function generalPlaybackPlugin(){
            var plugin = {
                    init: function($scope){
                        var hostUrl = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
                        this.contentUrl = hostUrl + this.contentUrl;
                    }
            };
            var result = generalPreviewPlugin();
            return angular.extend(result, plugin);
        }
        
        function generalPreviewPlugin(){
            return {
                acceptsMimeType: function(mimeType){
                    for(var i in this.mimeTypes){
                        var mimeT = this.mimeTypes[i];
                        if(mimeT == mimeType){
                            return true;
                        }
                    }
                    return false;
                }
            };
        }
        
    }
})();
