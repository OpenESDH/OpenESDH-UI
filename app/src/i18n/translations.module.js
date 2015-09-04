(function() {
    'use strict';

    angular
        .module('openeApp.translations', [
            'pascalprecht.translate'
        ])
        .config(config);

    config.$inject = ['$translateProvider', '$translatePartialLoaderProvider'];

    function config($translateProvider, $translatePartialLoaderProvider) {
        
        $translatePartialLoaderProvider.addPart('login');
        $translatePartialLoaderProvider.addPart('menu');
        $translatePartialLoaderProvider.addPart('common');
        $translateProvider.useLoader('$translatePartialLoader', {
           urlTemplate: '/app/src/i18n/{lang}/{part}.json' 
        });
        
        $translateProvider
            .registerAvailableLanguageKeys(['en', 'da'], {
              'en_US': 'en',
              'en_UK': 'en',
              'da_DK': 'da'
            })
            .determinePreferredLanguage();
    }

})();
