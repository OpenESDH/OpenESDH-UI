angular
        .module('openeApp.addo')
        .controller('AddoController', AddoController);

function AddoController($scope, $stateParams, $mdDialog, $filter, $q, $translate, notificationUtilsService,
        addoService, caseDocumentsService, casePartiesService) {
    var vm = this;
    vm.execute = execute;

    function execute(ev) {
        var data = {
            templates: [],
            parties: [],
            documents: []
        };

        var pTempl = addoService.getSigningTemplates().then(function(templates) {
            data.templates = templates;
        });

        var pParties = casePartiesService.getCaseParties($stateParams.caseId).then(function(parties) {
            data.parties = $filter('filter')(parties, function(party) {
                return party.contactType === 'PERSON';
            }).map(function(party) {
                party._displayname = angular.lowercase(party.displayName);
                party._email = angular.lowercase(party.contactId);
                return party;
            });
        });

        var pDocs = caseDocumentsService.getCaseDocumentsWithAttachments($stateParams.caseId).then(function(documents) {
            data.documents = documents;
        });

        //proceed when all promises are resolved
        $q.all([pTempl, pDocs, pParties]).then(function() {
            showDialog(ev, data);
        }, function(){
            notificationUtilsService.alert($translate.instant('ADDO.DOCUMENT.CANT_INITIALIZE'));
        });
    }

    function showDialog(ev, data) {
        $mdDialog.show({
            controller: AddoDialogController,
            controllerAs: "addoDialog",
            templateUrl: 'app/src/plugin/addo/view/sendToAddoDialog.html',
            parent: angular.element(document.body),
            focusOnOpen: false,
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: data
        }).then(function(response) {
            console.log('ADDO!');
        });
    }

    function AddoDialogController($scope, $mdDialog, templates, parties, documents) {
        var addoCtrl = this;
        addoCtrl.model = {
            template: null,
            receivers: [],
            sequential: false,
            documents: []
        };
        addoCtrl.selectedDocs = [];
        addoCtrl.selectedToSign = [];
        addoCtrl.oneSigningDocSelected = false;

        //persons
        addoCtrl.selectedItem = null;
        addoCtrl.searchText = null;
        addoCtrl.querySearch = contactsQuerySearch;
        //data
        addoCtrl.templates = templates;
        addoCtrl.parties = parties;
        addoCtrl.documents = documents;

        addoCtrl.toggleDocument = toggleDocument;
        addoCtrl.send = send;
        addoCtrl.cancel = cancel;

        function send(form) {
            addoCtrl.model.sequential = addoCtrl.model.sequential && addoCtrl.model.receivers.length > 1;
            
            addoService.initiateSigning(addoCtrl.model).then(function() {
                notificationUtilsService.notify($translate.instant('ADDO.DOCUMENT.SENT_SUCCESSFULLY'));
                $mdDialog.hide();
            }, function(response) {
                notificationUtilsService.alert(response.data.message);
            });
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function toggleDocument(doc) {
            //remove old document
            var index = addoCtrl.selectedDocs.indexOf(doc.nodeRef);
            if (index > -1) {
                addoCtrl.selectedDocs.splice(index, 1);
                addoCtrl.selectedToSign.splice(index, 1);
                addoCtrl.model.documents.splice(index, 1);
            }
            //add document
            if (doc.selected && typeof doc.sign !== 'undefined') {
                addoCtrl.selectedDocs.push(doc.nodeRef);
                addoCtrl.selectedToSign.push(doc.sign);
                addoCtrl.model.documents.push({
                    nodeRef: doc.mainDocNodeRef ? doc.mainDocNodeRef : doc.nodeRef,
                    sign: doc.sign
                });
            }
            addoCtrl.oneSigningDocSelected = addoCtrl.selectedToSign.indexOf(true) > -1;
        }

        function contactsQuerySearch(query) {
            if (!query){
                return [];
            }
            return addoCtrl.parties.filter(createFilterFor(query));
        }

        /*
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            var usedIds = [];
            for (var i = 0; i < addoCtrl.model.receivers.length; i++) {
                usedIds.push(addoCtrl.model.receivers[i].nodeRef);
            }
            return function filterFn(party) {
                return usedIds.indexOf(party.nodeRef) === -1 && 
                        (party._displayname.indexOf(lowercaseQuery) >= 0 || party._email.indexOf(lowercaseQuery) >= 0);
            };
        }
    }
}