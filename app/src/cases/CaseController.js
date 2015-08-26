(function(){

  angular
       .module('cases')
       .controller('CaseController', [ '$scope', CaseController ]);

  /**
   * Main Controller for the Cases module
   * @param $scope
   * @param cases
   * @constructor
   */
  function CaseController($scope) {
    
    $scope.cases = [
      {
        caseId: 5672855,
        title: 'Case title goes here',
        desc: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.',
        type: 'Casetype',
        createdDate: 'May 2 2015',
        startDate: 'May 2 2015',
        modifiedDate: 'May 12 2015',
        endDate: 'June 21 2015',
        status: 'In progress',
        owner: 'Someone Someonesson'
      },
      {
        caseId: 12442,
        title: 'Another case title goes here',
        desc: 'Horses horses horses',
        type: 'Casetype',
        createdDate: 'May 2 2015',
        startDate: 'May 2 2015',
        modifiedDate: 'May 12 2015',
        endDate: 'June 21 2015',
        status: 'Archived',
        owner: 'Someone Elsesson'
      }
    ];
    
  };

})();
