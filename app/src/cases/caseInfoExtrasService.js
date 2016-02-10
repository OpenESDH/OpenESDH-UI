    angular
        .module('openeApp.cases')
        .provider('caseInfoExtrasService', CaseInfoExtrasServiceProvider);

    function CaseInfoExtrasServiceProvider() {
        var extras = [];
        this.addExtra = addExtra;
        this.$get = caseInfoExtrasService;

        function addExtra(extra) {
            extras.push(extra);
            return this;
        }

        function caseInfoExtrasService($controller) {
            var service = {
                getExtrasControllers: getExtrasControllers
            };
            return service;

            function getExtrasControllers() {
                return extras.map(function(extra){
                    return $controller(extra.controller);
                });
            }
        }
    }