
    angular
        .module('openeApp.workflows')
        .provider('startCaseWorkflowService', StartCaseWorkflowServiceProvider);

    function StartCaseWorkflowServiceProvider(){
        var serviceConfig = [];
        
        this.wfDialogConfig = wfDialogConfig;
        
        this.$get = StartCaseWorkflowService;
        
        function wfDialogConfig(dlgConfig){
            serviceConfig.push(dlgConfig);
            return this;
        }
        
        function StartCaseWorkflowService($mdDialog, $stateParams, workflowService) {
            
            var service = {
                startWorkflow: startWorkflow
            };
            return service;
            
            function startWorkflow(){
                workflowService.getWorkflowDefinitions().then(function(result){
                    var workflowDefs = result.data.filter(function(workflowDef){
                        return getDialogConfig(workflowDef.name) != null;
                    });
                    openSelectWorkflowTypeDialog(workflowDefs);
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
                       //console.log("workflow result", result); 
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