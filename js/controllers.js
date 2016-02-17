app.controller('mainCtrl', function($scope, List, User) {

  $scope.list = List; // ng-repeat this

  $scope.user = User;
  // User.$bindTo($scope, 'user');

  $scope.add = function(desc) {
    $scope.list.$add({
      desc: desc,
      complete: false
    });

    $scope.desc="";
  }

});


app.controller('profileCtrl', function($scope, Auth, fbAuth, Profile) {
  $scope.userInfo = fbAuth.$getAuth();
  $scope.profile = Profile($scope.userInfo.uid);
  console.log($scope.profile);
  $scope.profile.inside = "Inside"
  $scope.profile.$save();
 
})

app.controller('navCtrl', function($scope, $state, Auth, fbAuth) {

  fbAuth.$onAuth(function(authData) {

    $scope.authData = authData;
  });

  $scope.logout = function() {
    Auth.logout();
    $state.go('home');
  }

});

app.controller('userCtrl', function($scope, $state, Auth, Chat) {

  $scope.state = $state.current.name.split('.')[1];

  console.log('user controlelr');console.log('$state.current:', $state.current);

  $scope.submit = function() {
    console.log($scope.user);
    console.log($scope.state);


       Chat.makeChatroom();

    if ($scope.state === 'login') {
      Auth.login($scope.user)
      .then(redirectHome, invalidLogin)
    } else {
      if ($scope.user.password !== $scope.user.password2) {
        resetForm();
        return alert('Passwords do not match');
      } else {
        Auth.register({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then(redirectHome)
        .catch(existingUser);
      }
    }

    function redirectHome(authData) {
      console.log('authData:', authData);
      $state.go('home');
    }

    function invalidLogin(authData) {
      invalidEntry(authData, 'Invalid email or password')
    }

    function existingUser(authData) {
      invalidEntry(authData, 'Email already exists')
    }

    function invalidEntry(err, message) {
      resetForm();
      alert(message);
      console.log('err:', err)
    }

    function resetForm() {
      $scope.user.email = '';
      $scope.user.password = '';
      $scope.user.password2 = '';
    }
  }

})

app.controller('messageCtrl', function($scope, List){
    $scope.list = List; 

      $scope.add = function(message, myUser) {
      $scope.list.$add({
        message: message,
        myUser: myUser, 
      }); 
      $scope.message = ''; 
    };

    
});




