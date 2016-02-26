
angular
    .module('openeApp')
    .directive('flexHeight', flexHeight);

function flexHeight(){
	return {
	    restrict: 'A',
	    require: '^mdVirtualRepeatContainer',
	    link: function(scope, element, attributes, mdVirtualRepeatContainer) 
	    {
	        scope.$watch(function ()
	        {
	            return element[0].getElementsByClassName('md-virtual-repeat-offsetter')[0].children.length;
	        }, function(value){
	        	var currentHeight = element[0].offsetHeight;
	        	var height = element[0].getElementsByClassName('md-virtual-repeat-sizer')[0].offsetHeight;
	        	if (value > 0 && height > currentHeight) {
		            mdVirtualRepeatContainer.setSize_(height);
		            mdVirtualRepeatContainer.repeater.containerUpdated();
	        	}
	        });
	    }
	};
}