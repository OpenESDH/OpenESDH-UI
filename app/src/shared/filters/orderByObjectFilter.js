    angular
        .module('openeApp')
        .filter('orderObjectBy', orderObjectBy);

    function orderObjectBy() {
        return function(items, field, reverse) {
            if (field) {                    
                var filtered = [];
                angular.forEach(items, function(item) {
                    filtered.push(item);
                });

                function index(obj, i) {
                    return obj[i];
                }
                filtered.sort(function(a, b) {
                    var comparator, reducedA, reducedB;
                    if (field) {
                        reducedA = field.split('.').reduce(index, a);
                        reducedB = field.split('.').reduce(index, b);
                        reducedA = reducedA == null ? "" : reducedA.toString().toLowerCase();
                        reducedB = reducedB == null ? "" : reducedB.toString().toLowerCase();
                        if (reducedA === reducedB) {
                            comparator = 0;
                        } else {
                            comparator = (reducedA > reducedB ? 1 : -1);
                        }
                    }
                    return comparator;
                });
                if (reverse) filtered.reverse();
                return filtered;
            } else{
                return items;
            }
        };
    }
