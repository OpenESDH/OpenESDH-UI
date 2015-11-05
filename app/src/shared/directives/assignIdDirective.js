
    angular
        .module('openeApp')
        .directive('assignId', assignIdDirective);

    /**
     * Directive to assign a dynamic id (from a scope variable) to an element.
     * e.g.: <div assign-id="myscopevar"></div>
     *
     * Where myscopevar is a variable in the scope.
     * On link time, the variable will be assigned to the element's id
     * attribute.
     * @returns {{restrict: string, link: Function}}
     */
    function assignIdDirective() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element[0].id = scope[attrs.assignId];
            }
        };
    }