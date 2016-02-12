    angular
        .module('openeApp.header')
        .provider('modulesMenuService', modulesMenuServiceProvider);
    
    function modulesMenuServiceProvider(){
        var items = [];
        this.addItem = addItem;
        this.$get = modulesMenuService;
        
        function addItem(item){
            items.push(item);
            return this;
        }
        
        function modulesMenuService(){
            return {
                getItems: getItems
            };
            
            function getItems(){
                return items;
            }
        }
    }