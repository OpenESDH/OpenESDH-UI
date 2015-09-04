(function(){
    'use strict';

    angular.module('openeApp.cases', [ 'ngMaterial', 'pascalprecht.translate'])
        .config(config);
    
    config.$inject = ['$translatePartialLoaderProvider'];
    
    function config($translatePartialLoaderProvider){
        $translatePartialLoaderProvider.addPart('case.info');
    }
})();
