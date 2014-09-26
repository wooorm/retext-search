# retext-search [![Build Status](https://travis-ci.org/wooorm/retext-search.svg?branch=master)](https://travis-ci.org/wooorm/retext-search) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-search.svg)](https://coveralls.io/r/wooorm/retext-search?branch=master)

Search in a TextOM tree with **[Retext](https://github.com/wooorm/retext)**.

## Installation

npm:
```sh
$ npm install retext-search
```

Component:
```sh
$ component install wooorm/retext-search
```

Bower:
```sh
$ bower install retext-search
```

## Usage

```js
var Retext = require('retext'),
    search = require('retext-search'),
    retext;

retext = new Retext().use(search);

retext.parse(
    'Clair wants to drink milk after her morning run. ' +
    'Schmidt likes coffee in the morning, when reading a book.' +

    '\n\n' +

    'Ms Clare likes her tea with milk, while sugar is prefered by ' +
    'Mr Smith. ' +
    'Xavier likes rowing in the morning.',
    function (err, tree) {
        tree.search('smit');
        /**
         * [
         *   Schmidt, // The `WordNode` in the second sentence
         *   Smith // The `WordNode` in the penultimate sentence
         * ]
         */
    }
);
```

## API

### Parent#search(query)

Searches the node for query and returns an array containing all `WordNode`s matching the given query.

```js
tree.search('test'); // [];
tree.search('xavier clair'); // [Clair, Clare, Xavier];
tree.search(['milk']); // [milk, milk];
```

### Parent#searchAll(query)

Searches the node for all `WordNode`s matching the given query, returns a tree containing every matched parent.

```js
tree.searchAll('test'); // null
tree.searchAll('xavier clair');
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

Run the benchmarks yourself with `npm run benchmark`

```
             A section (10 paragraphs, 50 sentences, 300 words)
  4,395 op/s » Searching in lipsum for "Lorem"
  4,423 op/s » Searching parents in lipsum for "Lorem"

             An article (100 paragraphs, 500 sentences, 3,000 words)
    530 op/s » Searching in lipsum for "Lorem"
    531 op/s » Searching parents in lipsum for "Lorem"

             A book (1,000 paragraphs, 5,000 sentences, 30,000 words)
     63 op/s » Searching in lipsum for "Lorem"
     34 op/s » Searching parents in lipsum for "Lorem"
```

## License

MIT © Titus Wormer
