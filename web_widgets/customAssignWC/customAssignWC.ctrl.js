function PbButtonCtrl($scope, $http, $location, $log, $window) {

   'use strict';

  var vm = this;

  this.action = function action() {
    var id;
    if ($scope.properties.action === 'Submit task') {
      id = getUrlParam('id');
      if (id) {
        vm.busy = true;
        var req = {
          method: 'PUT',
          url: '../API/bpm/userTask/' + getUrlParam('id'),
          data: {'assigned_id': $scope.properties.assignedId}//,
          //params:  getUserParam()
        };
    
       $http(req)
          .success(function(data, status) {
              var req = {
                  method: 'POST',
                  url: '../API/bpm/userTask/' + getUrlParam('id') + '/execution',
                  data: $scope.properties.contract//,
                  //params:  getUserParam()
                };
                $http(req)
                    .success(function(data,status) {
                        notifyParentFrame({ message: 'success', status: status, dataFromSuccess: data });
                        //$window.location.assign($scope.properties.targetUrlOnSuccess);
                    })
                    .error(function(data, status) {
                        $scope.properties.dataFromError = data;
                        notifyParentFrame({ message: 'error', status: status, dataFromError: data  });
                     })
          })
          .error(function(data, status) {
            $scope.properties.dataFromError = data;
            notifyParentFrame({ message: 'error', status: status, dataFromError: data  });
          })
          .finally(function() {
            vm.busy = false;
          });
      } else {
        $log.log('Impossible to retrieve the task id value from the URL');
      }
    }
  };

  function notifyParentFrame(additionalProperties) {
    if ($window.parent !== $window.self) {
      var dataToSend = angular.extend({}, $scope.properties, additionalProperties);
      $window.parent.postMessage(JSON.stringify(dataToSend), '*');
    }
  }

  function getUserParam() {
    var userId = getUrlParam('user');
    if (userId) {
      return { 'user': userId };
    }
    return {};
  }

  /**
   * Extract the param value from a URL query
   * e.g. if param = "id", it extracts the id value in the following cases:
   *  1. http://localhost/bonita/portal/resource/process/ProcName/1.0/content/?id=8880000
   *  2. http://localhost/bonita/portal/resource/process/ProcName/1.0/content/?param=value&id=8880000&locale=en
   *  3. http://localhost/bonita/portal/resource/process/ProcName/1.0/content/?param=value&id=8880000&locale=en#hash=value
   * @returns {id}
   */
  function getUrlParam(param) {
    var paramValue = $location.absUrl().match('[//?&]' + param + '=([^&#]*)($|[&#])');
    if (paramValue) {
      return paramValue[1];
    }
    return '';
  }
}