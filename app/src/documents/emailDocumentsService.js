
angular
        .module('openeApp.documents')
        .factory('emailDocumentsService', EmailDocumentsService);

function EmailDocumentsService($mdDialog, $translate, caseService, notificationUtilsService, personDialogService) {
    var service = {
        showDialog: showDialog
    };
    return service;

    function showDialog(caseId, docsCtrl) {
        $mdDialog.show({
            templateUrl: 'app/src/documents/view/emailDialog.html',
            controller: EmailDocumentsDialogController,
            controllerAs: 'vm',
            clickOutsideToClose: true,
            locals: {
                caseId: caseId,
                docsFolderRef: docsCtrl.rootDocsFolder
            }
        });
    }

    function EmailDocumentsDialogController($mdDialog, contactsService, caseId, docsFolderRef) {
        
        var vm = this;
        vm.model = {
            caseId: caseId,
            docsFolderRef: docsFolderRef,
            to: [],
            subject: "",
            message: ""
        };
        vm.emailDocuments = emailDocuments;
        vm.newContact = newContact;
        vm.cancel = cancel;
        vm.querySearch = querySearch;
        vm.selectedItem = null;
        vm.searchText = null;
        vm.selectedDocuments = [];

        function querySearch(query) {
            if (!query) {
                return [];
            }
            return contactsService.getPersons(query).then(function(response) {
                return response.items;
            });
        }

        function emailDocuments() {
            // Send the email
            var toList = vm.model.to.map(function(contact) {
                return {
                    nodeRef: contact.nodeRefId,
                    email: contact.email
                };
            });
            caseService.sendEmail(vm.model.caseId, {
                'to': toList,
                'subject': vm.model.subject,
                'message': vm.model.message || "",
                'documents': vm.selectedDocuments
            }).then(function() {
                $mdDialog.hide();
                var emails = toList.map(function(item){
                    return item.email;
                }).join();
                notificationUtilsService.notify($translate.instant('COMMON.EMAIL_SENT_TO', {to: emails}));
            });
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function newContact(ev) {
            personDialogService
                    .showPersonEdit(ev, null, null, false)
                    .then(function(response) {
                        vm.model.to.push(response);
                        showDialog(ev, vm.model);
                    }, function() {
                        showDialog(ev, vm.model);
                    });
        }
    }
}
