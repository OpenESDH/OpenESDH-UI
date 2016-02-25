
angular
        .module('openeApp.documents')
        .factory('emailDocumentsService', EmailDocumentsService);

function EmailDocumentsService($mdDialog, caseDocumentsService, casePartiesService, caseService, notificationUtilsService) {
    var service = {
        showDialog: showDialog
    };
    return service;

    function showDialog(caseId) {
        caseDocumentsService.getDocumentsByCaseId(caseId, 1, 100).then(function(response) {
            var docs = response.documents;
            $mdDialog.show({
                templateUrl: 'app/src/documents/view/emailDialog.html',
                controller: EmailDocumentsDialogController,
                controllerAs: 'vm',
                clickOutsideToClose: true,
                locals: {
                    docs: docs,
                    caseId: caseId
                }
            });
        });
    }

    function EmailDocumentsDialogController($mdDialog, contactsService, docs, caseId) {
        var vm = this;

        vm.documents = docs;
        vm.caseId = caseId;
        vm.emailDocuments = emailDocuments;
        vm.cancel = cancel;
        vm.querySearch = querySearch;
        vm.to = [];
        vm.selectedItem = null;
        vm.searchText = null;

        function querySearch(query) {
            if (!query){
                return [];
            }
            return contactsService.getPersons(query).then(function(response){
                return response.items;
            });
        }

        
        function emailDocuments() {
            // Send the email
            var toList = vm.to.map(function(contact){
                return {
                    nodeRef: contact.nodeRefId,
                    email: contact.email
                };
            });
            caseService.sendEmail(caseId, {
                'to': toList,
                'subject': vm.subject,
                'message': vm.message || "",
                'documents': vm.documents.filter(function(document) {
                    return document.selected;
                })
            }).then(function() {
                $mdDialog.hide();
            }, function(response){
                notificationUtilsService.alert(response.data.message);
            });
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }
}
