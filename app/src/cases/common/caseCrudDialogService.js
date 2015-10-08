    angular
        .module('openeApp.cases.common')
        .provider('caseCrudDialogService', caseCrudDialogServiceProvider);
    
    function caseCrudDialogServiceProvider(){
        
        var serviceConfig = [{
            type: 'simple:case',
            controller: 'SimpleCaseDialogController',
            controllerAs: 'vm',
            templateUrl: 'app/src/cases/common/view/caseCrudDialog.html'
        }];
        
        this.$get = caseCrudDialogService;
        
        this.caseCrudForm = caseCrudForm;
        
        function caseCrudForm(caseCrudFormConfig){
            serviceConfig.push(caseCrudFormConfig);
            return this;
        }
        
        function getCaseCrudFormConfig(caseType){
            var configs = serviceConfig.filter(function(item){
                return item.type == caseType;
            });
            if(configs.length > 0){
                return configs[0];
            }
            console.log("ERROR: No configuration found for the case type: ", caseType);
            return null;
        }
        
        caseCrudDialogService.$inject = ['$http', '$mdDialog', '$location', 'caseService', 'notificationUtilsService'];

        function caseCrudDialogService($http, $mdDialog, $location, caseService, notificationUtilsService) {
            return {
                getRegisteredCaseTypes: getRegisteredCaseTypes, 
                createCase: createCase,
                editCase: editCase
            };
            
            function getRegisteredCaseTypes(){
                return serviceConfig.map(function(item){
                    return item.type;
                })
            }
            
            function createCase(caseType) {

                var formConfig = getCaseCrudFormConfig(caseType);
                if(formConfig == null){
                    return;
                }
                
                $mdDialog.show({
                    controller: formConfig.controller,
                    controllerAs: formConfig.controllerAs,
                    templateUrl: formConfig.templateUrl,
                    parent: angular.element(document.body),
                    targetEvent: null,
                    clickOutsideToClose: true,
                    focusOnOpen: false,
                    locals: {
                        caseObj: {
                            newCase: true
                        }
                    }
                }).then(function(c){
                    var caseData = angular.copy(c);
                    prepareCaseData(caseData);
                    // When submitting, do something with the case data
                    caseService.createCase(caseData).then(function (caseId) {
                        $location.path("/cases/case/" + caseId);
                        // When the form is submitted, show a notification:
                        notificationUtilsService.notify('Case ' + caseData.title + ' created');
                    }, function (response) {
                        notificationUtilsService.alert('Error creating case: ' + response.data.message);
                    });
                });
            }
            
            function editCase(caseObj){
                
                var formConfig = getCaseCrudFormConfig(caseObj.type);
                if(formConfig == null){
                    return;
                }
                
                return $mdDialog.show({
                    controller: formConfig.controller,
                    controllerAs: formConfig.controllerAs,
                    templateUrl: formConfig.templateUrl,
                    parent: angular.element(document.body),
                    targetEvent: null,
                    clickOutsideToClose: true,
                    focusOnOpen: false,
                    locals: {
                        caseObj: angular.copy(caseObj)
                    }
                }).then(function(updatedCaseObj) {
                        prepareCaseData(updatedCaseObj);
                        return caseService.updateCase(updatedCaseObj, caseObj).then(function(result){
                            return result;
                        });
                }, 
                function() {
                });
            }
            
            function prepareCaseData(caseData){
                if (caseData.journalKey != undefined && caseData.journalKey.length > 0) {
                    caseData.journalKey = caseData.journalKey[0].nodeRef;
                } else {
                    delete caseData.journalKey;
                }
                
                if (caseData.journalFacet != undefined && caseData.journalFacet.length > 0) {
                    caseData.journalFacet = caseData.journalFacet[0].nodeRef;
                } else {
                    delete caseData.journalFacet;
                }
            }
        }
    }