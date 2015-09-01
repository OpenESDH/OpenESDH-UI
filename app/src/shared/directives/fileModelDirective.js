(function() {
    'use strict';

    angular
        .module('openeApp')
        .directive('fileModel', FileModelDirective);
    
    FileModelDirective.$inject = ['$parse'];
    
    function FileModelDirective($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                
                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }

})();