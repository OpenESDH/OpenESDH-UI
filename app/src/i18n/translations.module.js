
    angular
        .module('openeApp.translations', ['pascalprecht.translate'])
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

    function config($translateProvider, $translateStaticFilesLoaderProvider) {
        
        $translateProvider.useStaticFilesLoader({
            prefix: '/app/src/i18n/',
            suffix: '.json'
        });
        
        $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
        $translateProvider
            .registerAvailableLanguageKeys(availableLanguages.keys, availableLanguages.localesKeys)
            .determinePreferredLanguage();
    }
