(function(){
    'use strict';

    angular
        .module('openeApp.documents', [ 'ngMaterial', 'pascalprecht.translate'])
        .config(config);
    
    config.$inject = ['$translatePartialLoaderProvider'];
    
    function config($translatePartialLoaderProvider){
        $translatePartialLoaderProvider.addPart('case.document');
        $translatePartialLoaderProvider.addPart('case.document.dialog');
    }
    

})();
