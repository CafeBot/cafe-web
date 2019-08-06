;(function(){
    'use strict';

    var app = angular.module('um');

    app.controller('ActionManagerController', ["$scope","notifier","UmActionService","UserService",
      "$resource","$mdDialog","AclService","$state",
    function($scope,notifier,UmActionService,UserService,$resource,$mdDialog,AclService,$state){

            var user = UserService.getCurrentUser();

            $scope.itemPerPageMeta = [10,20,30];
            $scope.size = 10;
            var defaultPage = 1;
            $scope.can = AclService.can;
            $scope.data ={
              search : ''
            }

            if(!$scope.can('UM_ACTION')){
              $state.go('/user-management-home');
            }

            if (!user.username) {
                $scope.$emit('onSuccessfulLogin');
            }

            $scope.fetchAllActions = function(pageNo,size){
                $scope.tableData = [];
                $scope.currentPage = pageNo;
                $scope.size = size;
                var actionResponse = UmActionService.get({
                    "institutionId" : user.institutionID,
                    "page":pageNo-1,
                    "size": size,
                    "sort":"id,Desc"
                });

                actionResponse.$promise.then(actionSuccessHandler,actionErrorHandler);
            }
            $scope.fetchAllActions(defaultPage,$scope.size);

            function actionSuccessHandler(data){
                if(data){
                    var response = data.toJSON();
                    $scope.total_items = response.totalCount;
                    $scope.tableData = response.data;
                }
            }

            function actionErrorHandler(){
                 $scope.currentPage = 1;
                 $scope.tableData = null;
                 notifier.logError("Sorry we are unable to load your data");
            }

            $scope.AddNewAction = function(mode, currentRow){
                $mdDialog.show({
                  controller: 'addActionController',
                  templateUrl: 'views/templates/add-action-model.html',
                  parent: angular.element(document.body),
                  clickOutsideToClose:false,
                  locals: {id : user.institutionID, mode : mode, currentRow : currentRow}
                })
                .then(function(answer) {

                    $scope.fetchAllActions(defaultPage,$scope.size);

                }, function() {
                    if(mode === 'ADD'){
                       $scope.fetchAllActions(defaultPage,$scope.size);
                    }
                    else {
                      $scope.fetchAllActions($scope.currentPage,$scope.size);
                    }

                });
                $scope.data.search = "";
            }

            $scope.enableDisableAction = function(currentRow){

                UmActionService.patch(currentRow).$promise.then(function(response){
                    if(response){
                        notifier.logSuccess("Successfully Updated your flag");
                    }
                },function(){
                    //$scope.tableData[currentRow].bActive = !currentRow.bActive;
                     notifier.logWarning("Sorry We are unable to update your flag!");
                });
            }

            var previousWindowKeyDown = window.onkeydown;

            $scope.deleteActionName = function(actionName){
              if(actionName){
                swal({
                    title: "Are you sure?",
                    text: "You will not be able to recover this action!",
                    //type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false
                  },
                  function(isConfirm){
                      if(isConfirm){
                        
                        window.onkeydown = previousWindowKeyDown;

                        var deleteResponse = UmActionService.delete({
                         "institutionId": user.institutionID,
                         "actionName": actionName
                        });

                          deleteResponse.$promise.then(function(data,headers){
                              if(data){
                                  $scope.fetchAllActions(defaultPage,$scope.size);
                                  swal("Deleted!", "Your action name has been deleted.", "success");
                              }
                          }, function(data){
                              notifier.logWarning("Sorry! unable to delete this action");
                          });
                      }
                });
              }
            }

            $scope.searchByActionName = function(actionName){
              if(actionName.length > 3){
                UmActionService.get({
                    "institutionId" : user.institutionID,
                    "searchTerm":actionName,
                    "status" : '',
                }).$promise.then(actionSuccessHandler,actionErrorHandler);
              }else if (actionName.length === 0) {
                $scope.fetchAllActions(defaultPage,$scope.size);
              }
            }
    }]);

    app.controller('addActionController',["$scope","locals","$mdDialog","UmActionService","AclService","notifier",
        function($scope,locals,$mdDialog,UmActionService,AclService,notifier){

        Ladda.bind( 'button[class="ladda-button"]');
        $scope.loadAddNew=false;

        if(locals.mode === 'ADD'){
            $scope.header="ADD NEW ACTION";
            $scope.actionData = {
                bActive : "true",
                iInstId : locals.id
            }
        }else{
            $scope.header="UPDATE EXISTING ACTION";
            $scope.actionData = angular.copy(locals.currentRow);
            $scope.actionData.bActive = locals.currentRow.bActive.toString();
        }
        $scope.can = AclService.can;

        $scope.locals = locals;

        $scope.submit = function(valid){

            if(valid){
              $scope.loadAddNew=true;
                UmActionService.update($scope.actionData).$promise.then(successHandler,errorHandler);
            }
        }

        $scope.update = function(valid){

            if(valid){
              $scope.loadAddNew=true;
                UmActionService.save($scope.actionData).$promise.then(successHandler,errorHandler);
            }
        }

        function successHandler(data){
            if(data){
               $scope.loadAddNew=false;
               $mdDialog.cancel();
            }
        }

        function errorHandler(){
            $scope.loadAddNew=false;
            notifier.logWarning("Sorry We are unable to complete your request!");
        }

        $scope.closeModal = function() {
            $mdDialog.cancel();
        };

    }]);

}).call(this);
