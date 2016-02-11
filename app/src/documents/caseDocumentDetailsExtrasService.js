    angular
        .module('openeApp.documents')
        .provider('caseDocumentDetailsExtrasService', caseDocumentDetailsExtrasServiceProvider);
    
    function caseDocumentDetailsExtrasServiceProvider(){
        var extras = [];
        this.addExtra = addExtra;
        this.$get = caseDocumentDetailsExtrasService;
        
        function addExtra(extra){
            extras.push(extra);
        }
        
        function caseDocumentDetailsExtrasService($controller) {
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