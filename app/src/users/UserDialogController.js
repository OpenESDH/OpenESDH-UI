
angular
    .module('openeApp.users')
    .controller('UserDialogController', UserDialogController);

	function UserDialogController($scope, $mdDialog, $mdToast, $translate, userService, user) {
	    var ucd = this;

	    // Data from the user creation form
	    ucd.user = angular.copy(user);
	    ucd.dialogMode = user ? 'USER.EDIT_USER' : 'USER.CREATE_USER';
	    ucd.userExists = user ? true : false;
	    ucd.cancel = cancel;
	    ucd.update = update;

	    // When the form is submitted, show a notification:
	    ucd.toastPosition = {
	        bottom: false,
	        top: true,
	        left: false,
	        right: true
	    };

	    // Cancel or submit form in dialog
	    function cancel(form) {
	        $mdDialog.cancel();
	    }

	    function update(u) {
	    	if(ucd.userExists) ucd.user.disableAccount = !u.enabled;
	        // createSuccess is a promise!
	        var createSuccess = (ucd.userExists) ? userService.updateUser(ucd.user) : userService.createUser(ucd.user);
	        notifyUserSaved(createSuccess);
	    }	    

	    function getToastPosition() {
	        return Object.keys(ucd.toastPosition)
	            .filter(function (pos) {
	                return ucd.toastPosition[pos];
	            })
	            .join(' ');
	    }

	    function notifyUserSaved(cuSuccess) {
	        cuSuccess.then(function (user) {
				
				var msg = $translate.instant('USER.USER') + ' ';
				msg += user.firstName + ' ' + user.lastName  + ' ';
				if(ucd.userExists){
					msg += $translate.instant('COMMON.MODIFIED').toLowerCase();
				} else {
					msg += $translate.instant('COMMON.CREATED').toLowerCase();
				}

				$mdDialog.hide(user, ucd.userExists);
	            $mdToast.show(
	                $mdToast.simple()
	                    .content(msg)
	                    .position(getToastPosition())
	                    .hideDelay(3000)
	            );
	        });
	    }
	}