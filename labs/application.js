(function(){
  'use strict';
  var AndeLabs = angular.module('AndeLabs', []);
  AndeLabs.run(['$rootScope', 'Reporter', '$http', function($rootScope, Reporter, $http) {

  }]);

  AndeLabs.factory('Refs', ['$rootScope',
    function($rootScope) {
      var uid = window.localStorage.getItem("labUid");
      while(!uid) {
        uid = prompt('Please enter your labs uid');
        window.localStorage.setItem("labUid", uid);
      }
      $rootScope.uid = uid;
      return {

      };
  }]);

  AndeLabs.factory('Authentication', ['Reporter', '$rootScope', '$http', function(Reporter, $rootScope, $http) {

    return {
      auth: function (uid, cb) {
        var self = this;
        $http.get(Reporter.path + 'users/' + uid)
        .success(function(res) {
          cb(res);
        })
        .error(function(err) {
          alert(err);
          self.logout();
        });
      },
      login: function() {

      },
      logout: function() {
        window.localStorage.removeItem('labUid');
        delete $rootScope.uid;
        return false;
      }
    };
  }]);

  AndeLabs.factory('Reporter', ['$rootScope', '$http', function($rootScope, $http) {
    return {
      path: 'http://labs.andela.co/api/',
      reportComplete: function(cb) {
        $http.post(this.path + 'labs/completed/' + LabSlug, {uid: $rootScope.uid, categoryId: CategoryId})
        .success(function(res) {
        })
        .error(function(err) {
          console.log(err);
        });
      },

      reportTries: function(cb) {
        $http.post(this.path + 'labs/attempt/' + LabSlug, {uid: $rootScope.uid})
        .success(function(res) {
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
