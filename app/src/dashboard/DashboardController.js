(function(){

  angular
    .module('dashboard')
    .controller('DashboardController', ['$scope', DashboardController]);
    
  function DashboardController( $scope ) {
    
    var originatorEv;
    this.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };
    
  };

})();
