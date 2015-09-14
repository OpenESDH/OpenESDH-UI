(function(){
    'use strict';

    angular.module('openeApp.parties', [ 'ngMaterial', 'pascalprecht.translate'])
        .config(config);
    
    config.$inject = ['$translatePartialLoaderProvider'];
    
    function config($translatePartialLoaderProvider){
        $translatePartialLoaderProvider.addPart('party');
    }
})();
