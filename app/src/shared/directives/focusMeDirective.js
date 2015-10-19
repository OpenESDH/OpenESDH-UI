
    angular
        .module('openeApp')
        .directive('focusMe', FocusMeDirective);

    function FocusMeDirective($timeout) {
        return {
            scope: { trigger: '@focusMe' },
            link: function(scope, element) {
                scope.$watch('trigger', function(value) {
                    if(value !== "false") {
                        $timeout(function() {
                            element[0].focus();
                        });
                    }
                });
            }
        };
    };