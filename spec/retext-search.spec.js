'use strict';

/**
 * Dependencies.
 */

var search,
    Retext,
    assert;

search = require('..');
Retext = require('retext');
assert = require('assert');

/**
 * Fixtures.
 */

var value;

value =
    'Clair wants to drink milk after her morning run. ' +
    'Schmidt likes coffee in the morning, when reading a book.\n' +
    '\n' +
    'Ms Clare likes her tea with milk, while sugar is prefered by ' +
    'Mr Smith. ' +
    'Xavier likes rowing in the morning.';

/**
 * Retext.
 */

var retext,
    TextOM;

retext = new Retext().use(search);

TextOM = retext.TextOM;

/**
 * Tests.
 */

describe('retext-search()', function () {
    it('should be a `function`', function () {
        assert(typeof search === 'function');
    });

    it('should export an `attach` method', function () {
        assert(typeof search.attach === 'function');
    });
});

describe('Parent#search(values)', function () {
    var tree;

    before(function (done) {
        retext.parse(value, function (err, node) {
            tree = node;

            done(err);
        });
    });

    it('should be a `function`', function () {
        assert(typeof TextOM.Parent.prototype.search === 'function');
    });

    it('should return an empty array when a falsey input is given',
        function () {
            assert(tree.search().length === 0);
            assert(tree.search([]).length === 0);
            assert(tree.search(null).length === 0);
        }
    );

    it('should throw when a valid input without words is given', function () {
        assert.throws(function () {
            tree.search('.');
        }, /`\.`/);

        assert.throws(function () {
            tree.search(':)');
        }, /`\:\)`/);
    });

    it('should return an empty array when nothing matches', function () {
        assert(tree.search('test').length === 0);
    });

    it('should return the matched words when given a string', function () {
        var matches;

        matches = tree.search('Xavier');

        assert(matches[0] === tree.tail.tail.head);
        assert(matches.length === 1);
    });

    it('should return the matched words when given an array', function () {
        var matches;

        matches = tree.search(['Xavier']);

        assert(matches[0] === tree.tail.tail.head);
        assert(matches.length === 1);
    });

    it('should return the matched words based on phonetics', function () {
        var matches;

        matches = tree.search('Smit');

        assert(matches[0] === tree.head.tail.head);
        assert(matches[1] === tree.tail.head.tail.prev);
        assert(matches.length === 2);
    });

    it('should return different matched words', function () {
        var matches;

        matches = tree.search('xavier clair');

        assert(matches[0] === tree.head.head.head);
        assert(matches[1] === tree.tail.head[2]);
        assert(matches[2] === tree.tail.tail.head);
        assert(matches.length === 3);
    });
});

describe('Parent#searchAll(values)', function () {
    var tree;

    before(function (done) {
        retext.parse(value, function (err, node) {
            tree = node;

            done(err);
        });
    });

    it('should be a `function`', function () {
        assert(typeof TextOM.Parent.prototype.searchAll === 'function');
    });

    it('should return an empty array when a falsey input is given',
        function () {
            assert(tree.searchAll().length === 0);
            assert(tree.searchAll([]).length === 0);
            assert(tree.searchAll(null).length === 0);
        }
    );

    it('should throw when a valid input without words is given', function () {
        assert.throws(function () {
            tree.searchAll('.');
        }, /`\.`/);

        assert.throws(function () {
            tree.searchAll(':)');
        }, /`\:\)`/);
    });

    it('should return an empty array when nothing matches', function () {
        assert(tree.searchAll('test').length === 0);
    });

    it('should return an object containing an array, containing each ' +
        'matched direct child', function () {
            var matches;

            matches = tree.searchAll('Xavier');

            assert(matches[0].node === tree.tail);
            assert(matches.length === 1);

            matches = tree.tail.tail.searchAll('Xavier');

            assert(matches[0] === tree.tail.tail.head);
            assert(matches.length === 1);
        }
    );

    it('should return the matched words based on phonetics', function () {
        var matches;

        matches = tree.searchAll('Smit');

        assert(matches[0].node === tree.head);
        assert(matches[0].matches[0].node === tree.head.tail);
        assert(matches[0].matches.length === 1);
        assert(matches[0].matches[0].matches[0] === tree.head.tail.head);
        assert(matches[0].matches[0].matches.length === 1);
        assert(matches[1].node === tree.tail);
        assert(matches[1].matches[0].node === tree.tail.head);
        assert(matches[1].matches.length === 1);
        assert(matches[1].matches[0].matches[0] === tree.tail.head.tail.prev);
        assert(matches[1].matches[0].matches.length === 1);
        assert(matches.length === 2);
    });

    it('should return different matched words', function () {
        var matches;

        matches = tree.searchAll('xavier clair');

        assert(matches[0].node === tree.head);
        assert(matches[0].matches[0].node === tree.head.head);
        assert(matches[0].matches.length === 1);
        assert(matches[0].matches[0].matches[0] === tree.head.head.head);
        assert(matches[0].matches[0].matches.length === 1);
        assert(matches[1].node === tree.tail);
        assert(matches[1].matches[0].node === tree.tail.head);
        assert(matches[1].matches[1].node === tree.tail.tail);
        assert(matches[1].matches.length === 2);
        assert(matches[1].matches[0].matches[0] === tree.tail.head[2]);
        assert(matches[1].matches[0].matches.length === 1);
        assert(matches[1].matches[1].matches[0] === tree.tail.tail.head);
        assert(matches[1].matches[1].matches.length === 1);
        assert(matches.length === 2);
    });
});
