    angular
        .module('openeApp.dashboard')
        .provider('dashboardService', dashboardServiceProvider);
    
    function dashboardServiceProvider(){
        var dashlets = [];
        var extUserDashlets = [];
        this.addDashlet = addDashlet;
        this.addExtUserDashlet = addExtUserDashlet;
        this.$get = dashboardService;
        
        function addDashlet(dashlet){
            dashlets.push(dashlet);
            return this;
        }
        
        function addExtUserDashlet(dashlet){
            extUserDashlets.push(dashlet);
            return this;
        }
        
        function dashboardService(sessionService){
            return {
                getDashlets: getDashlets
            };
            
            function getDashlets(){
                
                if(sessionService.isExternalUser()){
                    return extUserDashlets;
                }
                
                return dashlets;
            }
        }
    }