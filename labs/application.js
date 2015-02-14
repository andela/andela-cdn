(function(){
  'use strict';
  var AndeLabs = angular.module('AndeLabs', []);
  AndeLabs.run(['$rootScope', 'Reporter', '$http', function($rootScope, Reporter, $http) {

  }]);

  AndeLabs.factory('Refs', ['$rootScope',
    function($rootScope) {
      var rootRef = new Firebase("https://andelabs-dev.firebaseio.com/");

      var uid = window.localStorage.getItem("labUid");
      while(!uid) {
        uid = prompt('Please enter your labs uid');
        window.localStorage.setItem("labUid", uid);
      }
      $rootScope.uid = uid;
      var userRef = rootRef.child('users').child(uid);
      return {
        root: rootRef,
        queue: rootRef.child('queue'),
        user: userRef,
        started: userRef.child('started_labs'),
        completed: userRef.child('completed_labs'),
        session: rootRef.child('sessions').child(uid).child(LabSlug)
      };
  }]);

  AndeLabs.factory('Authentication', ['Reporter', '$rootScope', '$http', function(Reporter, $rootScope, $http) {
    return {
      auth: function (uid, cb) {
        $http.get(Reporter.path + 'users/' + uid)
        .success(function(res) {
          console.log(res);
          cb(res);
        })
        .error(function(err) {
          console.log(err);
        });
      },
      login: function() {
        Refs.root.authWithOAuthPopup('google', function(err,data) {
        }, {remember: true, scope: 'email'});
      },
      logout: function() {
        window.localStorage.removeItem('labUid');
        delete $rootScope.uid;
        return false;
      }
    };
  }]);

  AndeLabs.factory('Reporter', ['Refs', '$rootScope', '$http', function(Refs, $rootScope, $http) {
    return {
      path: 'http://andelabs-staging.herokuapp.com/api/',
      reportComplete: function(cb) {
        $http.post(this.path + 'labs/completed/' + LabSlug, {uid: $rootScope.uid, categoryId: CategoryId})
        .success(function(res) {
          console.log(res);
        })
        .error(function(err) {
          console.log(err);
        });
      },

      reportTries: function(cb) {
        $http.post(this.path + 'labs/attempt/' + LabSlug, {uid: $rootScope.uid})
        .success(function(res) {
          console.log(res);
        })
        .error(function(err) {
          console.log(err);
        });
      }
    };
  }]);

  AndeLabs.controller('LabCtrl', ['Refs', 'Authentication','Reporter','$scope', '$rootScope',
    function(Refs, Authentication, Reporter, $scope, $rootScope) {
      $rootScope.$watch('uid', function(newValue) {
        if(newValue) {
          Authentication.auth($rootScope.uid, function(authData) {
            if(authData) {
              htmlReporter.initialize(Reporter);
              env.execute();
            }
            console.log($rootScope.uid, 'reporter initialized');
          });
        }
      });

      $scope.logout = function() {
       if(confirm('Are you sure you want to end your session?')) {
        Authentication.logout();
       }
      };
  }]);
})();
