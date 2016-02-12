
    angular
            .module('openeApp.systemsettings')
            .factory('tenantsService', tenantsService);
    
    function tenantsService($http){
        var service = {
            getAllTenants: getAllTenants,
            getAllTenantsModules: getAllTenantsModules,
            saveTenantModules: saveTenantModules,
            getOpeneModules: getOpeneModules,
            deleteTenantModules: deleteTenantModules,
            createTenant: createTenant
        };
        return service;
        
        function getAllTenants(){
            return $http.get('/api/tenants').then(function(response){
                var tenants = response.data.tenants.map(function(item){
                    return item.tenantDomain;
                })
                return tenants;
            });
        }
        
        function getAllTenantsModules(){
            return $http.get('/api/openesdh/tenant/all/modules').then(function(response){
                return response.data;
            });
        }
        
        function saveTenantModules(tenant, modules){
            return $http.post('/api/openesdh/tenant/' + tenant + '/modules', modules).then(function(response){
                return response.data;
            });
        }
        
        function getOpeneModules(){
            return $http.get('/api/openesdh/modules').then(function(response){
                return response.data;
            });
        }
        
        function deleteTenantModules(tenant){
            return $http.delete('/api/openesdh/tenant/' + tenant + '/modules');
        }
        
        function createTenant(tenant){
            //replace windows path
            tenant.tenantContentStoreRoot = tenant.tenantContentStoreRoot.replace(/\\/g, "/");
            return $http.post('/api/tenants', tenant);
        }
    }