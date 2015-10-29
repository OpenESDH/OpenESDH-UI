
angular
    .module('openeApp.users')
    .directive("openeEquals", equals);

    /**
     * Directive used to validate to equals input fields on the fly
     */ 

    function equals() {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, model) {
                if (!attrs.openeEquals) {
                    console.error('Opene-equals expects a model as an argument!');
                    return;
                }
                scope.$watch(attrs.openeEquals, function (value) {
                    // Only compare values if the second ctrl has a value.
                    if (model.$viewValue !== undefined && model.$viewValue !== '') {
                        model.$setValidity('openeEquals', value === model.$viewValue);
                    }
                });
                model.$parsers.push(function (value) {
                    // Mute the openeEquals error if the second ctrl is empty.
                    if (value === undefined || value === '') {
                        model.$setValidity('openeEquals', true);
                        return value;
                    }
                    var isValid = value === scope.$eval(attrs.openeEquals);
                    model.$setValidity('openeEquals', isValid);
                    return isValid ? value : undefined;
                });
            }
        };
    };