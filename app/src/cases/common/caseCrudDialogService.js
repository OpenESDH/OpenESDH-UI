    angular
        .module('openeApp.cases.common')
        .provider('caseCrudDialogService', caseCrudDialogServiceProvider);
    
    function caseCrudDialogServiceProvider(){
        
        var serviceConfig = [{
            type: 'simple:case',
            controller: 'SimpleCaseDialogController',
            caseInfoFormUrl: 'app/src/cases/common/view/caseInfo.html'
        }];
        
        var caseCrudExtras = []; 
        
        this.$get = caseCrudDialogService;
        
        this.caseCrudForm = caseCrudForm;
        this.getCaseCrudFormConfig = getCaseCrudFormConfig;
        this.caseCrudExtra = caseCrudExtra;
        
        function caseCrudForm(caseCrudFormConfig){
            serviceConfig.push(caseCrudFormConfig);
            return this;
        }
        
        function getCaseCrudFormConfig(caseType){
            var configs = serviceConfig.filter(function(item){
                return item.type === caseType;
            });
            if(configs.length > 0){
                return configs[0];
            }
            console.log("ERROR: No configuration found for the case type: ", caseType);
            return null;
        }
        
        function caseCrudExtra(extra){
            caseCrudExtras.push(extra);
        }
        
        caseCrudDialogService.$inject = ['$http', '$mdDialog', '$location'];

        function caseCrudDialogService($http, $mdDialog, $location) {
            return {
                getRegisteredCaseTypes: getRegisteredCaseTypes,
                getCaseInfoFormUrl: getCaseInfoFormUrl,
                getCaseControllerName: getCaseControllerName,
                createCase: createCase,
                editCase: editCase,
                getCrudExtras: getCrudExtras
            };
            
            function getRegisteredCaseTypes(){
                return serviceConfig.map(function(item){
                    return item.type;
                });
            }
            
            function getCrudExtras(caseType){
                return caseCrudExtras.filter(function(item){
                    return item.type === caseType;
                });
            }
            
            function getCaseInfoFormUrl(caseType){
                var config = getCaseCrudFormConfig(caseType);
                if(config == undefined){
                    config = serviceConfig[0]; //retrieve simple case config by default
                }
                return config.caseInfoFormUrl;
            }
            
            function getCaseControllerName(caseType){
                var config = getCaseCrudFormConfig(caseType);
                return config.controller;
            }
            
            function createCase(caseType) {
                var formConfig = getCaseCrudFormConfig(caseType);
                if(formConfig == null){
                    return;
                }
                
                var caseInfo = {
                    newCase: true,
                    type: formConfig.type
                };
                showDialog(formConfig, caseInfo).then(function(caseId) {
                    $location.path("/cases/case/" + caseId);
                });
            }
            
            function editCase(caseInfo){
                var formConfig = getCaseCrudFormConfig(caseInfo.type);
                if(!formConfig){
                    return;
                }
                return showDialog(formConfig, caseInfo);
            }
            
            function showDialog(formConfig, caseInfo){
                return $mdDialog.show({
                    controller: formConfig.controller,
                    controllerAs: 'vm',
                    templateUrl: 'app/src/cases/common/view/caseCrudDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: null,
                    clickOutsideToClose: true,
                    locals: {
                        caseInfo: caseInfo
                    }
                });
            }
            
        }
    }