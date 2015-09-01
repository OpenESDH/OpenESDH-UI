(function() {
    'use strict';
    
    angular
        .module('openeApp')
        .filter('docCategory', docCategoryFilterFactory);
    
    docCategoryFilterFactory.$inject = ['$translate'];
    
    function docCategoryFilterFactory($translate){
        function docCategoryFilter(docCategoryValue) {
            return $translate.instant('document.category.' + docCategoryValue);
        }
        return docCategoryFilter;
    }
    
})();
    
