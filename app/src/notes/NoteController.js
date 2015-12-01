
    angular
            .module('openeApp.notes')
            .controller('NoteController', NoteController);

    function NoteController($scope, $stateParams, $mdDialog, caseNotesService, casePartiesService) {
        var vm = this;
        var caseId = $stateParams.caseId;
        vm.newNote = newNote;
        vm.loadNotes = loadNotes;
        vm.pagingParams = caseNotesService.createPagingParams();
        vm.layout = 'grid';

        //lets init only when tab is selected
        $scope.$on('tabSelectEvent', function(event, args) {
            if (args.tab === 'notes') {
                loadNotes(1);
            }
        });

        function loadNotes(page) {
            var res = caseNotesService.getCaseNotes(caseId, page, vm.pagingParams.pageSize);
            res.then(function(response) {
                vm.notes = response.notes;
                vm.pagingParams.page = page;
                vm.pagingParams.totalRecords = response.contentRange.totalItems;
            });
        }

        function newNote(ev) {
            $mdDialog.show({
                controller: DialogController,
                controllerAs: 'vmNote',
                templateUrl: 'app/src/notes/view/noteCrudDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function(note) {
                addNote(note);
            }, function() {
                //on cancel dialog
            });
        }

        function addNote(note) {
            if (!note || (!note.headline && !note.content)) {
                return;
            }
            caseNotesService.addNewNote(caseId, note).then(function(response) {
                loadNotes(vm.pagingParams.page);
            });
        }

        function DialogController($scope, $mdDialog) {
            var vmNote = this;
            //values
            vmNote.concernedParties = [];
            vmNote.headline = null;
            vmNote.content = null;
            vmNote.querySearch = querySearch;
            //
            loadParties();
            //actions
            vmNote.cancel = cancel;
            vmNote.addNote = addNote;

            function cancel() {
                $mdDialog.cancel();
            }

            function addNote() {
                var partiesNodeRefs = vmNote.concernedParties.map(function(party){
                    return party.nodeRef;
                });
                
                var note = {
                    headline: vmNote.headline,
                    content: vmNote.content,
                    concernedParties: partiesNodeRefs
                };
                $mdDialog.hide(note);
            }

            function querySearch(query) {
                var results = query ? vmNote.caseParties.filter(createFilterFor(query)) : [];
                return results;
            }

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function(party) {
                    return (party._lowername.indexOf(lowercaseQuery) === 0);
                };
            }

            function loadParties() {
                return casePartiesService.getCaseParties(caseId).then(function(parties) {
                    vmNote.caseParties = parties.map(function(party) {
                        party._lowername = angular.lowercase(party.displayName);
                        return party;
                    });
                    return vmNote.caseParties;
                });
            }
        }
    }