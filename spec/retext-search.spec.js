'use strict';

var search, Retext, assert, tree;

search = require('..');
Retext = require('retext');
assert = require('assert');

tree = new Retext()
    .use(search)
    .parse(
        'Clair wants to drink milk after her morning run. ' +
        'Schmidt likes coffee in the morning, when reading a book.' +

        '\n\n' +

        'Ms. Clare likes her tea with milk, while sugar is prefered by ' +
        'Mr. Smith.' +
        'Xavier likes rowing in the morning.'
    );

describe('retext-search()', function () {
    it('should be of type `function`', function () {
        assert(typeof search === 'function');
    });

    it('should export an `attach` method', function () {
        assert(typeof search.attach === 'function');
    });
});

describe('TextOM.Parent#search(values)', function () {
    it('should be of type `function`', function () {
        assert(typeof tree.TextOM.Parent.prototype.search === 'function');
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
        }, 'TypeError: "." is not a valid argument for Parent#search()');

        assert.throws(function () {
            tree.search(':)');
        }, 'TypeError: ":)" is not a valid argument for Parent#search()');
    });

    it('should return an empty array when nothing matches', function () {
        assert(tree.search('test').length === 0);
    });

    it('should return the matched words when given a string', function () {
        var matches = tree.search('Xavier');
        assert(matches[0] === tree.tail.tail.head);
        assert(matches.length === 1);
    });

    it('should return the matched words when given an array', function () {
        var matches = tree.search(['Xavier']);
        assert(matches[0] === tree.tail.tail.head);
        assert(matches.length === 1);
    });

    it('should return the matched words based on phonetics', function () {
        var matches = tree.search('Smit');
        assert(matches[0] === tree.head.tail.head);
        assert(matches[1] === tree.tail.head.tail.prev);
        assert(matches.length === 2);
    });

    it('should return different matched words', function () {
        var matches = tree.search('xavier clair');
        assert(matches[0] === tree.head.head.head);
        assert(matches[1] === tree.tail.head[3]);
        assert(matches[2] === tree.tail.tail.head);
        assert(matches.length === 3);
    });
});

describe('TextOM.Parent#searchAll(values)', function () {
    it('should be of type `function`', function () {
        assert(typeof tree.TextOM.Parent.prototype.searchAll === 'function');
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
        }, 'TypeError: "." is not a valid argument for Parent#search()');

        assert.throws(function () {
            tree.searchAll(':)');
        }, 'TypeError: ":)" is not a valid argument for Parent#search()');
    });

    it('should return an empty array when nothing matches', function () {
        assert(tree.searchAll('test').length === 0);
    });

    it('should return an object containing an array, containing each ' +
        'matched direct child', function () {
            var matches = tree.searchAll('Xavier');
            assert(matches[0].node === tree.tail);
            assert(matches.length === 1);

            matches = tree.tail.tail.searchAll('Xavier');
            assert(matches[0] === tree.tail.tail.head);
            assert(matches.length === 1);
        }
    );

    it('should return the matched words based on phonetics', function () {
        var matches = tree.searchAll('Smit');

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
        var matches = tree.searchAll('xavier clair');

        assert(matches[0].node === tree.head);
        assert(matches[0].matches[0].node === tree.head.head);
        assert(matches[0].matches.length === 1);
        assert(matches[0].matches[0].matches[0] === tree.head.head.head);
        assert(matches[0].matches[0].matches.length === 1);
        assert(matches[1].node === tree.tail);
        assert(matches[1].matches[0].node === tree.tail.head);
        assert(matches[1].matches[1].node === tree.tail.tail);
        assert(matches[1].matches.length === 2);
        assert(matches[1].matches[0].matches[0] === tree.tail.head[3]);
        assert(matches[1].matches[0].matches.length === 1);
        assert(matches[1].matches[1].matches[0] === tree.tail.tail.head);
        assert(matches[1].matches[1].matches.length === 1);
        assert(matches.length === 2);
    });
});
