;(function() {
    'use strict';
    var app = angular.module('um.directives', []);

    app.directive('backImg', function() {
        return function(scope, element, attrs) {
            var url = attrs.backImg;
            element.css({
                'background-image': 'url(' + url + ')',
                'background-size': 'cover'
            });
        };
    });

    app.directive('capitalize', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                var capitalize = function(inputValue) {
                    if (!inputValue) {inputValue = '';}
                    var capitalized = inputValue.replace(/^((.)|\s(.))+/g,
                        function(v) {
                            return v.toUpperCase();
                        });
                    if (capitalized !== inputValue) {
                        modelCtrl.$setViewValue(capitalized);
                        modelCtrl.$render();
                    }
                    return capitalized;
                }
                modelCtrl.$parsers.push(capitalize);
                modelCtrl.$formatters.push(capitalize);
                capitalize(scope[attrs.ngModel]); // capitalize initial value
            }
        };
    });

    app.directive('initcap', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                var capitalize = function(inputValue) {
                    if (inputValue == undefined) inputValue = '';
                    var capitalized = inputValue.replace(/^(.)|\s(.)/g, function(v) {
                        return v.toUpperCase();
                    });
                    if (capitalized !== inputValue) {
                        modelCtrl.$setViewValue(capitalized);
                        modelCtrl.$render();
                    }
                    return capitalized;
                }
                modelCtrl.$parsers.push(capitalize);
                capitalize(scope[attrs.ngModel]); // capitalize initial value
            }
        };
    });

    app.directive('rupees', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                var formate = function(inputValue) {

                    if (!inputValue) {
                        if(scope.isDefaultZero){
                            inputValue = '0';
                        }else{
                            inputValue = '';
                        }
                    }else{
                        inputValue = inputValue.toString().replace(/,/g, '');
                        inputValue=Math.round(inputValue);
                    }

                    var transformedInput = (inputValue + "").replace(/[^(0-9)|\-]/g, '');
                    if(transformedInput!==''){
                       var iVal = parseInt(transformedInput);
                        transformedInput = iVal+"";
                    }

                    var rupee = torupee(transformedInput);
                    if (inputValue !== rupee) {
                        modelCtrl.$setViewValue(rupee);
                        modelCtrl.$render();
                    }
                    return rupee;
                }

                function torupee(x) {
                    if (x.length > 3) {
                        var lastThree = x.substring(x.length - 3);
                        var otherNumbers = x.substring(0, x.length - 3);
                        if (otherNumbers != '') { lastThree = ',' + lastThree; }
                        var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
                        return res;
                    } else {
                        return x;
                    }
                }
                modelCtrl.$parsers.push(formate);
                modelCtrl.$formatters.push(formate);
                formate(scope[attrs.ngModel]); // capitalize initial value
            },
            scope:{
                isDefaultZero : "@"
            }
        };
    });


    app.directive("customBackground", function() {
        return {
            restrict: "A",
            controller: ["$scope", "$element", "$location", function($scope, $element, $location) {
                var addBg, path;
                return path = function() {
                    return $location.path()
                }, addBg = function(path) {
                    switch ($element.removeClass("body-home body-special body-tasks body-lock"), path) {
                        case "/":
                            return $element.addClass("body-special");
                    }
                }, addBg($location.path()), $scope.$watch(path, function(newVal, oldVal) {
                    return newVal !== oldVal ? addBg($location.path()) : void 0
                })
            }]
        }
    });

    app.directive("fixToTop", function($window) {
        var $win = angular.element($window);
        return {
            restrict: 'A',
            link: function(scope, elem, attrs, controller) {
                var topClass = attrs.fixToTop,
                    parent = elem.parent(),
                    topPadding = parseInt(attrs.paddingWhenAtTop, 10),
                    offsetTop;

                $win.on('scroll', function(e) {
                    offsetTop = (parent.offset().top - topPadding);
                    if ($win.scrollTop() >= offsetTop) {
                        elem.addClass(topClass);
                        parent.height(elem.height());
                    } else {
                        elem.removeClass(topClass);
                        parent.css("height", null);
                    }
                });
            }
        }
    }),

    app.directive('onlyDigits', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function(inputValue) {
                    if (inputValue == undefined) return '';
                    var transformedInput = inputValue.replace(/[^0-9]/g, '');
                    if (transformedInput !== inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }
                    return transformedInput;
                });
            }
        };
    });

    app.directive('onlyCharacters', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function(inputValue) {
                    if (inputValue == undefined) return '';
                    var transformedInput = inputValue.replace(/[^a-zA-Z]/g, '');
                    if (transformedInput !== inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }
                    return transformedInput;
                });
            }
        };
    });

    app.directive('replace', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, model) {
                model.$parsers.push(function(val) {
                    if (!val) {
                        return '';
                    }
                    var transformedInput = val.replace(/[^a-zA-Z0-9]/g, '');
                    if (transformedInput !== val) {
                        model.$setViewValue(transformedInput);
                        model.$render();
                    }
                    return transformedInput;
                });
            }
        };
    });

    app.directive('autoNext', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attr, form) {
                var tabindex = parseInt(attr.tabindex);
                var maxLength = parseInt(attr.maxlength);

                element.on('keyup', function(e) {
                    if (element.val().length > maxLength - 1) {
                        var next = angular.element(document.body).find('[tabindex=' + (tabindex + 1) + ']');
                        if (next.length > 0) {
                            next.focus();
                            return true;
                        } else {
                            return false;
                        }
                    }
                    return true;
                });
            }
        }
    });

    app.directive('fullscreen', function() {
        return {
            restrict: 'AC',
            template: '<i class="glyphicon glyphicon-fullscreen"></i>',
            link: function(scope, el, attr) {
                el.on('click', function() {
                    var element = el.parents(".modal-content").find(".modal-body")[0];
                    var angElelement = angular.element(element);
                    if (!$('body')
                        .hasClass("full-screen")) {
                        $('body')
                            .addClass("full-screen");
                        $('#fullscreen-toggler')
                            .addClass("active");
                        angElelement.addClass("pdfExpand");
                        if (element.requestFullscreen) {
                            element.requestFullscreen();
                        } else if (element.mozRequestFullScreen) {
                            element.mozRequestFullScreen();
                        } else if (element.webkitRequestFullscreen) {
                            element.webkitRequestFullscreen();
                        } else if (element.msRequestFullscreen) {
                            element.msRequestFullscreen();
                        }

                    } else {
                        angElelement.removeClass("pdfExpand");
                        $('body').removeClass("full-screen");
                        el.removeClass("active");

                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        } else if (document.mozCancelFullScreen) {
                            document.mozCancelFullScreen();
                        } else if (document.webkitExitFullscreen) {
                            document.webkitExitFullscreen();
                        }
                    }
                });
            }
        };
    });

    app.directive('widgetMaximize', function() {
        return {
            restrict: 'A',
            template: '<i class="fa fa-expand"></i>',
            link: function(scope, el, attr) {
                el.on('click', function() {
                    var widget = el.parents(".modal-dialog").eq(0);
                    var button = el.find("i").eq(0);
                    var compress = "fa-compress";
                    var expand = "fa-expand";
                    if (widget.hasClass("maximized")) {
                        if (button) {
                            button.addClass(expand).removeClass(compress);
                        }
                        widget.removeClass("maximized");
                        widget.find("object").css("height", "480px");
                    } else {
                        if (button) {
                            button.addClass(compress).removeClass(expand);
                        }
                        widget.addClass("maximized");
                        el.parents("modal-content").css("height", "100%");
                        widget.find("object").css("height", "565px");
                    }
                });
            }
        };
    });

    app.directive('selectRequired', function() {
        return {
            restrict: "A",
            require: "ngModel",
            link: function(element, scope, attr, controller) {
                controller.$validators.selectrequired = function(modelValue) {
                    return (!!modelValue) && modelValue != '';
                }
            }
        }
    });

    app.directive('accessibleForm', function() {
        return {
            restrict: 'A',
            link: function(scope, elem) {

                // set up event handler on the form element
                elem.on('submit', function() {

                    // find the first invalid element
                    var firstInvalid = elem[0].querySelector('.ng-invalid');

                    // if we find one, set focus
                    if (firstInvalid) {
                        firstInvalid.focus();
                    }
                });
            }
        };
    }),

    app.directive("validateForm", ["$parse", function($parse) {
        return {
            post: function postLink(scope, element, iAttrs, controller) {
                var form = element.controller('form');
                form.$submitted = false;
                var fn = $parse(iAttrs.validateForm);
                element.on('submit', function(event) {
                    scope.$apply(function() {
                        element.addClass('ng-submitted');
                        form.$submitted = true;
                        if (form.$valid) {
                            fn(scope, { $event: event });
                        }
                    });
                });
                scope.$watch(function() {
                    return form.$valid
                }, function(isValid) {
                    if (form.$submitted == false) return;
                    if (isValid) {
                        element.removeClass('has-error').addClass('has-success');
                    } else {
                        element.removeClass('has-success');
                        element.addClass('has-error');
                    }
                    element.focus();
                });
            }
        };
    }]),

    app.directive('thisEarlierThan', function() {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, elem, attrs, ctrl) {
                var cityStay, residenceStay;

                scope.$watch(attrs.ngModel, function(newVal, oldVal, scope) {
                    residenceStay = newVal;
                    check();
                });

                scope.$watch(attrs.thisEarlierThan, function(newVal, oldVal, scope) {
                    cityStay = newVal;
                    check();
                });

                var check = function() {
                    if (!cityStay || !residenceStay) {
                        return;
                    }

                    if (!validate(cityStay)) {
                        return;
                    }

                    if (!validate(residenceStay)) {
                        return;
                    }

                    if (parseInt(cityStay) >= parseInt(residenceStay)) {
                        ctrl.$setValidity('thisEarlierThan', true);
                    } else {
                        ctrl.$setValidity('thisEarlierThan', false);
                    }

                    return;
                };

                var validate = function(iYears) {
                    if (isNaN(parseInt(iYears))) {
                        return false;
                    } else {
                        return true;
                    }
                };
            }
        };
    }),

    app.directive('amountGreaterThanInt', function() {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, elem, attrs, ctrl) {
                var greaterAmtVal, lesserAmtVal;

                scope.$watch(attrs.ngModel, function(newVal, oldVal, scope) {
                    lesserAmtVal = newVal;
                    check();
                });

                var check = function() {
                    if (!lesserAmtVal) {
                        return;
                    }

                    if (!validate(lesserAmtVal)) {
                        return;
                    }

                    if (getInt(lesserAmtVal) >= getInt(attrs.amountGreaterThanInt)) {
                        ctrl.$setValidity('amountGreaterThanInt', true);
                    } else {
                        ctrl.$setValidity('amountGreaterThanInt', false);
                    }

                    return;
                };

                var validate = function(amt) {
                    if (isNaN(getInt(amt))) {
                        return false;
                    } else {
                        return true;
                    }
                };

                var getInt = function(val) {
                    return parseInt((val + "").replace(/,/g, ""));
                };
            }
        };
    }),
    app.directive('amountLessThan', function() {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, elem, attrs, ctrl) {
                var greaterAmtVal, lesserAmtVal;

                scope.$watch(attrs.ngModel, function(newVal, oldVal, scope) {
                    lesserAmtVal = newVal;
                    check();
                });

                scope.$watch(attrs.amountLessThan, function(newVal, oldVal, scope) {
                    greaterAmtVal = newVal;
                    check();
                });

                var check = function() {
                    if (!greaterAmtVal || !lesserAmtVal) {
                        return;
                    }

                    if (!validate(greaterAmtVal)) {
                        return;
                    }

                    if (!validate(lesserAmtVal)) {
                        return;
                    }

                    if (getInt(greaterAmtVal) >= getInt(lesserAmtVal)) {
                        ctrl.$setValidity('amountLessThan', true);
                    } else {
                        ctrl.$setValidity('amountLessThan', false);
                    }

                    return;
                };

                var validate = function(amt) {
                    if (isNaN(getInt(amt))) {
                        return false;
                    } else {
                        return true;
                    }
                };

                var getInt = function(val) {
                    return parseInt((val + "").replace(/,/g, ""));
                };
            }
        };
    }),

    app.directive('greaterThanZero', [function() {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, element, attrs, ctrl) {
                var newValue;
                scope.$watch(attrs.ngModel, function(newVal, oldVal, scope) {
                    newValue = newVal;
                    check();
                });

                var check = function() {
                    if (getInt(newValue) > 0) {
                        ctrl.$setValidity('greaterThanZero', true);
                    } else {
                        ctrl.$setValidity('greaterThanZero', false);
                    }

                    return;
                };

                var validate = function(amt) {
                    if (isNaN(getInt(amt))) {
                        return false;
                    } else {
                        return true;
                    }
                };

                var getInt = function(val) {
                    return parseInt((val + "").replace(/,/g, ""));
                };
            }
        };
    }]);

    app.directive('minimumIntegerValue', [function() {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, element, attrs, ctrl) {
                var newValue;
                scope.$watch(attrs.ngModel, function(newVal, oldVal, scope) {
                    newValue = newVal;
                    check();
                });

                var check = function() {
                    if (getInt(newValue) < attrs.minimumIntegerValue) {
                        ctrl.$setValidity('minimumIntegerValue', false);
                    } else {
                        ctrl.$setValidity('minimumIntegerValue', true);
                    }

                    return;
                };

                var validate = function(amt) {
                    if (isNaN(getInt(amt))) {
                        return false;
                    } else {
                        return true;
                    }
                };

                var getInt = function(val) {
                    return parseInt((val + "").replace(/,/g, ""));
                };
            }
        };
    }]);

    app.directive("requiredAny", function() {
        var groups = {};

        function determineIfRequired(groupName) {
            var group = groups[groupName];
            if (!group) return false;

            var keys = Object.keys(group);
            return keys.every(function(key) {
                return (key === 'isRequired') || !group[key];
            });
        }

        return {
            restrict: 'A',
            require: '?ngModel',
            scope: {},
            link: function postLink(scope, elem, attrs, modelCtrl) {
                if (!modelCtrl || !attrs.requiredAny) return;

                var groupName = attrs.requiredAny;
                if (groups[groupName] === undefined) {
                    groups[groupName] = { isRequired: true };
                }
                var group = scope.group = groups[groupName];

                scope.$on('$destroy', function() {
                    delete(group[scope.$id]);
                    if (Object.keys(group).length <= 1) {
                        delete(groups[groupName]);
                    }
                });

                function updateValidity() {
                    if (group.isRequired) {
                        modelCtrl.$setValidity('required', false);
                    } else {
                        modelCtrl.$setValidity('required', true);
                    }
                }

                function validate(value) {
                    group[scope.$id] = !modelCtrl.$isEmpty(value);
                    group.isRequired = determineIfRequired(groupName);
                    updateValidity();
                    return value;
                };

                modelCtrl.$formatters.push(validate);
                modelCtrl.$parsers.push(validate);
                scope.$watch('group.isRequired', updateValidity);
            }
        };
    });

    app.directive('changeOnBlur', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            priority: 1,
            link: function(scope, elm, attrs, ngModelCtrl) {
                if (attrs.type === 'radio' || attrs.type === 'checkbox')
                    return;

                var expressionToCall = attrs.changeOnBlur;

                var oldValue = null;
                elm.bind('focus', function() {
                    oldValue = elm.val();
                })
                elm.bind('blur', function() {
                    scope.$apply(function() {
                        var newValue = elm.val();
                        if (newValue !== oldValue) {
                            scope.$eval(expressionToCall);
                        }
                    });
                });
            }
        };
    });

    app.directive("whenScrolled", function() {
        return function(scope, elm, attr) {
            var raw = elm[0];
            elm.bind('scroll', function() {
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                    scope.$apply(attr.whenScrolled);
                }
            });
        };
    });

    app.directive('lightSlider', function() {
        return {
            restrict: 'A',
            link: function(scope, elm, attrs, ngModelCtrl) {

                var element = elm[0];

                $(element).lightSlider({
                    item: 1,
                    gallery: true,
                    currentPagerPosition: 'middle',
                    enableDrag: true,
                    freeMove: true,
                    autoWidth: true,
                    slideMove: 1,
                    slideMargin: 0,
                    mode: "slide",
                    useCSS: true,
                    cssEasing: 'ease',
                    easing: 'linear',
                    slideEndAnimation: true,
                    controls: true,
                    adaptiveHeight: false,
                    verticalHeight: 500,
                    enableTouch: true,
                    pauseOnHover: true,
                    slideEndAnimation: true,
                    keyPress: true,
                    addClass: "notify-slider",
                    freeMove: true,
                    galleryMargin: 0,
                    slideWidth: 200,
                    prevHtml: '<span class="slider-controls"><i class="fa fa-chevron-circle-left"></i></span>',
                    nextHtml: '<span class="slider-controls" ><i class="fa fa-chevron-circle-right"></i></span>'
                });
            }
        }
    });

    app.directive("stickyHeader",[ '$timeout',function($timeout){
        return {
            restrict:"A",
            link: function(scope, element, attrs, ngModelCtrl){

                var ele = element[0];

                 $timeout(function () {
                    $(ele).stickyTableHeaders();
                  }, 0);

            }
        }
    }])

    app.directive('passwordCheck', [
        function() {
            return {
                restrict: 'A',
                link: function($scope, $element) {
                    $element.bind("change", function() {
                        var chkState = $element[0].checked;
                        chkState ? $('.passwordtext').attr('type', 'text') : $('.passwordtext').attr('type', 'password')
                    });
                }
            };
        }
    ]);

    app.directive('myFrame',function(){
        return {
            link:function(scope,ele,attrs){
                ele.load(function(){
                   // console.log("frame loaded");
                    scope.$apply(attrs.myFrame);
                });
            }
        };
    });

    app.directive('pdf', function() {
        return {
            restrict: 'E',
            link: function(scope, element, attrs) {
                var url = scope.$eval(attrs.src);
                element.replaceWith('<object type="application/pdf" data="data:application/pdf;base64,' + url + '" width="100%" height="370px"></object>');
            }
        };
    });

    app.directive('changeLayout', function(){

        return {
            restrict: 'A',
            scope: {
                changeLayout: '='
            },

            link: function(scope, element, attr) {

                if(scope.changeLayout === '1') {
                    element.prop('checked', true);
                }

                element.on('change', function(){
                    if(element.is(':checked')) {
                        sessionStorage.setItem('ma-layout-status', 1);
                        scope.$apply(function(){
                            scope.changeLayout = '1';
                        })
                    }
                    else {
                        sessionStorage.setItem('ma-layout-status', 0);
                        scope.$apply(function(){
                            scope.changeLayout = '0';
                        })
                    }
                })
            }
        }
    });

    app.directive('toggleSidebar', function(){

        return {
            restrict: 'A',
            scope: {
                modelLeft: '=',
                modelRight: '='
            },

            link: function(scope, element, attr) {
                element.on('click', function(){

                    if (element.data('target') === 'mainmenu') {
                        if (scope.modelLeft === false) {
                            scope.$apply(function(){
                                scope.modelLeft = true;
                            })
                        }
                        else {
                            scope.$apply(function(){
                                scope.modelLeft = false;
                            })
                        }
                    }

                    if (element.data('target') === 'chat') {
                        if (scope.modelRight === false) {
                            scope.$apply(function(){
                                scope.modelRight = true;
                            })
                        }
                        else {
                            scope.$apply(function(){
                                scope.modelRight = false;
                            })
                        }

                    }
                })
            }
        }
    });

    app.directive('toggleSubmenu', function(){

        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.click(function(){
                    element.next().slideToggle(200);
                    element.parent().toggleClass('toggled');
                });
            }
        }
    });

    app.directive('cOverflow', ['scrollService', function(scrollService){
        return {
            restrict: 'C',
            link: function(scope, element) {

                if (!$('html').hasClass('ismobile')) {
                    scrollService.malihuScroll(element, 'minimal-dark', 'y');
                }
            }
        }
    }])

    app.directive('disableRightClick',function(){
        return{
            restrict:'A',
            link: function(scope,element,attr){
                element.bind('contextmenu',function(e){
                    e.preventDefault();
                })
            }
        }
    })
}).call(this);
