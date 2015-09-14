(function(){

    angular
       .module('openeApp.notes')
       .controller('NoteController', NoteController);

    NoteController.$inject = ['$scope', '$stateParams', '$mdDialog', 'caseNotesService', 'casePartiesService'];

    function NoteController($scope, $stateParams, $mdDialog, caseNotesService, casePartiesService) {

        var caseId = $stateParams.caseId;
        var caseParties = [];
        
        var vm = this;
        vm.newNote = newNote;
        vm.loadNotes = loadNotes;
        vm.pageSize = 2;
        
        activate();
        
        function activate(){
            
            loadNotes(1);
            
            casePartiesService.getCaseParties(caseId).then(function(parties){
                caseParties = parties;
            });
            
        }
        
        function loadNotes(page){
            var res = caseNotesService.getCaseNotes(caseId, page, vm.pageSize);
            res.then(function(response) {     
                vm.notes = response.notes;
                vm.contentRange = response.contentRange;
                var pages = [];
                var pagesCount = Math.ceil(response.contentRange.totalItems / vm.pageSize); 
                for(var i=0; i < pagesCount; i++){
                    pages.push(i+1);
                }
                vm.pages = pages;
            });
        }
        
        function newNote(ev){
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'app/src/notes/noteCrudDialog.html',
                parent: angular.element(document.body),
                focusOnOpen: false,
                targetEvent: ev,
                clickOutsideToClose: true
              })
              .then(function(note) {
                  addNote(note);
              }, function() {
                //on cancel dialog
              });
        }
        
        function addNote(note){
            if(!note || (!note.headline && !note.content)){
                return;
            }
            caseNotesService.addNewNote(caseId, note).then(function(response){
                loadNotes(1);
            });
        }
        
        function DialogController($scope, $mdDialog) {
            
            $scope.caseParties = caseParties;
            
            $scope.cancel = function() {
              $mdDialog.cancel();
            };
            
            $scope.addNote = function(){
                var partiesNodeRefs = [];
                for(var i in $scope.concernedParties){
                    var party = $scope.concernedParties[i];
                    partiesNodeRefs.push(party.nodeRef);
                }
                var note = {
                        headline: $scope.headline, 
                        content: $scope.content, 
                        concernedParties: partiesNodeRefs
                };
                $mdDialog.hide(note);
            };
        };
    }

})();
