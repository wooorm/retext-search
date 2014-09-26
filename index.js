'use strict';

/**
 * Dependencies.
 */

var stemmer,
    doubleMetaphone,
    visit,
    content;

stemmer = require('retext-porter-stemmer');
doubleMetaphone = require('retext-double-metaphone');
visit = require('retext-visit');
content = require('retext-content');

/**
 * Test if `node` matches a query.
 *
 * @param {Array.<{0: string, 1: string}>} - queries
 * @param {WordNode} node
 * @return {boolean}
 */

function test(queries, node) {
    var index,
        phonetics,
        query;

    index = queries.length;
    phonetics = node.data.stemmedPhonetics;

    while (index--) {
        query = queries[index];

        if (
            phonetics[0] === query[0] ||
            phonetics[1] === query[0] ||
            phonetics[0] === query[1] ||
            phonetics[1] === query[1]
        ) {
            return true;
        }
    }

    return false;
}

/**
 * Find words in `node` matching `values`.
 *
 * @param {string} values
 * @this {Parent}
 * @return {Array.<WordNode>}
 */

function search(values) {
    var self,
        words,
        query,
        result;

    self = this;

    result = [];

    if (values) {
        values = String(values);
    }

    if (!values || !values.length) {
        return result;
    }

    query = [];

    /**
     * Get the stems from the query.
     */

    words = new self.TextOM.SentenceNode();
    words.replaceContent(values);

    words.visitType(self.WORD_NODE, function (node) {
        query.push(node.data.stemmedPhonetics);
    });

    if (!query.length) {
        throw new TypeError(
            'TypeError: `' + values + '` is not a valid argument ' +
            'for Parent#search(values)'
        );
    }

    /**
     * Find the query in `self`.
     */

    self.visitType(self.WORD_NODE, function (node) {
        if (test(query, node)) {
            result.push(node);
        }
    });

    return result;
}

/**
 * Find the parents belonging to the nodes in
 * `matches`.
 *
 * @param {Array.<Node>} matches
 * @return {Object.<{matches: Array.<Node>, node: Parent}>}
 */

function flattenParents(matches) {
    var parents,
        scores,
        parentToScoreMap,
        index,
        length,
        child,
        parent,
        position,
        score;

    parents = [];
    scores = [];
    parentToScoreMap = [];

    index = -1;
    length = matches.length;

    while (++index < length) {
        child = matches[index];

        parent = (child.node || child).parent;

        position = parents.indexOf(parent);

        parents[index] = parent;

        if (position === -1) {
            position = scores.length;

            score = scores[position] = {
                'matches' : [],
                'node' : parent
            };
        } else {
            score = scores[parentToScoreMap[position]];
        }

        parentToScoreMap[index] = position;

        score.matches.push(child);
    }

    return scores;
}

/**
 * Find parents in `node` matching `values`.
 *
 * @param {string} values
 * @this {Parent}
 * @return {Array.<{node: Node, matches: Array}>}
 */

function searchAll(values) {
    var self,
        nodes;

    self = this;
    nodes = self.search(values);

    if (!nodes || !nodes.length) {
        return nodes;
    }

    /**
     * Keep op flattening the results object until
     * self is reached.
     */

    while (nodes[0].node !== self) {
        nodes = flattenParents(nodes);
    }

    /**
     * Return the matches of `self`.
     */

    return nodes[0].matches;
}

/**
 * Define `retextSearch`.
 */

function retextSearch() {}

/**
 * Define `attach`.
 */

function attach(retext) {
    var TextOM,
        parentPrototype,
        elementPrototype;

    TextOM = retext.TextOM;
    parentPrototype = TextOM.Parent.prototype;
    elementPrototype = TextOM.Element.prototype;

    retext
        .use(doubleMetaphone)
        .use(content)
        .use(stemmer)
        .use(visit);

    parentPrototype.search = elementPrototype.search = search;
    parentPrototype.searchAll = elementPrototype.searchAll = searchAll;
}

/**
 * Expose `attach`.
 */

retextSearch.attach = attach;

/**
 * Expose `retextSearch`.
 */

module.exports = retextSearch;
