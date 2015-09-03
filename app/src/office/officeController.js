(function(){
    'use strict';

    angular
        .module('openeApp.office')
        .controller('OfficeController', OfficeController);

    OfficeController.$inject = [];

    function OfficeController() {
        console.log('office controller');
    }
})();