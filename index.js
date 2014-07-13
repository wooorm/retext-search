'use strict';

var stemmer = require('retext-porter-stemmer'),
    doubleMetaphone = require('retext-double-metaphone'),
    visit = require('retext-visit');

exports = module.exports = function () {};

function test(queries, node) {
    var iterator = -1,
        phonetics = node.data.stemmedPhonetics,
        query;

    while (query = queries[++iterator]) {
        if (
            phonetics[0] === query[0] || phonetics[1] === query[0] ||
            phonetics[0] === query[1] || phonetics[1] === query[1]
        ) {
            return true;
        }
    }

    return false;
}

function searchFactory(retext) {
    return function (values) {
        var self = this,
            query = [],
            result = [];

        if (values) {
            values = String(values);
        }

        if (!values || !values.length) {
            return result;
        }

        retext
            .parse(values)
            .visitType(self.WORD_NODE, function (node) {
                query.push(node.data.stemmedPhonetics);
            });

        if (!query.length) {
            throw new TypeError(
                'TypeError: "' + values + '" is not a valid argument ' +
                'for Parent#search()'
            );
        }

        self.visitType(self.WORD_NODE, function (node) {
            if (test(query, node)) {
                result.push(node);
            }
        });

        return result;
    };
}

function flattenParents(matches) {
    var parents = [],
        scores = [],
        parentToScoreMap = [],
        iterator = -1,
        child, parent, index, score;

    while (child = matches[++iterator]) {
        parent = (child.node || child).parent;
        index = parents.indexOf(parent);
        parents[iterator] = parent;

        if (index !== -1) {
            score = scores[parentToScoreMap[index]];
        } else {
            index = scores.length;
            score = scores[index] = {
                'matches' : [],
                'node' : parent
            };
        }

        parentToScoreMap[iterator] = index;
        score.matches.push(child);
    }

    return scores;
}

function searchAll(values) {
    var self = this,
        nodes = self.search(values);

    if (!nodes || !nodes.length) {
        return nodes;
    }

    while (nodes[0].node !== self) {
        nodes = flattenParents(nodes);
    }

    return nodes[0].matches;
}

function attach(retext) {
    var TextOM = retext.parser.TextOM,
        parentPrototype = TextOM.Parent.prototype,
        elementPrototype = TextOM.Element.prototype;

    retext
        .use(doubleMetaphone)
        .use(stemmer)
        .use(visit);

    parentPrototype.search = elementPrototype.search = searchFactory(retext);
    parentPrototype.searchAll = elementPrototype.searchAll = searchAll;
}

exports.attach = attach;
