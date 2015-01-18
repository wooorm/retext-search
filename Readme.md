# retext-search [![Build Status](https://img.shields.io/travis/wooorm/retext-search.svg?style=flat)](https://travis-ci.org/wooorm/retext-search) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-search.svg?style=flat)](https://coveralls.io/r/wooorm/retext-search?branch=master)

Search in a document with **[Retext](https://github.com/wooorm/retext)**.

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
$ npm install retext-search
```

[Component.js](https://github.com/componentjs/component):

```bash
$ component install wooorm/retext-search
```

[Bower](http://bower.io/#install-packages):

```bash
$ bower install retext-search
```

[Duo](http://duojs.org/#getting-started):

```javascript
var search = require('wooorm/retext-search');
```

## Usage

```javascript
var Retext = require('retext');
var search = require('retext-search');
var inspect = require('retext-inspect');

var retext = new Retext()
    .use(inspect)
    .use(search);

retext.parse(
    'Clair wants to drink milk after her morning run. ' +
    'Schmidt likes coffee in the morning, when reading a book.' +

    '\n\n' +

    'Ms Clare likes her tea with milk, while sugar is prefered by ' +
    'Mr Smith. ' +
    'Xavier likes rowing in the morning.',
    function (err, tree) {
        console.log(tree.search('smit'));
        /*
         * [
         *   // The `WordNode` in the second sentence:
         *   WordNode[1]
         *   └─ TextNode: 'Schmidt',
         *
         *   // The `WordNode` in the penultimate sentence
         *   WordNode[1]
         *   └─ TextNode: 'Smith'
         * ]
         */
    }
);
```

## API

### [TextOM.Parent](https://github.com/wooorm/textom#textomparent-nlcstparent)#search(query)

Search the operated on context for `query`.

Parameters:

- `query` (`string|array`): sentence containing words to search for.

Returns: an array of [`WordNode`](https://github.com/wooorm/textom#textomwordnode-nlcstwordnode)s.

```javascript
tree.search('test');
// []

tree.search('xavier clair');
/*
 * [
 *   WordNode[1]
 *   └─ TextNode: 'Clair',
 *   WordNode[1]
 *   └─ TextNode: 'Clare',
 *   WordNode[1]
 *   └─ TextNode: 'Xavier'
 * ]
 */

tree.search(['milk']);
/*
 * [
 *   WordNode[1]
 *   └─ TextNode: 'milk',
 *   WordNode[1]
 *   └─ TextNode: 'milk'
 * ]
 */
```

### [TextOM.Parent](https://github.com/wooorm/textom#textomparent-nlcstparent)#searchAll(query)

Search the operated on context for `query`. Useful for ranking sentences or paragraphs.

Parameters:

- `query` (`string|array`): sentence containing words to search for.

Returns: an array of match objects. A match object contains a `node` property, and a `matches` array (containing match objects).

```javascript
tree.searchAll('test'); // null
tree.searchAll('xavier clair');
/*
 * Array
 * ├─ 0:
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

On a MacBook Air:

```text
             A section (10 paragraphs, 50 sentences, 300 words)
  4,560 op/s » Searching in lipsum for "Lorem"
  5,044 op/s » Searching parents in lipsum for "Lorem"

             An article (100 paragraphs, 500 sentences, 3,000 words)
    858 op/s » Searching in lipsum for "Lorem"
    823 op/s » Searching parents in lipsum for "Lorem"

             A book (1,000 paragraphs, 5,000 sentences, 30,000 words)
     88 op/s » Searching in lipsum for "Lorem"
     65 op/s » Searching parents in lipsum for "Lorem"
```

## License

MIT © [Titus Wormer](http://wooorm.com)
