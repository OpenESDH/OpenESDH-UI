    angular
        .module('openeApp.dashboard')
        .provider('dashboardService', dashboardServiceProvider);
    
    function dashboardServiceProvider(){
        var dashlets = [];
        this.addDashlet = addDashlet;
        this.$get = dashboardService;
        
        function addDashlet(dashlet){
            dashlets.push(dashlet);
            return this;
        }
        
        function dashboardService(){
            return {
                getDashlets: getDashlets
            };
            
            function getDashlets(){
                return dashlets;
            }
        }
    }