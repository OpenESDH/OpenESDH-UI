
angular
        .module('openeApp.documents')
        .factory('emailDocumentsService', EmailDocumentsService);

function EmailDocumentsService($mdDialog, $translate, caseDocumentsService, caseService,
        notificationUtilsService, personDialogService, $q) {
    var service = {
        showDialog: showDialog
    };
    return service;

    function showDialog(caseId, model) {
        var p;
        if (model) {
            p = $q.when({documents: model.documents});
        } else {
            p = caseDocumentsService.getDocumentsByCaseId(caseId, 1, 100).then(function(response) {
                model = {
                    documents: response.documents,
                    caseId: caseId,
                    to: [],
                    subject: "",
                    message: ""
                };
            });
        }

        p.then(function(response) {
            $mdDialog.show({
                templateUrl: 'app/src/documents/view/emailDialog.html',
                controller: EmailDocumentsDialogController,
                controllerAs: 'vm',
                clickOutsideToClose: true,
                locals: {
                    model: model
                }
            });
        });
    }

    function EmailDocumentsDialogController($mdDialog, contactsService, model) {
        var vm = this;
        vm.model = model;
        vm.emailDocuments = emailDocuments;
        vm.newContact = newContact;
        vm.cancel = cancel;
        vm.querySearch = querySearch;
        vm.selectedItem = null;
        vm.searchText = null;

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
                'documents': vm.model.documents.filter(function(document) {
                    return document.selected;
                })
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
