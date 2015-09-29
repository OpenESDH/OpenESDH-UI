(function(){
    
    angular
        .module('openeApp.documents')
        .controller('DocumentController', DocumentController);
    
    DocumentController.$inject = [
        '$scope',
        '$stateParams',
        '$mdDialog',
        '$translate',
        'caseDocumentsService',
        'documentPreviewService',
        'caseDocumentFileDialogService',
        'casePartiesService',
        'caseService',
        'alfrescoFolderService'
    ];
    
    function DocumentController($scope, $stateParams, $mdDialog, $translate, caseDocumentsService, documentPreviewService, 
                caseDocumentFileDialogService, casePartiesService, caseService, alfrescoFolderService) {

        var caseId = $stateParams.caseId;
        var vm = this;
        vm.caseId = caseId;
        vm.pageSize = 10;
        
        vm.loadDocuments = loadDocuments;
        vm.uploadDocument = uploadDocument;
        vm.previewDocument = previewDocument;
        vm.emailDocuments = emailDocuments;
        vm.createDocumentFromTemplate = createDocumentFromTemplate;
        vm.noDocuments = noDocuments;
        vm.deleteDocument = deleteDocument;

        activate();
        
        function activate(){
            loadDocuments();
        }
        
        function loadDocuments(page){
            if(page == undefined){
                page = 1;
            }
            var res = caseDocumentsService.getDocumentsByCaseId(caseId, page, vm.pageSize);
            res.then(function(response) {
                vm.documents = response.documents;
                vm.contentRange = response.contentRange;
                var pages = [];
                var pagesCount = Math.ceil(response.contentRange.totalItems / vm.pageSize); 
                for(var i=0; i < pagesCount; i++){
                    pages.push(i+1);
                }
                vm.pages = pages;
            });
        }
        
        function uploadDocument(){
            caseDocumentFileDialogService.uploadCaseDocument(caseId).then(function(result){
                loadDocuments(); 
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
                   setTimeout(loadDocuments, 500); 
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

        EmailDocumentsDialogController.$inject = ['$mdDialog', 'docs', 'caseId', '$timeout', '$q'];

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
                var toList = '';
                for (var person in vm.to) {
                  toList += vm.to[person].contactId + '; ';
                };
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

        CreateDocumentFromTemplateDialogController.$inject = ['$scope', '$mdDialog', '$translate', 'officeTemplateService', 'sessionService', 'contactsService', 'alfrescoNodeUtils', 'caseId'];

        function CreateDocumentFromTemplateDialogController($scope, $mdDialog, $translate, officeTemplateService, sessionService, contactsService, alfrescoNodeUtils, caseId) {
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
                    if (typeof newValue !== 'undefined' && newValue != null) {
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
                            if (contact["contactType"] == "ORGANIZATION") {
                                vm.fieldData["receiver.name"] = contact.organizationName;
                            } else if (contact["contactType"] == "PERSON") {
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
                            if ("displayValue" in val) {
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
                        // TODO: use real case type
                        "case.type": $translate.instant("CASE.CASETYPE_STANDARD")
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
                        loadDocuments(1);
                    });
                });
            }

            function cancel(form) {
                $mdDialog.cancel();
            }
        }
    }

})();
