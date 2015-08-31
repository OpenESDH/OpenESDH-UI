(function(){

    angular
       .module('openeApp.notes')
       .controller('NoteController', NoteController);

    NoteController.$inject = ['$scope', '$routeParams', '$mdDialog', 'caseNotesService'];

    function NoteController($scope, $routeParams, $mdDialog, caseNotesService) {

        var caseId = $routeParams.caseId;
        
        var vm = this;
        vm.newNote = newNote;
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
                targetEvent: ev,
                clickOutsideToClose:true
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
            
            var partiesNodeRefs = [];
            note.concernedParties = partiesNodeRefs;
            caseNotesService.addNewNote(caseId, note).then(function(response){
                loadNotes(1);
            });
        }
        
        function DialogController($scope, $mdDialog) {
            $scope.hide = function() {
              $mdDialog.hide();
            };
            $scope.cancel = function() {
              $mdDialog.cancel();
            };
            $scope.addNote = function(){                
                $mdDialog.hide({headline: $scope.headline, content: $scope.content});
            };
        };
    }

})();
