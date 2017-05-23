myApp.controller('LoginController', ['$scope', '$http', '$location', '$routeParams', 'UserService', function($scope, $http, $location, $routeParams, UserService) {
    $scope.user = {
      username: '',
      password: ''
    };
    $scope.message = '';

    $scope.sendResetPassword = function() {
      if($scope.user.username === '') {
        $scope.message = "Enter your username!";
      } else {
        console.log('sending to server...', $scope.user);
        $http.post('/user/forgotpassword', $scope.user).then(function(response) {
          if(response.data.username) {
            console.log('success: ', response.data);
            // location works with SPA (ng-route)
            $scope.message = "Password link sent.";
          } else {
            console.log('failure: ', response);
            $scope.message = "Failure.";
          }
        });
      }
    }

    $scope.updatePassword = function() {
      console.log('Code: ', $routeParams.code);
      // Send our password reset request to the server
      // with our username, new password and code
      if($scope.user.username === '' || $scope.user.password === '') {
        $scope.message = "Enter your username and password!";
      } else {
        console.log('sending to server...', $scope.user);
        $scope.user.code = $routeParams.code;
        $http.put('/user/resetpassword', $scope.user).then(function(response) {
          if(response.data.username) {
            console.log('success: ', response.data);
            // location works with SPA (ng-route)
            $location.path('/home');
          } else {
            console.log('failure: ', response);
            $scope.message = "Failure.";
          }
        });
      }
    }

    $scope.login = function() {
      if($scope.user.username === '' || $scope.user.password === '') {
        $scope.message = "Enter your username and password!";
      } else {
        console.log('sending to server...', $scope.user);
        $http.post('/', $scope.user).then(function(response) {
          if(response.data.username) {
            console.log('success: ', response.data);
            // location works with SPA (ng-route)
            $location.path('/user');
          } else {
            console.log('failure: ', response);
            $scope.message = "Wrong!!";
          }
        });
      }
    };

    $scope.registerUser = function() {
      if($scope.user.username === '' || $scope.user.password === '') {
        $scope.message = "Choose a username and password!";
      } else {
        console.log('sending to server...', $scope.user);
        $http.post('/register', $scope.user).then(function(response) {
          console.log('success');
          $location.path('/home');
        },
        function(response) {
          console.log('error');
          $scope.message = "Please try again."
        });
      }
    }
}]);
