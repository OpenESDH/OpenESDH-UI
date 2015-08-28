(function(){

  angular
       .module('openeApp')
       .controller('CaseController', [ '$scope', '$mdDialog', CaseController ]);

       
  /**
   * Main Controller for the Cases module
   * @param $scope
   * @param cases
   * @constructor
   */
  function CaseController($scope, $mdDialog) {
    
    $scope.cases = [
      {
        caseId: 5672855,
        title: 'Case title goes here',
        desc: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.',
        type: 'Casetype',
        createdDate: 'May 2 2015',
        startDate: 'May 2 2015',
        modifiedDate: 'May 12 2015',
        endDate: 'June 21 2015',
        status: 'In progress',
        owner: 'Someone Someonesson',
        creator: 'Svend Tveskæg',
        assignee: 'Someone Elsesson',
        journalKey: 'KGHEISHG',
        isUpdated: true,
        documents: ['document1.xls', 'document2.pdf', 'document3.xls']
      },
      {
        caseId: 12442,
        title: 'Another case title goes here',
        desc: 'Horses horses horses',
        type: 'Casetype',
        createdDate: 'May 2 2015',
        startDate: 'May 2 2015',
        modifiedDate: 'May 12 2015',
        endDate: 'June 21 2015',
        status: 'Archived',
        owner: 'Someone Elsesson',
        creator: 'Someone Someonesson',
        assignee: 'Someone Elsesson',
        journalKey: 'KGHEISHG',
        isUpdated: false,
        documents: ['document1.xls', 'document2.pdf', 'document3.xls']
      },
      {
        caseId: 275,
        title: 'It is a case with case stuff in it',
        desc: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.',
        type: 'Casetype',
        createdDate: 'May 2 2015',
        startDate: 'May 2 2015',
        modifiedDate: 'May 12 2015',
        endDate: 'June 21 2015',
        status: 'In progress',
        owner: 'Someone Someonesson',
        creator: 'Svend Tveskæg',
        assignee: '',
        journalKey: 'KGHEISHG',
        isUpdated: false,
        documents: ['document1.xls', 'document2.pdf', 'document3.xls']
      },
      {
        caseId: 123275,
        title: 'Yet another case',
        desc: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.',
        type: 'Casetype',
        createdDate: 'May 2 2015',
        startDate: 'May 2 2015',
        modifiedDate: 'May 12 2015',
        endDate: 'June 21 2015',
        status: 'In progress',
        owner: 'Someone Someonesson',
        creator: 'Svend Tveskæg',
        assignee: '',
        journalKey: 'KGHEISHG',
        isUpdated: false,
        documents: ['document1.xls', 'document2.pdf', 'document3.xls']
      }
    ];
    
    $scope.myUpdatedCases = countMyUpdatedCases();
    
    function countMyUpdatedCases() {
      var i = 0;
      for (var c in $scope.cases) {
        if ($scope.cases[c].isUpdated) {
          i++;
        };
      }
      return i;
    };
    
    $scope.unassignedCasesNum = countUnassignedCases();
    
    function countUnassignedCases() {
      var i = 0;
      for (var c in $scope.cases) {
        if ($scope.cases[c].assignee === '') {
          i++;
        };
      }
      return i;
    };
    
    $scope.casesNeedAction = countCasesNeedAction();
    
    function countCasesNeedAction() {
      return countUnassignedCases() + countMyUpdatedCases();
    };
    
    $scope.createCase = function(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'app/src/cases/view/caseCrudDialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      })
      .then(function(answer) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
    };
    
    function DialogController($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
    };
    
  };
  

})();
