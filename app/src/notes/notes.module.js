(function(){
    'use strict';

    angular
        .module('openeApp.notes', [ 'ngMaterial', 'pascalprecht.translate'])
        .config(config);
    
    config.$inject = ['$translatePartialLoaderProvider'];
    
    function config($translatePartialLoaderProvider){
        $translatePartialLoaderProvider.addPart('notes');
    }
})();
