(function(){
    'use strict';

    angular
        .module('openeApp.cases')
        .directive('caseInfolet', function() { 
            return {
                restrict: 'E',
                templateUrl: 'app/src/cases/view/caseInfolet.html'
            };
        });

})();
