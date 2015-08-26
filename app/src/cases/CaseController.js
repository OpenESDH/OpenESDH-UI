(function(){

  angular
       .module('cases')
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
        isUpdated: true
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
        isUpdated: false
      }
    ];
    
    $scope.createCase = function(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'src/cases/view/caseCrudDialog.html',
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
      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
    };
    
  };
  

})();
