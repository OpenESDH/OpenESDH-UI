
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
	        	if (value > 0) {
		        	var height = element[0].getElementsByClassName('md-virtual-repeat-sizer')[0].offsetHeight;
		            mdVirtualRepeatContainer.setSize_(height);
		            mdVirtualRepeatContainer.repeater.containerUpdated();
	        	}
	        });
	    }
	};
}