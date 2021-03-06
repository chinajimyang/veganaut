/* global protractor, describe, describe, beforeEach, it, expect, browser, element, by */
'use strict';

var helpers = require('./helpers');

describe('socialGraph.', function() {
    var ptor;

    // TODO: code duplication with other tests
    beforeEach(function() {
        // Tell backend to reload the fixtures
        helpers.loadFixtures();

        // Go to the app
        helpers.loadApp('/');
        ptor = protractor.getInstance();

        // TODO: not so great to logout before every test
        helpers.logoutIfLoggedIn();
        helpers.login();

        // Go to social graph
        browser.get('/socialGraph');
    });

    it('should render socialGraph with nodes and links.', function() {
        expect(element(by.css('social-graph')).isPresent()).toBe(true);
        expect(element(by.css('social-graph svg')).isPresent()).toBe(true);

        // Check that the graph has the correct elements
        expect(element.all(by.css('social-graph .node.relation-me')).count()).toBe(1, 'me node');
        expect(element.all(by.css('social-graph .node.relation-friend')).count()).toBe(3, 'friend node');
        expect(element.all(by.css('social-graph .node.relation-friendOfFriend')).count()).toBe(1, 'friendOfFriend node');
        expect(element.all(by.css('social-graph .node.type-maybe')).count()).toBe(2, 'maybe node');
        expect(element.all(by.css('social-graph .node.type-baby')).count()).toBe(1, 'baby node');
        expect(element.all(by.css('social-graph .node.type-user')).count()).toBe(2, 'user node');
        expect(element.all(by.css('social-graph .node.type-dummy')).count()).toBe(2, 'dummy node');

        expect(element.all(by.css('social-graph .link')).count()).toBe(4, 'total links');
        expect(element.all(by.css('social-graph .link.has-completed-activities')).count()).toBe(2, 'completed links');
        // TODO: describe other link types
    });

    it('nodes should have teams.', function() {
        // Check that the graph has the correct elements
        expect(element(by.css('social-graph .node.team-team1')).isPresent()).toBe(true);
        expect(element(by.css('social-graph .node.team-team2')).isPresent()).toBe(true);
    });

    describe('createActivity link form.', function() {
        var someDummy;
        var inviteButton;
        beforeEach(function() {
            var dummies = element.all(by.css('social-graph .node.type-dummy'));
            expect(dummies.count()).toBeGreaterThan(0, 'should have at least one dummy');
            someDummy = dummies.first();
            inviteButton = element(by.css('button.add-activity'));
        });

        it('should deselect node when clicking dummy node twice.', function() {
            ptor.sleep(helpers.GRAPH_DELAY);
            someDummy.click();
            expect(ptor.getCurrentUrl()).toMatch(/\/socialGraph/);
            expect(element.all(by.css('social-graph .node.selected')).count()).toBe(1, 'Dummy Node should be selected');

            someDummy.click();
            expect(element.all(by.css('social-graph .node.selected')).count()).toBe(0, 'Dummy Node should be deselected');
            expect(ptor.getCurrentUrl()).toMatch(/\/socialGraph/,'We should now still be on SocialGraph Page');
        });

        it('should go to /createActivity when selecting dummy node and click invite.', function() {
            // On the first click, stay on socialGraph
            ptor.sleep(helpers.GRAPH_DELAY);
            someDummy.click();
            expect(ptor.getCurrentUrl()).toMatch(/\/socialGraph/);

            expect(element.all(by.css('social-graph .node.selected')).count()).toBe(1,'Dummy Node should be selected');
            // On the click addActivity Button, go to createActivity
            inviteButton.click();
            expect(ptor.getCurrentUrl()).toMatch(/\/createActivity/, 'We should now be on Activity Page');
        });

        it('should be possible to add a new activity link with a dummy node.', function() {
            // Verify the number of nodes before adding new activity link
            ptor.sleep(helpers.GRAPH_DELAY);
            expect(element.all(by.css('social-graph .node')).count()).toBe(7, 'total nodes');
            expect(element.all(by.css('social-graph .node.type-maybe')).count()).toBe(2, 'maybe nodes');

            // Browse to the activity link form
            someDummy.click();
            // On the click addActivity Button, go to createActivity
            inviteButton.click();

            helpers.selectOption(ptor, by.model('form.selectedActivity'), 'Buy something vegan for ...');
            element(by.model('form.targetName')).sendKeys('Hans\n');

            // Should have a success message
            expect(element.all(by.css('.alert-success')).count()).toBe(1,
                'should have a success message, NOTE: this might fail if your browser window was hidden because of the dropdown selection'
            );

            // Check that the social graph has one more node than before
            browser.get('/socialGraph');
            expect(element.all(by.css('social-graph .node')).count()).toBe(8, 'total nodes after');
            expect(element.all(by.css('social-graph .node.type-maybe')).count()).toBe(3, 'maybe nodes after');

            // Should show the new open activity link
            browser.get('/activities');
            expect(element(by.css('.reference-code-list')).getText()).toContain('Hans');
        });
    });

    describe('list of open activity links.', function() {
        beforeEach(function() {
            browser.get('/activities');
        });

        it('shows the list of open activities when browsing to /activities.', function() {
            expect(ptor.getCurrentUrl()).toMatch(/\/activities/);

            expect(element.all(by.css('.reference-code-list li')).count()).toBeGreaterThan(0);

            // Should have the reference code that is unused
            expect(element(by.css('.reference-code-list')).getText()).toContain('OiWCrB');
        });
    });
    // TODO: describe the /createActivity form more
});
