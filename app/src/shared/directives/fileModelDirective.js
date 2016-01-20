
angular
        .module('openeApp')
        .directive('fileModel', FileModelDirective);

function FileModelDirective($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope,
                            (element[0].multiple
                                    ? element[0].files
                                    : element[0].files[0]));
                });
            });
        }
    };
}
