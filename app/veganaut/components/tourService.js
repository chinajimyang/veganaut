(function(module) {
    'use strict';

    // TODO: docu
    module.provider('tourService', function() {
        var TOUR_CONFIG = {
            introBeta: [
                {},
                {},
                {},
                {
                    element: '.front-register-btn',
                    placement: 'bottom'
                }
            ],
            mapUser: [
                {},
                {},
                {},
                {},
                {
                    element: '.menu-button',
                    placement: 'bottom'
                }
            ],
            locationUser: [
                {
                    element: '.location-missions',
                    placement: 'top'
                }
            ]
        };

        this.$get = ['$translate', 'Tour', function($translate, Tour) {
            var tours = {};

            // Create all the tours
            for (var tourName in TOUR_CONFIG) {
                if (TOUR_CONFIG.hasOwnProperty(tourName)) {
                    var steps = angular.copy(TOUR_CONFIG[tourName]);

                    // Add the title and content to the steps
                    for (var i = 0; i < steps.length; i++) {
                        steps[i].title = $translate.instant('tour.' + tourName + '.' + i + '.title');
                        steps[i].content = $translate.instant('tour.' + tourName + '.' + i + '.content');
                    }

                    // Instantiate the tour
                    tours[tourName] = new Tour({
                        name: tourName,
                        orphan: true,
                        steps: steps
                    });
                }
            }

            return {
                startTour: function(tourName) {
                    if (tours.hasOwnProperty(tourName)) {
                        // Initialise and start the tour
                        tours[tourName].init();
                        tours[tourName].start();
                    }
                }
            };
        }];
    });
})(window.veganaut.mainModule);
