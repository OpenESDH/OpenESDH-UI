
  angular
       .module('openeApp.cases')
       .controller('CaseHistoryController', CaseHistoryController);
  
  function CaseHistoryController($scope, $stateParams, caseHistoryService) {
    var vm = this;
    vm.caseId = $stateParams.caseId;
    vm.pageSize = 25;
    vm.currentPage = 1;
    vm.previousPage = false;
    vm.nextPage = false;
    
    vm.loadHistory = loadHistory;
    vm.loadPreviousPage = loadPreviousPage;
    vm.loadNextPage = loadNextPage;
    
    //lets init only when tab is selected
    $scope.$on('tabSelectEvent', function(event, args) {
        if (args.tab === 'history') {
            loadHistory();
        }
    });
    
    function loadHistory(page){
        if(!page){
            page = 1;
        }
        vm.currentPage = page;
        caseHistoryService.getCaseHistory(vm.caseId, page, vm.pageSize).then(function(response){
            vm.history = response.history;
            vm.startIndex = ((page - 1) * vm.pageSize) + 1;
            vm.endIndex = (vm.startIndex + vm.pageSize) - 1;
            vm.totalItems = response.contentRange.totalItems;
            if(vm.endIndex > vm.totalItems){
                vm.endIndex = vm.totalItems;
            }
            
            vm.previousPage = (page !== 1);
            var pagesCount = Math.ceil(response.contentRange.totalItems / vm.pageSize);
            vm.nextPage = (page !== pagesCount);
        });
    }
    
    function loadPreviousPage(){
        if(vm.currentPage === 1){
            return;
        }
        loadHistory(vm.currentPage - 1);
    }
    
    function loadNextPage(){
        var pagesCount = Math.ceil(vm.totalItems / vm.pageSize);
        if(vm.currentPage === pagesCount){
            return;
        }
        loadHistory(vm.currentPage + 1);
    }
  };