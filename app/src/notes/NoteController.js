(function(){

    angular
       .module('openeApp.notes')
       .controller('NoteController', NoteController);

    NoteController.$inject = ['$scope', '$routeParams', 'caseNotesService'];

    function NoteController($scope, $routeParams, caseNotesService) {

        var caseId = $routeParams.caseId;
        
        var vm = this;
        vm.addNote = addNote;
        vm.loadNotes = loadNotes;
        vm.pageSize = 2;
        
        activate();
        
        function activate(){
            loadNotes(1);
        }
        
        function loadNotes(page){
            var res = caseNotesService.getCaseNotes(caseId, page, vm.pageSize);
            res.then(function(response) {     
                vm.notes = response.notes;
                console.log("notes", response);
                vm.contentRange = response.contentRange;
                var pages = [];
                var pagesCount = Math.ceil(response.contentRange.totalItems / vm.pageSize); 
                for(var i=0; i < pagesCount; i++){
                    pages.push(i+1);
                }
                vm.pages = pages;
            });
        }
        
        function addNote(){
            var partiesNodeRefs = [];
            var newNote = vm.newNote;
            for(var i in newNote.concernedParties){
                var party = newNote.concernedParties[i];
                partiesNodeRefs.push(party.nodeRef);
            }
            var note = {
                    parent: newNote.parent,
                    headline: newNote.headline,
                    content: newNote.content,
                    concernedParties: partiesNodeRefs
            };
            caseNotesService.addNewNote(caseId, note).then(function(response){
               newNote.headline = "";
               newNote.content = "";
               newNote.concernedParties = [];
            });
        }
    }

})();
