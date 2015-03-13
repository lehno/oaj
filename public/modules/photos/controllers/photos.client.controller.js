'use strict';

// Photos controller
angular.module('photos').controller('PhotosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Photos','$mdDialog',
	function($scope, $stateParams, $location, Authentication, Photos,$mdDialog) {
		$scope.authentication = Authentication;

        $scope.openPhotoUpload = function(ev) {
            $mdDialog.show({
                controller: 'PhotoUploadController',
                templateUrl: 'modules/photos/views/create-photo.client.view.html',
                targetEvent: ev
            }).then(function() {
                $scope.getImages();
            });
        };

        $scope.getImages = function(){
            $scope.photos = Photos.query();
        };

		// Remove existing Photo
		$scope.remove = function(photo) {
			if ( photo ) { 
				photo.$remove();

				for (var i in $scope.photos) {
					if ($scope.photos [i] === photo) {
						$scope.photos.splice(i, 1);
					}
				}
			} else {
				$scope.photo.$remove(function() {
					$location.path('photos');
				});
			}
		};

		// Update existing Photo
		$scope.update = function() {
			var photo = $scope.photo;

			photo.$update(function() {
				$location.path('photos/' + photo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Photos
		$scope.find = function() {
			$scope.photos = Photos.query();
		};

		// Find existing Photo
		$scope.findOne = function() {
			$scope.photo = Photos.get({ 
				photoId: $stateParams.photoId
			});
		};
	}
]);
