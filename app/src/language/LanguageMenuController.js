(function() {
    'use strict';

    angular
        .module('openeApp')
        .controller('LanguageMenuController', LanguageMenuController);

    LanguageMenuController.$inject = ['$translate', 'availableLanguages'];

    function LanguageMenuController($translate, availableLanguages) {
        var vm = this;
        vm.setLanguage = setLanguage;
        vm.availableLangKeys = availableLanguages.keys;
        vm.currentLanguage = $translate.use();

        function setLanguage(lang) {
            $translate.use(lang);
            vm.currentLanguage = lang;
        }
    }
})();
