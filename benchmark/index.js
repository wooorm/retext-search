'use strict';

/**
 * Dependencies.
 */

var search,
    Retext;

search = require('..');
Retext = require('retext');

/**
 * Fixtures.
 */

var tiny,
    small,
    medium,
    large;

tiny = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ' +
    'ac ultricies diam, quis vehicula mauris. Vivamus accumsan eleifend ' +
    'quam et varius. Etiam congue id magna eu fermentum. Aliquam mollis ' +
    'adipiscing.\n\n';

small = Array(11).join(tiny);
medium = Array(11).join(small);
large = Array(11).join(medium);

/**
 * Retext.
 */

var retext;

retext = new Retext().use(search);

/**
 * Benchmarks.
 */

suite('A section (10 paragraphs, 50 sentences, 300 words)', function () {
    var tree;

    before(function (next) {
        retext.parse(small, function (err, node) {
            if (err) {
                throw err;
            }

            tree = node;
            next();
        });
    });

    bench('Searching in lipsum for "Lorem"', function () {
        tree.search('lorem');
    });

    bench('Searching parents in lipsum for "Lorem"', function () {
        tree.searchAll('lorem');
    });
});

suite('An article (100 paragraphs, 500 sentences, 3,000 words)', function () {
    var tree;

    before(function (next) {
        retext.parse(medium, function (err, node) {
            if (err) {
                throw err;
            }

            tree = node;
            next();
        });
    });

    bench('Searching in lipsum for "Lorem"', function () {
        tree.search('lorem');
    });

    bench('Searching parents in lipsum for "Lorem"', function () {
        tree.searchAll('lorem');
    });
});

suite('A book (1,000 paragraphs, 5,000 sentences, 30,000 words)',
    function () {
        var tree;

        before(function (next) {
            retext.parse(large, function (err, node) {
                if (err) {
                    throw err;
                }

                tree = node;
                next();
            });
        });

        bench('Searching in lipsum for "Lorem"', function () {
            tree.search('lorem');
        });

        bench('Searching parents in lipsum for "Lorem"', function () {
            tree.searchAll('lorem');
        });
    }
);
