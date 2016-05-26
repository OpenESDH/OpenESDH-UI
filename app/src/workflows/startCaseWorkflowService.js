
    angular
        .module('openeApp.workflows')
        .provider('startCaseWorkflowService', StartCaseWorkflowServiceProvider);

    function StartCaseWorkflowServiceProvider(){
        var serviceConfig = [];
        var wfSuppliers = [];
        
        this.wfDialogConfig = wfDialogConfig;
        this.wfSupplier = wfSupplier;
        
        this.$get = StartCaseWorkflowService;
        
        function wfDialogConfig(dlgConfig){
            serviceConfig.push(dlgConfig);
            return this;
        }
        
        function wfSupplier(supplier){
            wfSuppliers.push(supplier);
        }
        
        function StartCaseWorkflowService($mdDialog, $stateParams, $injector, $q, workflowService) {
            
            var service = {
                startWorkflow: startWorkflow,
                getWorkflowDefinitions: getWorkflowDefinitions
            };
            return service;
            
            function startWorkflow(caseInfo){
                getAllowedWorkflows(caseInfo).then(function(allowedWorkflows){
                    getWorkflowDefinitions().then(function(workflowDefs){
                        if(allowedWorkflows != undefined){
                            workflowDefs = workflowDefs.filter(function(item){
                                return allowedWorkflows.indexOf(item.id) != -1;
                            });
                        }
                        openSelectWorkflowTypeDialog(workflowDefs);
                    });
                });
            }
            
            function getAllowedWorkflows(caseInfo){
                var supplier = getWfSupplier(caseInfo);
                if(supplier != undefined){
                    return supplier.getAllowedWorkflows(caseInfo);
                }
                return $q.when();
            }
            
            function getWfSupplier(caseInfo){
                for(var i=0; i<wfSuppliers.length; i++){
                    var supplier = wfSuppliers[i];
                    if(supplier.canSupply(caseInfo)){
                        return $injector.get(supplier.supplierName);
                    }
                }
            }
            
            function getWorkflowDefinitions(){
                return workflowService.getWorkflowDefinitions().then(function(result){
                    var workflowDefs = result.data.filter(function(workflowDef){
                        return getDialogConfig(workflowDef.name) != null;
                    });
                    return workflowDefs;
                });
            }
            
            function openSelectWorkflowTypeDialog(workflowDefs){
                $mdDialog.show({
                    controller: SelectWorkflowTypeDialogController,
                    controllerAs: 'dlg',
                    templateUrl: 'app/src/workflows/view/selectWorkflowTypeDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: null,
                    clickOutsideToClose: true,
                    locals: {
                        workflowDefs: workflowDefs
                    }
                }).then(function(workflowDef){
                    showStartWorkflowDialog(workflowDef);
                });
            }
            
            function SelectWorkflowTypeDialogController($scope, $mdDialog, workflowDefs){
                var vm = this;
                vm.workflowDefs = workflowDefs;
                
                vm.workflowSelected = function(workflowDef){
                    vm.selectedWorkflow = workflowDef.selected === true ? workflowDef : null;
                    for(var i in vm.workflowDefs){
                        var wfDef = vm.workflowDefs[i];
                        if(wfDef == workflowDef){
                            continue;
                        }
                        wfDef.selected = false;
                    }
                }
                
                vm.submit = function(){                
                    $mdDialog.hide(vm.selectedWorkflow);
                }
                
                vm.cancel = function(){
                    $mdDialog.cancel();
                }
            }
            
            function showStartWorkflowDialog(workflowDef){
                
                var config = getDialogConfig(workflowDef.name);
                if(config == null){
                    console.log("Cannot find workflow dialog config for workflow name: ", workflowDef.name);
                    return;
                }
                
                $mdDialog.show({
                    controller: config.controller,
                    controllerAs: config.controllerAs,
                    templateUrl: config.templateUrl,
                    parent: angular.element(document.body),
                    targetEvent: null,
                    clickOutsideToClose: true,
                    locals: {
                        workflowDef: workflowDef
                    }
                }).then(function(workflow){
                    workflow.workflowType = workflowDef.id;
                    workflowService.startWorkflow(workflow).then(function(result){
                       //print workflow path id 
                       // console.log("workflow result", result); 
                    });
                });
            }
            
            function getDialogConfig(workflowName){
                for(var i in serviceConfig){
                    var config = serviceConfig[i];
                    if(config.workflowName == workflowName){
                        return config;
                    }
                }
                return null;
            }
        } // end of service
    } // end of provider