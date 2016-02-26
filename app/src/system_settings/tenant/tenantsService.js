
    angular
            .module('openeApp.systemsettings')
            .factory('tenantsService', tenantsService);
    
    function tenantsService($http){
        var service = {
            getAllTenants: getAllTenants,
            getTenantsInfo: getTenantsInfo,
            saveTenantInfo: saveTenantInfo,
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
        
        function getTenantsInfo(){
            return $http.get('/api/openesdh/tenants').then(function(response){
                return response.data;
            });
        }
        
        function saveTenantInfo(tenant){
            return $http.post('/api/openesdh/tenant/update', tenant).then(function(response){
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
            return $http.post('/api/openesdh/tenant', tenant);
        }
    }