
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
                templateUrl: '/app/src/documents/view/emailDialog.html',
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

    function EmailDocumentsDialogController($mdDialog, docs, caseId) {
        var vm = this;

        vm.documents = docs;
        vm.caseId = caseId;
        vm.emailDocuments = emailDocuments;
        vm.cancel = cancel;
        vm.querySearch = querySearch;
        vm.to = [];
        vm.selectedItem = null;
        vm.searchText = null;

        activate();

        function activate() {
            casePartiesService.getCaseParties(caseId).then(function(response) {
                vm.parties = response;

            });
        }

        function querySearch(query) {
            var results = query ? vm.parties.filter(createFilterFor(query)) : [];
            return results;
        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(party) {
                return (party.displayName.toLowerCase().indexOf(lowercaseQuery) > -1);
            };

        }
        function emailDocuments() {
            // Send the email
            var toList = [];
            for (var person in vm.to) {
                // Backend still expects objects with nodeRef property
                toList.push({nodeRef: vm.to[person].nodeRef});
            }
            if (vm.message == null) {
                vm.message = "";
            }
            caseService.sendEmail(caseId, {
                'to': toList,
                'subject': vm.subject,
                'message': vm.message,
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
