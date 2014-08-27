(function(module) {
    'use strict';

    /**
     * Location Model
     *
     * @param {string} id
     * @param {string} team
     * @param {number} lat
     * @param {number} lng
     * @param {string} title
     * @param {string} type
     * @param {{}} [points={}]
     * @constructor
     */
    var Location = function(id, team, lat, lng, title, type, points) {
        this.id = id;
        this.team = team;
        this.lat = lat;
        this.lng = lng;
        this.title = title;
        this.type = type;
        this.points = points || {};

        this._defaultIconClassList = 'map-location team-' + this.team;

        this.icon = {
            type: 'div',
            iconSize: null, // Needs to be set to null so it can be specified in CSS
            className: this._defaultIconClassList
        };

        this._active = false;
    };

    /**
     * The possible types of locations
     * @type {{gastronomy: string, retail: string, event: string, private: string}}
     */
    Location.TYPES = {
        gastronomy: 'gastronomy',
        retail: 'retail'
    };

    /**
     * Creates a new Location object from the given JSON data
     * @param json
     * @returns {Location}
     */
    Location.fromJson = function(json) {
        return new Location(
            json.id,
            json.team,
            json.coordinates[0],
            json.coordinates[1],
            json.name,
            json.type,
            json.points
        );
    };

    /**
     * Sets the location as active or inactive
     * @param {boolean} [isActive=true]
     */
    Location.prototype.setActive = function(isActive) {
        if (typeof isActive === 'undefined') {
            isActive = true;
        }
        this._active = isActive;

        // Set the correct icon class
        this.icon.className = this._defaultIconClassList;
        if (this._active) {
            this.icon.className += ' active';
        }

    };

    /**
     * Whether the location is active
     * @returns {boolean}
     */
    Location.prototype.isActive = function() {
        return this._active;
    };


    module.value('Location', Location);
})(window.veganaut.mapModule);
