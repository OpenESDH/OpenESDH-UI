    angular
        .module('openeApp.systemsettings')
        .controller('TenantsModulesController', TenantsModulesController);
    
    function TenantsModulesController(tenantsService, $mdDialog, $translate, notificationUtilsService){
        var vm = this;
        vm.deleteModules = deleteModules;
        vm.editTenantModules = editTenantModules;
        vm.createTenant = createTenant;
        
        loadList();
        
        function loadList(){
            tenantsService.getTenantsInfo().then(function(data){
                vm.tenantsInfo = data;
            });
            
            tenantsService.getOpeneModules().then(function(data){
               vm.openeModules = data; 
            });
        }
        
        function deleteModules(ev, tenant){
            ev.stopPropagation();
            
            var confirm = $mdDialog.confirm()
                    .title($translate.instant('COMMON.CONFIRM'))
                    .textContent($translate.instant('ADMIN.SYS_SETTINGS.TENANTS_MODULES.ARE_YOU_SURE_YOU_WANT_TO_DISABLE_TENANT_MODULES', {tenant: tenant}))
                    .targetEvent(ev)
                    .ok($translate.instant('COMMON.YES'))
                    .cancel($translate.instant('COMMON.CANCEL'));
            $mdDialog.show(confirm).then(function() {
                tenantsService.deleteTenantModules(tenant).then(function(){
                    loadList();
                });
            });
        }
        
        function editTenantModules(ev, tenantInfo){
            showDialog(ev, tenantInfo);    
        }
        
        function createTenant(ev){
            $mdDialog.show({
                controller: TenantDialogController,
                controllerAs: 'tc',
                templateUrl: 'app/src/system_settings/tenant/view/tenantCrudDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        }
        
        function TenantDialogController($scope, $mdDialog){
            var tc = this;
            tc.cancel = cancel;
            tc.save = save;
            tc.tenant = {
                tenantDomain: null,
                tenantAdminPassword: null,
                tenantContentStoreRoot: null
            };
            
            function cancel(){
                $mdDialog.cancel();
            }
            
            function save(form){
                if (!form.$valid) {
                    return;
                }
                $mdDialog.hide();
                tenantsService.createTenant(tc.tenant).then(function(response){
                    notificationUtilsService.notify($translate.instant('ADMIN.SYS_SETTINGS.TENANTS_MODULES.TENANT_CREATED', tc.tenant));
                    loadList();
                }, saveError);
            }
            
            function saveError(response) {
                console.log(response);
            }
        }
        
        function showDialog(ev, tenantInfo){
            $mdDialog.show({
                controller: TenantModulesDialogController,
                controllerAs: 'tm',
                templateUrl: 'app/src/system_settings/tenant/view/tenantModulesCrudDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    tenantInfo: tenantInfo
                }
            }).then(function(){
                loadList();
            });
        }
        
        function TenantModulesDialogController($scope, $mdDialog, tenantInfo) {
            var tm = this;
            tm.tenantDomain = tenantInfo.tenantDomain;
            tm.tenantUIContext = tenantInfo.tenantUIContext;
            tm.cancel = cancel;
            tm.save = save;
            tm.openeModules = vm.openeModules.map(function(module){
                var selected = tenantInfo.modules.indexOf(module) != -1;
                return {id:module, selected:selected};
            });
            tm.tenants = vm.tenants;
            tm.moduleSelected = moduleSelected;
            tm.canSave = canSave;
            tm.tenantModules = tenantInfo.modules.slice();
            
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
                var data = {
                        tenantDomain: tenantInfo.tenantDomain,
                        tenantUIContext: tm.tenantUIContext,
                        modules: tm.tenantModules
                };
                tenantsService
                    .saveTenantInfo(data)
                    .then(refreshInfoAfterSuccess, saveError);
            }

            function refreshInfoAfterSuccess(savedDocumentCategory) {
                $mdDialog.hide();
            }

            function saveError(response) {
                console.log(response);
            }
            
            function canSave(form){                
                return form != undefined && form.$valid && tm.tenantModules.length > 0;
            }
        }
    }