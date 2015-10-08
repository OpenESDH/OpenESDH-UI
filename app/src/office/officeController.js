
    angular
        .module('openeApp.office')
        .controller('OfficeController', OfficeController);

    var document;

    function OfficeController($stateParams, $window, officeService, caseService, sessionService, $q, caseDocumentsService) {
        var vm = this;
//        vm.email = JSON.parse($window.external.getParameter1());
//        $window.alert(JSON.stringify(vm.email));

        if (typeof $window.external.getParameter1 != 'undefined') {
            vm.document = JSON.parse($window.external.getParameter1());
        } else {
            vm.document = {};
//            vm.document.Subject = 'test';
            vm.document.Attachments = [];
        }

//        vm.from = email.From;
        vm.selectedCase;
        vm.subject = vm.document.Subject;
        vm.title = vm.document.Title;
        vm.attachments = vm.document.Attachments;

        vm.save = save;
        vm.cancel = cancel;
        vm.saveOfficeDocument = saveOfficeDocument;

        loadDocumentConstraints();

        if ($stateParams.alf_ticket) {
            sessionService.setUserInfo({ticket: $stateParams.alf_ticket});
//            $window.sessionStorage.userInfo = JSON.stringify({ticket: $stateParams.alf_ticket});
        }
        function save() {
            officeService.saveEmail({
                caseId: vm.selectedCase['oe:id'],
                name: vm.subject,
                email: vm.document
            }).then(function(response) {
                var metadata = {
                    caseId: vm.selectedCase['oe:id'],
                    documentName: vm.subject,
                    nodeRef: response.nodeRef
                };
                var atms = vm.attachments.filter(function(attachment) {
                    return attachment.selected;
                });
                $window.external.SaveAsOpenEsdh(JSON.stringify(metadata), JSON.stringify(atms));
            }, function(error) {
            });
        }

        function cancel() {
            $window.external.CancelOpenEsdh();
        }
        
        function saveOfficeDocument(form) {
            caseService.getCaseDocumentsFolderNodeRef(vm.selectedCase['oe:id']).then(function(response) {
                var metadata = {
                    caseId: vm.selectedCase['oe:id'],
                    documentName: vm.title,
                    nodeRef: response.caseDocsFolderNodeRef,
                    docType: vm.documentProperties.doc_type,
                    docCategory: vm.documentProperties.doc_category
                }
                $window.external.SaveAsOpenEsdh(JSON.stringify(metadata), null);
            }, function(error) {
                $window.alert(JSON.stringify(error));
            });
        }

        /*
         * Autocomplete input
         */
        
        vm.querySearch = querySearch;
        function querySearch (query) {
            return caseService.getCases('base:case').then(function(response) {
                return query ? response.filter(createFilterFor(query)) : [];
            });
        }
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item['oe:id'].indexOf(query) != -1 || item['cm:title'].indexOf(query) != -1);
            };
        }

        function loadDocumentConstraints(){
            caseDocumentsService.getCaseDocumentConstraints().then(function(documentConstraints){
                vm.documentConstraints = documentConstraints;
            });
        }

    }

    // This function is called from the Office Add-In
    window.loadDocument = function(payload) {
//        window.alert(payload);
//        document = JSON.parse(payload);
    }