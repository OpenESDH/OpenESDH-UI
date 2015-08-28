(function(){

  angular
       .module('openeApp')
       .controller('NoteController', ['$scope', NoteController]);

  function NoteController($scope) {
  
    $scope.notes = [
      {
        title: 'Note title',
        desc: 'This is a note. eglsiehf lsæeifhj slefij slæefihs elfijs eflihs eflsihef lsjef lsief lsefj sliefh slefj slefh sleifj lseifh sleifh slefihs lefihs elf',
        createdDate: 'June 12, 2015',
        creator: 'Someone Someonesson',
        relatedTo: [
          'William Shakespeare',
          'Mogens Glistrup',
          'Ole Lund Kirkeby'
        ]
      },
      {
        title: 'Another note',
        desc: 'This is a note. eglsiehf lsæeifhj slefij slæefihs elfijs eflihs eflsihef lsjef lsief lsefj sliefh slefj slefh sleifj lseifh sleifh slefihs lefihs elf',
        createdDate: 'June 12, 2015',
        creator: 'Someone Someonesson',
        relatedTo: [
          'William Shakespeare',
          'Mogens Glistrup',
          'Ole Lund Kirkeby'
        ]
      }
    ];
  
  }

})();
