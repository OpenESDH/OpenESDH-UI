    angular
        .module('openeApp.header')
        .provider('modulesMenuService', modulesMenuServiceProvider);
    
    function modulesMenuServiceProvider(){
        var items = [];
        var extUserItems = [];
        this.addItem = addItem;
        this.addExtUserItem = addExtUserItem;
        this.$get = modulesMenuService;
        
        function addItem(item){
            items.push(item);
            return this;
        }
        
        function addExtUserItem(item){
            extUserItems.push(item);
            return this;
        }
        
        function modulesMenuService(sessionService){
            return {
                getItems: getItems
            };
            
            function getItems(){
                if(sessionService.isExternalUser()){
                    return extUserItems;
                }
                return items;
            }
        }
    }