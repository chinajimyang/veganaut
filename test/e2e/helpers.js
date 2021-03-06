/* global by, element, browser */
'use strict';

/**
 * Selectors for commonly used elements
 * @type {{}}
 */
var elements = {
    menuButton: element(by.css('button.menu-button')),
    logoutButton: element(by.css('button.nav-logout'))
};

var helpers = {
    GRAPH_DELAY: 800,

    /**
     * Helper for selecting an item in a drop down by text
     * Taken from https://coderwall.com/p/tjx5zg
     * @param ptor Reference to the protractor instance
     * @param selector
     * @param item
     */
    selectOption: function(ptor, selector, item) {
        var selectList, desiredOption;

        selectList = ptor.findElement(selector);
        selectList.click();

        selectList.findElements(by.tagName('option'))
            .then(function findMatchingOption(options) {
                options.some(function(option) {
                    option.getText().then(function(text) {
                        if (item === text) {
                            desiredOption = option;
                            return true;
                        }
                    });
                });
            })
            .then(function() {
                if (desiredOption) {
                    desiredOption.click();
                }
            })
        ;
    },

    /**
     * Adds style rules for easier testing
     */
    loadTestStylesheet: function() {
        // Add style rule to have all transitions have no duration
        browser.executeScript('document.styleSheets[0].insertRule("* { transition-duration: initial !important; }", 1);');
    },

    /**
     * Loads the app at the given initial URL
     * @param {string} [initialUrl='/']
     */
    loadApp: function(initialUrl) {
        // Go to the app
        initialUrl = initialUrl || '/';
        browser.get(initialUrl);
        helpers.loadTestStylesheet();
    },

    /**
     * Logs into the app
     * @param {string} [email='foo@bar.baz']
     * @param {string} [password='foobar']
     */
    login: function(email, password) {
        email = email || 'foo@bar.baz';
        password = password || 'foobar';
        browser.get('/login');
        element(by.model('form.email')).sendKeys(email);
        element(by.model('form.password')).sendKeys(password + '\n');

        // Login doesn't always work if we don't wait a tiny bit...
        browser.sleep(1);

        // TODO: not sure why this has to be loaded again, but otherwise it doesn't work everywhere
        helpers.loadTestStylesheet();
    },

    /**
     * Checks if we are logged in and if yes logs out
     */
    logoutIfLoggedIn: function() {
        elements.logoutButton.isPresent().then(function(isPresent) {
            if (isPresent) {
                helpers.openMenu();
                elements.logoutButton.click();
            }
        });
    },

    /**
     * Opens the main menu
     */
    openMenu: function() {
        // Make sure the stylesheet is loaded to disable animations
        helpers.loadTestStylesheet();
        elements.menuButton.click();
    },

    /**
     * Adds an entry to local storage to make the map
     * load zoomed in on Bern
     */
    setMapCenter: function() {
        browser.executeScript('localStorage.setItem(\'veganautMapCenter\', \'{"lat":46.945,"lng":7.449,"zoom":13}\')');
    },

    /**
     * Tells the backend to load the given fixtures
     * @param {string} [fixtureName='basic']
     */
    loadFixtures: function(fixtureName) {
        // TODO: this completely reloads the angular app before every test, takes forever
        fixtureName = fixtureName || 'basic';
        browser.get('/e2eBridge#/' + fixtureName);
    },

    /**
     * Exposes commonly used elements on the page
     */
    elements: elements
};

// Protractor runs in Node, so use module syntax to export functionality
module.exports = helpers;
