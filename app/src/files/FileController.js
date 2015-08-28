(function(){

  angular
       .module('files')
       .controller('FileController', ['$scope', FileController]);

  function FileController( $scope ) {
    
    $scope.files = [
      {
        title: 'Somefilename.doc',
        modifiedDate: 'Aug 26 2015',
        modifiedBy: 'Svend Tveskæg',
        createdDate: 'Jun 1 2015',
        createdBy: 'Someone Someonsson',
        icon: ''
      },
      {
        title: 'Otherfilename.doc',
        modifiedDate: 'Aug 26 2015',
        modifiedBy: 'Svend Tveskæg',
        createdDate: 'Jun 1 2015',
        createdBy: 'Someone Someonsson',
        icon: ''
      },
      {
        title: 'Somefilename.pdf',
        modifiedDate: 'Aug 26 2015',
        modifiedBy: 'Svend Tveskæg',
        createdDate: 'Jun 1 2015',
        createdBy: 'Someone Someonsson',
        icon: ''
      }
    ];
    
  }

})();
