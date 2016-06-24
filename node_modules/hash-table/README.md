# hash-table

_Stability: 1 - [Experimental](https://github.com/tristanls/stability-index#stability-1---experimental)_

Hash table.

## Installation

    npm install hash-table

## Tests

    npm test

## Usage

```javascript
var HashTable = require('hash-table');

var hashTable = new HashTable();
hashTable.insert(73, 'foo');
hashTable.search(73); // -> 'foo'
hashTable.delete(73);
hashTable.search(73); // -> undefined
```

## Documentation

### HashTable

A JavaScript implementation of a hash table using an array, integer keys, and open addressing with linear probing.

#### new HashTable(options)

  * `options`:
    * `numberOfHashSlots`: _Integer_ An optional size of slots to use in the table (Default: 13)
    * `prime`: _Integer_ A prime number that is greater than maximum key value that will be entered (Default: Math.pow(2,52) - 47; see: http://primes.utm.edu/lists/2small/0bit.html)

Creates a new HashTable.

#### hashTable.delete(key);

  * `key`: _Integer_ key to delete

Deletes the specified key and data.

#### hashTable.insert(key, data);

  * `key`: _Integer_ key
  * `data`: _Any_ satellite data to insert, cannot be `null` or `undefined`

Inserts the specified key and data. Throws an assertion error if `data` is `null` or `undefined`.

#### hashTable.search(key);

  * `key`: _Integer_ key to search for

Searches and returns the data stored at specified key, `undefined` if not found.