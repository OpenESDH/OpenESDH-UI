(function(){
  'use strict';

  angular.module('cases').service('caseService', ['$q', CaseService]);

  function CaseService($q){
    var cases = [
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
      }
    ];

    // Promise-based API
    return {
      loadAllUsers : function() {
        // Simulate async nature of real remote calls
        return $q.when(cases);
      }
    };
  }

})();
