(function(){
    'use strict';

    angular
        .module('openeApp')
        .directive('caseInfolet', function() { 
          return {
            restrict: 'E',
            scope: {},
            templateUrl: 'app/src/shared/directives/caseInfolet.html'
          };
        });

})();
