
    angular
        .module('openeApp')
        .filter('openeDate', openeDateFilterFactory);
    
    function openeDateFilterFactory(dateFilter){
        function openeDateFilter(dateValue, givenFormat) {
            if(dateValue == undefined || dateValue == null){
                return '';
            }
            
            var format = 'dd. MMM. yyyy HH:mm';
            if(givenFormat == 'fullDate'){
                format = 'dd. MMM. yyyy HH:mm:ss';
            }
            
            return dateFilter(dateValue, format);
        }
        return openeDateFilter;
    }