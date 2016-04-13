
    angular
            .module('openeApp.notes')
            .controller('NoteController', NoteController);

    function NoteController($scope, $stateParams, $mdDialog, $translate, caseNotesService, casePartiesService) {
        var vm = this;
        var caseId = $stateParams.caseId;
        vm.editMode;
        vm.newNote = newNote;
        vm.editNote = editNote;
        vm.loadNotes = loadNotes;
        vm.pagingParams = caseNotesService.createPagingParams();
        vm.layout = 'grid';

        loadNotes(1);

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
                clickOutsideToClose: true,
                locals: {
                    note: null
                }
            }).then(function(note) {
                addNote(note);
            }, function() {
                //on cancel dialog
            });
        }

        function addNote(note) {
            if (!note || (!note.title && !note.content)) {
                return;
            }
            caseNotesService.addNewNote(caseId, note).then(function(response) {
                loadNotes(vm.pagingParams.page);
            });
        }

        function editNote(ev, note) {
            $mdDialog.show({
                controller: DialogController,
                controllerAs: 'vmNote',
                templateUrl: 'app/src/notes/view/noteCrudDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    note: note
                }
            }).then(function(note) {
                addNote(note);
            }, function() {
                //on cancel dialog
            });
        }

        function DialogController($scope, $mdDialog, note) {
            var vmNote = this;
            //values
            if (note) {
                angular.extend(vmNote, angular.copy(note), {editMode: true});
                var partyNames = vmNote.concernedPartiesInfo.map(function(party){
                    party.displayName = party.name;
                    return party;
                });
                vmNote.concernedParties = angular.copy(partyNames);
            } else {
                vmNote.editMode = false;
                vmNote.concernedParties = [];
                vmNote.title = null;
                vmNote.content = null;
            }

            vmNote.querySearch = querySearch;
            loadParties();
            //actions
            vmNote.cancel = cancel;
            vmNote.addNote = addNote;
            vmNote.updateNote = updateNote;
            vmNote.deleteNote = deleteNote;

            function cancel() {
                $mdDialog.cancel();
            }

            function updateNote() {
                var partiesNodeRefs = vmNote.concernedParties.map(function(party){
                    return party.nodeRef;
                });

                var data = {
                    nodeRef: vmNote.nodeRef,
                    author: vmNote.author,
                    title: vmNote.title,
                    content: vmNote.content,
                    concernedParties: partiesNodeRefs
                };

                caseNotesService.updateNote(data).then(function(response) {
                    loadNotes(vm.pagingParams.page);
                })
                $mdDialog.hide();
            }

            function addNote() {
                var partiesNodeRefs = vmNote.concernedParties.map(function(party){
                    return party.nodeRef;
                });
                
                var note = {
                    title: vmNote.title,
                    content: vmNote.content,
                    concernedParties: partiesNodeRefs
                };
                $mdDialog.hide(note);
            }

            function deleteNote(ev) {
                var confirm = $mdDialog.confirm()
                    .title($translate.instant('NOTE.DELETE_NOTE'))
                    .textContent($translate.instant('NOTE.CONFIRM_DELETE'))
                    .targetEvent(ev)
                    .ok($translate.instant('COMMON.DELETE'))
                    .cancel($translate.instant('COMMON.CANCEL'));

                $mdDialog.show(confirm).then(function() {
                    caseNotesService.deleteNote(vmNote.nodeRef).then(function(response) {
                        loadNotes(vm.pagingParams.page);
                    });
                    $mdDialog.hide();
                }, function() {
                    vm.editNote(ev, vmNote);
                });


            }


            function querySearch(query) {
                var results = query ? vmNote.caseParties.filter(createFilterFor(query)) : [];
                return results;
            }

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function(party) {
                    return (party._lowername ? party._lowername.indexOf(lowercaseQuery) === 0 : false);
                };
            }

            function loadParties() {
                return casePartiesService.getCaseParties(caseId).then(function(parties) {
                    vmNote.caseParties = parties.map(function(party) {
                        party.contact._lowername = angular.lowercase(party.contact.displayName);
                        return party.contact;
                    });
                    return vmNote.caseParties;
                });
            }
        }
    }