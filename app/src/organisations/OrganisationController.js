(function(){

  angular
       .module('openeApp.organisations')
       .controller('OrganisationController', OrganisationController);

  OrganisationController.$inject = ['$scope', '$mdDialog'];

  function OrganisationController($scope, $mdDialog) {
    
    $scope.showAdvanced = function(ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'app/src/organisations/view/organisationCrudDialog.html',
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

})();
