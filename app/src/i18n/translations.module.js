(function() {
    'use strict';

    angular
        .module('openeApp.translations', [
            'pascalprecht.translate'
        ])
        .config(config);

    config.$inject = ['$translateProvider', '$translatePartialLoaderProvider'];

    function config($translateProvider, $translatePartialLoaderProvider) {
        
        $translatePartialLoaderProvider.addPart('common');
        $translateProvider.useLoader('$translatePartialLoader', {
           urlTemplate: '/app/src/i18n/{lang}/{part}.json' 
        });
        $translateProvider
            .preferredLanguage('en_EN');
    }

})();
