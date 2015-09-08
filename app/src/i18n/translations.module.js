(function() {
    'use strict';

    angular
        .module('openeApp.translations', [
            'pascalprecht.translate'
        ])
        .factory('availableLanguages', AvailableLanguages)
        .config(config);
    
    var availableLanguages = {
        keys: ['en', 'da'],
        localesKeys: {
            'en_US': 'en',
            'en_UK': 'en',
            'da_DK': 'da'
        }
    }; 
    
    function AvailableLanguages(){
        return availableLanguages;
    }

    config.$inject = ['$translateProvider', '$translatePartialLoaderProvider'];

    function config($translateProvider, $translatePartialLoaderProvider) {
        
        $translatePartialLoaderProvider.addPart('login');
        $translatePartialLoaderProvider.addPart('menu');
        $translatePartialLoaderProvider.addPart('common');
        $translatePartialLoaderProvider.addPart('document.preview');
        $translateProvider.useLoader('$translatePartialLoader', {
           urlTemplate: '/app/src/i18n/{lang}/{part}.json' 
        });
        
        $translateProvider
            .registerAvailableLanguageKeys(availableLanguages.keys, availableLanguages.localesKeys)
            .determinePreferredLanguage();
    }

})();
