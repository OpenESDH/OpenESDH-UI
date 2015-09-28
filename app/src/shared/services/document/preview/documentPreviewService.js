(function() {
    'use strict';

    angular
        .module('openeApp')
        .factory('documentPreviewService', DocumentPreviewService);

    DocumentPreviewService.$inject = ['$mdDialog', 'alfrescoDocumentService', 'alfrescoDownloadService', 'PDFViewerService', 'sessionService', '$http', '$sce'];

    function DocumentPreviewService($mdDialog, alfrescoDocumentService, alfrescoDownloadService, pdf, sessionService, $http, $sce) {
        
        var templatesUrl = 'app/src/shared/services/document/preview/view/';
        
        var service = {
            templatesUrl : templatesUrl,
            previewDocument: previewDocument,
            previewDocumentPlugin: previewDocumentPlugin,
            _getPluginByMimeType: _getPluginByMimeType,
            plugins: getPlugins()
        };
        return service;
        
        function previewDocument(nodeRef){
            var _this = this;
            this.previewDocumentPlugin(nodeRef).then(function(plugin){
                previewDialog(plugin);
            });
        }
        
        function previewDocumentPlugin(nodeRef){
            var _this = this;
            return alfrescoDocumentService.retrieveSingleDocument(nodeRef).then(function(item){
                return _this._getPluginByMimeType(item);
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
            
            if(plugin.initScope){
                plugin.initScope($scope);
            }
            
        }
        
        function getPlugins(){
            var plugins = [
                           audioViewer(),
                           pdfViewer(),
                           imageViewer(),
                           videoViewer(),
                           strobeMediaPlayback(),
                           webViewer(),
                           cannotPreviewPlugin()
                       ];
            return plugins;
        }
        
        function _getPluginByMimeType(item){
            var resultPlugin = null;
            for(var i in this.plugins){
                var plugin = this.plugins[i];
                if(plugin.acceptsItem(item)){
                    plugin.initPlugin(item);
                    return plugin;
                }
            }
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
                initScope: function($scope){
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
            var viewer = {
                mimeTypes: ['application/pdf'],
                thumbnail: 'pdf',
                templateUrl: 'pdf.html',
                initScope: function($scope){
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
                }
            };
            var result = generalPreviewPlugin();
            return angular.extend(result, viewer);
        }
        
        function webViewer(){
            var viewer = {
                    mimeTypes: [
                                'text/plain',
                                'text/html',
                                'text/xml',
                                'text/xhtml+xml'
                                ],
                    templateUrl: 'web.html',
                    initScope: function($scope){
                        var _this = this;
                        $http.get(this.contentUrl).then(function(response){
                            if(_this.mimeType == 'text/html' || _this.mimeType == 'text/xhtml+xml'){
                                $scope.htmlContent = $sce.trustAsHtml(response.data);    
                            }else{
                                $scope.plainTextContent = response.data;
                            }
                        });
                    }
            };
            var result = generalPreviewPlugin();
            return angular.extend(result, viewer);
        }
        
        function cannotPreviewPlugin(){
            var viewer = {
                templateUrl: 'cannotPreview.html',
                _acceptsMimeType: function(item){
                    return true;
                }
            };
            return angular.extend(generalPreviewPlugin(), viewer);
        }
        
        function generalPlaybackPlugin(){
            var plugin = {
                    initScope: function($scope){
                        var hostUrl = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
                        this.contentUrl = hostUrl + this.contentUrl;
                    }
            };
            var result = generalPreviewPlugin();
            return angular.extend(result, plugin);
        }
        
        function generalPreviewPlugin(){
            return {
                acceptsItem: function(item){
                    return this._acceptsMimeType(item) || this._acceptsThumbnail(item);
                },
                
                initPlugin: function(item){
                    this.nodeRef = item.node.nodeRef;
                    this.fileName = item.location.file;
                    this.itemSize = item.node.size;
                    this.mimeType = item.node.mimetype;
                    this.contentUrl = this._acceptsMimeType(item) ? this._getContentUrl(item) : this._getThumbnailUrl(item);
                },
                
                _acceptsMimeType: function(item){
                    if(this.mimeTypes === null || this.mimeTypes === undefined){
                        return false;
                    }
                    return this.mimeTypes.indexOf(item.node.mimetype) !== -1;
                },
                
                _acceptsThumbnail: function(item){
                    if(this.thumbnail === null || this.thumbnail === undefined 
                            || item.thumbnailDefinitions === null || item.thumbnailDefinitions === undefined){
                        return false;
                    }
                    return item.thumbnailDefinitions.indexOf(this.thumbnail) !== -1;
                },
                
                _getContentUrl: function(item){
                    return '/alfresco/service' + item.node.contentURL + '?' + this._getSessionTicket();
                },
                
                _getThumbnailUrl: function(item, fileSuffix){
                    var nodeRefAsLink = this.nodeRef.replace(":/", ""),
                    noCache = "&noCache=" + new Date().getTime(),
                    force = "c=force";
                    var lastModified = this._getLastThumbnailModification(item);
                    
                    return "/alfresco/s/api/node/" + nodeRefAsLink + "/content/thumbnails/" + this.thumbnail + (fileSuffix ? "/suffix" + fileSuffix : "") 
                        + "?" + force + lastModified + noCache + '&' + this._getSessionTicket();
                },
                
                _getLastThumbnailModification: function(item){
                    var thumbnailModifications = item.node.properties["cm:lastThumbnailModification"];
                    if(!thumbnailModifications){
                        thumbnailModifications = [];
                    }
                    for(var i in thumbnailModifications){
                        var thumbnailModification = thumbnailModifications[i];
                        if (thumbnailModification.indexOf(this.thumbnail) !== -1){
                            return "&lastModified=" + encodeURIComponent(thumbnailModification);
                        }
                    }
                    return "";
                },
                
                _getSessionTicket: function(){
                    return 'alf_ticket=' + sessionService.getUserInfo().ticket;
                }
            };
        }
    }
})();
