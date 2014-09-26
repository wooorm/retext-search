# retext-search [![Build Status](https://travis-ci.org/wooorm/retext-search.svg?branch=master)](https://travis-ci.org/wooorm/retext-search) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-search.svg)](https://coveralls.io/r/wooorm/retext-search?branch=master)

Search in a TextOM tree with **[Retext](https://github.com/wooorm/retext)**.

## Installation

NPM:
```sh
$ npm install retext-search
```

Component.js:
```sh
$ component install wooorm/retext-search
```

## Usage

```js
var Retext = require('retext'),
    search = require('retext-search'),
    root;

var root = new Retext()
    .use(search)
    .parse(
        'Clair wants to drink milk after her morning run. ' +
        'Schmidt likes coffee in the morning, when reading a book.' +

        '\n\n' +

        'Ms Clare likes her tea with milk, while sugar is prefered by ' +
        'Mr Smith. ' +
        'Xavier likes rowing in the morning.'
    );

root.search('smit');
/*
 * [
 *   Schmidt, // The WordNode in the second sentence
 *   Smith // The WordNode in the penultimate sentence
 * ]
*/
```

## API
retext-search depends on the following plugins:

- [retext-double-metaphone](https://github.com/wooorm/retext-double-metaphone) — for phonetics;
- [retext-porter-stemmer](https://github.com/wooorm/retext-porter-stemmer) — for stemming;
- [retext-visit](https://github.com/wooorm/retext-visit)

### Parent#search(query)
Searches the parent for query and returns an array containing all `WordNode`s matching the given query.

```js
root.search('test'); // [];
root.search('xavier clair'); // [Clair, Clare, Xavier];
root.search(['milk']); // [milk, milk];
```

### Parent#searchAll(query)
Searches the parent for query for all `WordNode`s matching the given query, returns a tree containing every matched parent.

```js
root.searchAll('test'); // null
root.searchAll('xavier clair');
/* ├─ 0:
 * |  ├─ node: ParagraphNode
 * |  └─ matches:
 * |      └─ 0:
 * |         ├─ node: SentenceNode
 * |         └─ matches:
 * |             └─ 0: WordNode: "Clair"
 * └─ 1:
 *    ├─ node: ParagraphNode
 *    └─ matches:
 *        |─ 0:
 *        |  ├─ node: SentenceNode
 *        |  └─ matches:
 *        |      └─ 0: WordNode: "Clare"
 *        └─ 1:
 *           ├─ node: SentenceNode
 *           └─ matches:
 *               └─ 0: WordNode: "Xavier"
 */


```

## Benchmark

On a MacBook Air.

P.S. the tests might stack-overflow on you—its _that_ fast.

```
             Searching in lipsum for "Lorem"
  4,515 op/s » tiny (1 paragraph, 5 sentences, 30 words, 208 B)
    591 op/s » small (10 paragraphs, 50 sentences, 300 words, 2 kB)
     62 op/s » medium (100 paragraphs, 500 sentences, 3000 words, 21 kB)
      6 op/s » large (1000 paragraphs, 5000 sentences, 30000 words, 208 kB)
```

Note: Run the benchmarks yourself with `npm run benchmark`


## License

  MIT
