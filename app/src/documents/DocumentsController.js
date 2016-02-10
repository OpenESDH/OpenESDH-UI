    angular
        .module('openeApp.documents')
        .controller('DocumentsController', DocumentsController);
    
    function DocumentsController($state, $mdDialog, fileUtilsService, caseDocumentFileDialogService, documentPreviewService){
        var vm = this;
        vm.uploadDocument = uploadDocument;
        vm.previewDocument = previewDocument;
        vm.noDocuments = noDocuments;
        vm.addThumbnailUrl = addThumbnailUrl;
        vm.createDocumentFromTemplate = createDocumentFromTemplate;
        vm.reloadDocuments = reloadDocuments;
        
        function reloadDocuments(){
            
        }
        
        function addThumbnailUrl() {
            var vm = this;
            // Mimetype has different paths on caseDocs vs MyDocuments
            var mimeTypeProperty = $state.is('dashboard') ? 'mimetype' : 'fileMimeType';
            vm.documents.forEach(function(document) {
                document.thumbNailURL = fileUtilsService.getFileIconByMimetype(document[mimeTypeProperty], 24);
            });
        }
        
        function uploadDocument() {
            var vm = this;
            caseDocumentFileDialogService.uploadCaseDocument(vm.docsFolderNodeRef).then(function(result) {
                vm.reloadDocuments();
            });
        }
        
        function previewDocument(nodeRef) {
            documentPreviewService.previewDocument(nodeRef);
        }

        function noDocuments() {
            var vm = this;
            return typeof vm.documents === 'undefined' || vm.documents.length === 0;
        }
        
        function createDocumentFromTemplate() {
            var vm = this;
            $mdDialog.show({
                templateUrl: 'app/src/documents/view/createDocumentFromTemplateDialog.html',
                controller: CreateDocumentFromTemplateDialogController,
                controllerAs: 'vm',
                clickOutsideToClose: true,
                locals: {
                    caseId: vm.caseId,
                    docsListCtrl: vm
                }
            });
        }

        function CreateDocumentFromTemplateDialogController($scope, $filter, $mdDialog, $translate, 
                casePartiesService, officeTemplateService, sessionService, caseService, contactsService, alfrescoNodeUtils, caseId, docsListCtrl) {
            var vm = this;

            $scope.vm = vm;

            vm.caseId = caseId;
            vm.template = null;
            vm.cancel = cancel;
            vm.fillAndSaveToCase = fillAndSaveToCase;
            vm.fieldData = {};

            activate();

            function activate() {
                $scope.$watch(function(scope) {
                    return vm.template;
                }, function(newValue, oldValue) {
                    if (typeof newValue !== 'undefined' && newValue != null) {
                        officeTemplateService.getTemplate(newValue.nodeRef).then(function(template) {
                            vm.currentTemplate = template;
                        });
                    }
                });

                $scope.$watch(function(scope) {
                    return vm.receiver;
                }, function(newValue, oldValue) {
                    if (typeof newValue !== 'undefined' && newValue != null && newValue.length != 0) {
                        // Update the field values based on the selected
                        // contact info.
                        var nodeRefParts = alfrescoNodeUtils.processNodeRef(newValue.nodeRef);
                        contactsService.getContact(nodeRefParts.storeType, nodeRefParts.storeId, nodeRefParts.id).then(function(contact) {
                            for (var prop in contact) {
                                if (!contact.hasOwnProperty(prop))
                                    continue;
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
                caseService.getCaseInfo(caseId).then(function(caseInfo) {
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
                    if (!user.hasOwnProperty(prop))
                        continue;
                    vm.fieldData["user." + prop] = user[prop];
                }
                vm.fieldData["user.name"] = user.firstName + " " + user.lastName;
            }

            function fillAndSaveToCase(template, fieldData) {
                var documentProperties = {};
                officeTemplateService.fillTemplate(template.nodeRef, fieldData).then(function(blob) {
                    var uniqueStr = new Date().getTime();

                    // Convert the Blob to a File
                    // (http://stackoverflow.com/a/29390393)
                    blob.lastModifiedDate = new Date();
                    blob.name = template.name.split('.').slice(0, -1).join(".") + "-" + uniqueStr + ".pdf";

                    caseDocumentFileDialogService.uploadCaseDocument(docsListCtrl.docsFolderNodeRef, blob).then(function(result) {
                        docsListCtrl.reloadDocuments();
                    });
                });
            }

            function cancel(form) {
                $mdDialog.cancel();
            }
        }
    }
    
    