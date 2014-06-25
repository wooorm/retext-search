'use strict';

var Retext, retext, search, source,
    sourceTiny, sourceSmall, sourceMedium, sourceLarge,
    tiny, small, medium, large;

Retext = require('retext');
search = require('..');

source = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ' +
    'ac ultricies diam, quis vehicula mauris. Vivamus accumsan eleifend ' +
    'quam et varius. Etiam congue id magna eu fermentum. Aliquam mollis ' +
    'adipiscing.\n\n';

/* Test data */
sourceTiny = Array(11).join(source);
sourceSmall = Array(11).join(sourceTiny);
sourceMedium = Array(11).join(sourceSmall);
sourceLarge = Array(11).join(sourceMedium);

retext = new Retext().use(search);

tiny = retext.parse(tiny);
small = retext.parse(small);
medium = retext.parse(medium);
large = retext.parse(large);

/* Benchmarks */
suite('Searching in lipsum for "Lorem", "etiam", and "ferment"', function () {
    set('mintime', 100);

    bench('tiny (1 paragraph, 5 sentences, 30 words, 208 B)',
        function (done) {
            tiny.search('lorem etiam ferment');
            done();
        }
    );

    bench('small (10 paragraphs, 50 sentences, 300 words, 2 kB)',
        function (done) {
            small.search('lorem etiam ferment');
            done();
        }
    );

    bench('medium (100 paragraphs, 500 sentences, 3000 words, 21 kB)',
        function (done) {
            medium.search('lorem etiam ferment');
            done();
        }
    );

    bench('large (1000 paragraphs, 5000 sentences, 30000 words, 208 kB)',
        function (done) {
            large.search('lorem etiam ferment');
            done();
        }
    );
});
