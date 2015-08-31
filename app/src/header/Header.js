(function(){
    'use strict';

    angular
        .module('openeApp')
        .directive('appHeader', function() { 
          return {
            restrict: 'E',
            scope: {},
            templateUrl: 'app/src/header/view/header.html'
          };
        });

})();
