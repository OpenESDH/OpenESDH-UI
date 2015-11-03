
    angular
        .module('openeApp.documents')
        .controller('DocumentController', DocumentController);
    
    function DocumentController($scope, $state, $stateParams, $mdDialog, $translate, documentService, caseDocumentsService, documentPreviewService,
                caseDocumentFileDialogService, casePartiesService, alfrescoFolderService, sessionService, caseService, fileUtilsService) {

        var caseId = $stateParams.caseId;
        var vm = this;
        vm.caseId = caseId;
        vm.pageSize = 10;
        vm.isAdmin = sessionService.isAdmin();
        
        vm.uploadDocument = uploadDocument;
        vm.previewDocument = previewDocument;
        vm.emailDocuments = emailDocuments;
        vm.createDocumentFromTemplate = createDocumentFromTemplate;
        vm.noDocuments = noDocuments;
        vm.deleteDocument = deleteDocument;

        activate();
        
        function activate(){
            // If dashboard, load my documents
            if($state.is('dashboard')) {
                loadMyDocuments();
            } else {
                loadDocumentsByCase();
            }
        }

        function loadMyDocuments() {
            vm.documents = documentService.getDocuments().then(function(response) {
                vm.documents = response.items;
                addThumbnailUrl();
            });
        }
        
        function loadDocumentsByCase(page){
            if(page == undefined){
                page = 1;
            }
            var res = caseDocumentsService.getDocumentsByCaseId(caseId, page, vm.pageSize);
            res.then(function(response) {
                vm.documents = response.documents;
                vm.contentRange = response.contentRange;
                addThumbnailUrl();
                var pages = [];
                var pagesCount = Math.ceil(response.contentRange.totalItems / vm.pageSize); 
                for(var i=0; i < pagesCount; i++){
                    pages.push(i+1);
                }
                vm.pages = pages;
            });
        }

        function addThumbnailUrl () {
            // Mimetype has different paths on caseDocs vs MyDocuments
            var mimeTypeProperty = $state.is('dashboard') ? 'mimetype' : 'fileMimeType';
            vm.documents.forEach(function(document){
                document.thumbNailURL = fileUtilsService.getFileIconByMimetype(document[mimeTypeProperty],24);
            });
        }
        
        function uploadDocument(){
            caseDocumentFileDialogService.uploadCaseDocument(caseId).then(function(result){
                loadDocumentsByCase(); 
            });
        }
        
        function previewDocument(nodeRef){
            documentPreviewService.previewDocument(nodeRef);
        }
        
        function deleteDocument(document){
            var confirm = $mdDialog.confirm()
                .title($translate.instant('COMMON.CONFIRM'))
                .content($translate.instant('DOCUMENT.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THE_DOCUMENT', {document_title: document["cm:title"]}))
                .ariaLabel('')
                .targetEvent(null)
                .ok($translate.instant('COMMON.YES'))
                .cancel($translate.instant('COMMON.CANCEL'));
            $mdDialog.show(confirm).then(function() {
                alfrescoFolderService.deleteFolder(document.nodeRef).then(function(result){
                   setTimeout(loadDocumentsByCase, 500); 
                });
            });
        }

        function emailDocuments() {
            caseDocumentsService.getDocumentsByCaseId(vm.caseId, 1, 100).then(function(response) {
                vm.docs = response.documents;
                $mdDialog.show({
                    templateUrl: '/app/src/documents/view/emailDialog.html',
                    controller: EmailDocumentsDialogController,
                    controllerAs: 'vm',
                    clickOutsideToClose: true,
                    locals: {
                        docs: vm.docs,
                        caseId: vm.caseId
                    }
                });
            });
        }

        function EmailDocumentsDialogController($mdDialog, docs, caseId, $timeout, $q) {
            var vm = this;

            vm.documents = docs;
            vm.caseId = caseId;
            vm.emailDocuments = emailDocuments;
            vm.cancel = cancel;
            vm.querySearch = querySearch;
            vm.to = [];
            vm.selectedItem = null;
            vm.searchText = null;
            
            activate()

            function activate() {
                casePartiesService.getCaseParties(caseId).then(function(response) {
                    vm.parties = response;
                    
                })
            }

            function querySearch(query) {
                var results = query ? vm.parties.filter(createFilterFor(query)) : [];
                return results;
            }

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(party) {
                    return (party.displayName.toLowerCase().indexOf(lowercaseQuery) != -1) || (party.displayName.toLowerCase().indexOf(lowercaseQuery) === 0);
                };
                
            }
            function emailDocuments() {
                // Send the email
                var toList = [];
                for (var person in vm.to) {
                  // Backend still expects objects with nodeRef property
                  toList.push({nodeRef: vm.to[person].nodeRef});
                }
                caseService.sendEmail(caseId, {
                    'to': toList,
                    'subject': vm.subject,
                    'message': vm.message,
                    'documents': vm.documents.filter(function(document) {
                        return document.selected;
                    })
                });
                $mdDialog.hide();
            }

            function cancel(form) {
                $mdDialog.cancel();
            }
        }

        function noDocuments() {
            return typeof vm.documents === 'undefined' || vm.documents.length === 0;
        }

        function createDocumentFromTemplate() {
            $mdDialog.show({
                templateUrl: '/app/src/documents/view/createDocumentFromTemplateDialog.html',
                controller: CreateDocumentFromTemplateDialogController,
                controllerAs: 'vm',
                clickOutsideToClose: true,
                locals: {
                    caseId: vm.caseId
                }
            });
        }

        function CreateDocumentFromTemplateDialogController($scope, $filter, $mdDialog, $translate, officeTemplateService, sessionService, contactsService, alfrescoNodeUtils, caseId) {
            var vm = this;

            $scope.vm = vm;

            vm.caseId = caseId;
            vm.template = null;
            vm.cancel = cancel;
            vm.fillAndSaveToCase = fillAndSaveToCase;
            vm.fieldData = {};

            activate();

            function activate() {
                $scope.$watch(function (scope) {
                    return vm.template;
                }, function (newValue, oldValue) {
                    if (typeof newValue !== 'undefined' && newValue != null) {
                        officeTemplateService.getTemplate(newValue.nodeRef).then(function (template) {
                            vm.currentTemplate = template;
                        });
                    }
                });

                $scope.$watch(function (scope) {
                    return vm.receiver;
                }, function (newValue, oldValue) {
                    if (typeof newValue !== 'undefined' && newValue != null && newValue.entries.length > 0) {
                        // Update the field values based on the selected
                        // contact info.
                        var nodeRefParts = alfrescoNodeUtils.processNodeRef(newValue.nodeRef);
                        contactsService.getContact(nodeRefParts.storeType, nodeRefParts.storeId, nodeRefParts.id).then(function (contact) {
                            console.log(contact);
                            for (var prop in contact) {
                                if (!contact.hasOwnProperty(prop)) continue;
                                vm.fieldData["receiver." + prop] = contact[prop];
                            }

                            // Annoyingly, the name returned by
                            // contactService is an auto-generated ID, so
                            // we have to overwrite it here. This should
                            // really be fixed in the backend.
                            if ("organizationName" in contact) {
                                vm.fieldData["receiver.name"] = contact.organizationName;
                            } else if ("firstName" in contact) {
                                vm.fieldData["receiver.name"] = contact.firstName + " " + contact.lastName;
                            }
                        });
                    }
                });

                casePartiesService.getCaseParties(caseId).then(function(response) {
                    vm.parties = response;
                    vm.receiver = [];
                });

                // Load the necessary data
                caseService.getCaseInfo(caseId).then(function (caseInfo) {
                    function getPropValue(prop) {
                        if (prop in caseInfo.properties && typeof caseInfo.properties[prop] !== null) {
                            var val = caseInfo.properties[prop];
                            if (typeof val != "object") {
                                return null;
                            } else if ("displayValue" in val) {
                                return val.displayValue;
                            } else if ("value" in val) {
                                return val.value;
                            } else {
                                return null;
                            }
                        }
                    }

                    angular.extend(vm.fieldData, {
                        "case.id": getPropValue("oe:id"),
                        "case.title": getPropValue("cm:title"),
                        "case.description": getPropValue("cm:description"),
                        "case.journalKey": getPropValue("oe:journalKey"),
                        "case.journalFacet": getPropValue("oe:journalFacet"),
                        "case.type": $filter('caseType')(caseInfo.type)
                    });
                });

                var user = sessionService.getUserInfo().user;
                for (var prop in user) {
                    if (!user.hasOwnProperty(prop)) continue;
                    vm.fieldData["user." + prop] = user[prop];
                }
                vm.fieldData["user.name"] = user.firstName + " " + user.lastName;
            }

            function fillAndSaveToCase(template, fieldData) {
                var documentProperties = {};
                officeTemplateService.fillTemplate(template.nodeRef, fieldData).then(function (blob) {
                    var uniqueStr = new Date().getTime();

                    // Convert the Blob to a File
                    // (http://stackoverflow.com/a/29390393)
                    blob.lastModifiedDate = new Date();
                    blob.name = template.name.split('.').slice(0, -1).join(".") + "-" + uniqueStr + ".pdf";

                    caseDocumentFileDialogService.uploadCaseDocument(caseId, blob).then(function (result) {
                        loadDocumentsByCase(1);
                    });
                });
            }

            function cancel(form) {
                $mdDialog.cancel();
            }
        }
    }
