    angular
        .module('openeApp.systemsettings')
        .controller('TenantsModulesController', TenantsModulesController);
    
    function TenantsModulesController(tenantsService, $mdDialog, $translate){
        var vm = this;
        vm.deleteModules = deleteModules;
        vm.editTenant = editTenant;
        vm.newTenant = newTenant;
        
        loadList();
        
        function loadList(){
            tenantsService.getAllTenantsModules().then(function(data){
                vm.tenantsModules = data;
            });
            
            tenantsService.getOpeneModules().then(function(data){
               vm.openeModules = data; 
            });
        }
        
        function deleteModules(ev, tenant){
            ev.stopPropagation();
            
            var confirm = $mdDialog.confirm()
                    .title($translate.instant('COMMON.CONFIRM'))
                    .textContent($translate.instant('ADMIN.SYS_SETTINGS.TENANTS_MODULES.ARE_YOU_SURE_YOU_WANT_TO_DELETE_TENANT_MODULES', {tenant: tenant}))
                    .targetEvent(ev)
                    .ok($translate.instant('COMMON.YES'))
                    .cancel($translate.instant('COMMON.CANCEL'));
            $mdDialog.show(confirm).then(function() {
                tenantsService.deleteTenantModules(tenant).then(function(){
                    loadList();
                });
            });
        }
        
        function editTenant(ev, tenant, modules){
            showDialog(ev, tenant, modules);    
        }
        
        function newTenant(ev){
            tenantsService.getAllTenants().then(function(tenants){
                vm.tenants = tenants.filter(function(tenant){
                    return vm.tenantsModules[tenant] == undefined;
                });
                showDialog(ev);
            });
        }
        
        function showDialog(ev, tenant, modules){
            $mdDialog.show({
                controller: TenantModulesDialogController,
                controllerAs: 'tm',
                templateUrl: 'app/src/system_settings/tenant/view/tenantModulesCrudDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    tenant: tenant,
                    modules: modules
                }
            });
        }
        
        function TenantModulesDialogController($scope, $mdDialog, tenant, modules) {
            var tm = this;
            tm.tenant = tenant;
            tm.cancel = cancel;
            tm.save = save;
            tm.openeModules = vm.openeModules.map(function(module){
                var selected = false;
                if(tenant != undefined){
                    selected = modules.indexOf(module) != -1;
                }
                return {id:module, selected:selected};
            });
            tm.tenants = vm.tenants;
            tm.isNew = (tenant == undefined);
            tm.moduleSelected = moduleSelected;
            tm.canSave = canSave;
            tm.tenantModules = (tenant == undefined) ? [] : modules.slice();
            
            function moduleSelected(module){
                if(module.selected === true){
                    tm.tenantModules.push(module.id);
                }else{
                    tm.tenantModules = tm.tenantModules.filter(function(item){
                        return item !== module.id;
                    })
                }
            }
            
            function cancel() {
                $mdDialog.cancel();
            }

            function save(form) {
                if (!form.$valid) {
                    return;
                }
                tenantsService
                    .saveTenantModules(tm.tenant, tm.tenantModules)
                    .then(refreshInfoAfterSuccess, saveError);
            }

            function refreshInfoAfterSuccess(savedDocumentCategory) {
                $mdDialog.hide();
                loadList();
            }

            function saveError(response) {
                console.log(response);
            }
            
            function canSave(){
                return tm.tenant != undefined && tm.tenantModules.length > 0;
            }
        }
    }