(function(){

  angular
       .module('openeApp.documents')
       .controller('DocumentController', DocumentController);

  DocumentController.$inject = ['$scope'];

  function DocumentController($scope) {
  
    $scope.docs = [
      {
        title: 'Document title',
        docNo: 4686297957,
        type: 'Invoice',
        category: 'Accounting',
        state: 'Draft',
        owner: 'Someone Someonesson',
        createdDate: 'June 12, 2015',
        modifiedDate: 'June 23, 2015',
        isUpdated: true
      },
      {
        title: 'Another document title',
        docNo: 154,
        type: 'Invoice',
        category: 'Accounting',
        state: 'Draft',
        owner: 'Someone Someonesson',
        createdDate: 'June 12, 2015',
        modifiedDate: 'June 23, 2015',
        isUpdated: true
      },
      {
        title: 'Title title title',
        docNo: 286684,
        type: 'Invoice',
        category: 'Accounting',
        state: 'Draft',
        owner: 'Someone Someonesson',
        createdDate: 'June 12, 2015',
        modifiedDate: 'June 23, 2015',
        isUpdated: false
      }
    ];
  
  }

})();
