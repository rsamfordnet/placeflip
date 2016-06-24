/*

test.js - hash table test

The MIT License (MIT)

Copyright (c) 2013 Tristan Slominski

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/

"use strict";

var HashTable = require('./index.js');

var test = module.exports = {};

test['inserting, retrieving, and deleting works'] = function (test) {
    test.expect(2);
    var hashTable = new HashTable();
    hashTable.insert(73, 'foo');
    test.equal(hashTable.search(73), 'foo');
    hashTable.delete(73);
    test.deepEqual(hashTable.search(73), undefined);
    test.done();
};

test['inserting once hash table is full results in an error'] = function (test) {
    test.expect(1);
    var hashTable = new HashTable({numberOfHashSlots: 3});
    hashTable.insert(1,'foo');
    hashTable.insert(2,'bar');
    hashTable.insert(3,'baz');
    test.throws(function () {
        hashTable.insert(4,'boom');
    });
    test.done();
};

test['searching for key on full hash table returns correct one'] = function (test) {
    test.expect(1);
    var hashTable = new HashTable({numberOfHashSlots: 2});
    hashTable.insert(1, 'foo');
    hashTable.insert(2, 'bar');
    test.equal(hashTable.search(2), 'bar');
    test.done();
};

test['inserting two values on same key overrides previous value'] = function (test) {
    test.expect(1);
    var hashTable = new HashTable({numberOfHashSlots: 2});
    hashTable.insert(1, 'foo');
    hashTable.insert(2, 'bar');
    hashTable.insert(1, 'baz');
    test.equal(hashTable.search(1), 'baz');
    test.done();
};

test['inserting deleted data stores the data'] = function (test) {
    test.expect(3);
    var hashTable = new HashTable();
    hashTable.insert(1, 'foo');
    test.equal(hashTable.search(1), 'foo');
    hashTable.delete(1);
    test.deepEqual(hashTable.search(1), undefined);
    hashTable.insert(1, 'bar');
    test.equal(hashTable.search(1), 'bar');
    test.done();
};

test['linear probing overrides deleted keys'] = function (test) {
    test.expect(5);
    var hashTable = new HashTable({numberOfHashSlots: 1});
    hashTable.insert(1, 'foo');
    test.equal(hashTable.search(1), 'foo');
    hashTable.delete(1);
    test.deepEqual(hashTable.search(1), undefined);
    hashTable.insert(2, 'bar');
    test.equal(hashTable.search(2), 'bar');
    hashTable.delete(2);
    test.deepEqual(hashTable.search(2),undefined);
    hashTable.insert(3, 'baz');
    test.equal(hashTable.search(3), 'baz');
    test.done();
};