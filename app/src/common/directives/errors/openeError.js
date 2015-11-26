
    angular.module('openeApp.common.directives')
        .directive('openeError', OpeneErrorDirective);

    /**
     * Wrapper directive for ng-messages
     * 
     *
     */
    function OpeneErrorDirective() {
        return {
            link: function (scope, elem, attrs) {
                // body...
            },
            restrict: 'E',
            scope: {
                field: '='
            },
            template: '<div ng-messages="field.$error" ng-show="field.$touched" ng-if="field.$dirty && field.$invalid" role="alert">' +
                           '<div ng-messages-include="app/src/common/directives/errors/error-messages.html"></div>' +
                      '</div>'
        }
    }