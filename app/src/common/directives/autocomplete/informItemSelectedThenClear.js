
    angular
        .module('openeApp.common.directives')
        .directive('informItemSelectedThenClear', informItemSelectedThenClear);
    
    function informItemSelectedThenClear(){
        return {
            require: 'mdAutocomplete',
            restrict: 'A',
            link : function(scope, elm, attrs){
                var ctrl = elm.controller('mdAutocomplete');
                ctrl.registerSelectedItemWatcher(angular.bind(this, function (item) {
                    if (item) {
                        scope.$eval(attrs.informItemSelectedThenClear);
                        ctrl.clear();
                    }
                })); 
            }
        }
    }