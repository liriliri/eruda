// Built by eustia.
/* eslint-disable */

var _ = {};

/* ------------------------------ last ------------------------------ */

export var last = _.last = (function (exports) {
    /* Get the last element of array.
     *
     * |Name  |Desc                     |
     * |------|-------------------------|
     * |arr   |The array to query       |
     * |return|The last element of array|
     */

    /* example
     * last([1, 2]); // -> 2
     */

    /* typescript
     * export declare function last(arr: any[]): any;
     */
    exports = function(arr) {
        var len = arr ? arr.length : 0;
        if (len) return arr[len - 1];
    };

    return exports;
})({});

/* ------------------------------ isUndef ------------------------------ */

export var isUndef = _.isUndef = (function (exports) {
    /* Check if value is undefined.
     *
     * |Name  |Desc                      |
     * |------|--------------------------|
     * |val   |Value to check            |
     * |return|True if value is undefined|
     */

    /* example
     * isUndef(void 0); // -> true
     * isUndef(null); // -> false
     */

    /* typescript
     * export declare function isUndef(val: any): boolean;
     */
    exports = function(val) {
        return val === void 0;
    };

    return exports;
})({});

/* ------------------------------ isObj ------------------------------ */

export var isObj = _.isObj = (function (exports) {
    /* Check if value is the language type of Object.
     *
     * |Name  |Desc                      |
     * |------|--------------------------|
     * |val   |Value to check            |
     * |return|True if value is an object|
     *
     * [Language Spec](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
     */

    /* example
     * isObj({}); // -> true
     * isObj([]); // -> true
     */

    /* typescript
     * export declare function isObj(val: any): boolean;
     */
    exports = function(val) {
        var type = typeof val;
        return !!val && (type === 'function' || type === 'object');
    };

    return exports;
})({});

/* ------------------------------ has ------------------------------ */

export var has = _.has = (function (exports) {
    /* Checks if key is a direct property.
     *
     * |Name  |Desc                            |
     * |------|--------------------------------|
     * |obj   |Object to query                 |
     * |key   |Path to check                   |
     * |return|True if key is a direct property|
     */

    /* example
     * has({one: 1}, 'one'); // -> true
     */

    /* typescript
     * export declare function has(obj: {}, key: string): boolean;
     */
    var hasOwnProp = Object.prototype.hasOwnProperty;

    exports = function(obj, key) {
        return hasOwnProp.call(obj, key);
    };

    return exports;
})({});

/* ------------------------------ slice ------------------------------ */

export var slice = _.slice = (function (exports) {
    /* Create slice of source array or array-like object.
     *
     * |Name            |Desc                      |
     * |----------------|--------------------------|
     * |array           |Array to slice            |
     * |start=0         |Start position            |
     * |end=array.length|End position, not included|
     */

    /* example
     * slice([1, 2, 3, 4], 1, 2); // -> [2]
     */

    /* typescript
     * export declare function slice(array: any[], start?: number, end?: number): any[];
     */
    exports = function(arr, start, end) {
        var len = arr.length;

        if (start == null) {
            start = 0;
        } else if (start < 0) {
            start = Math.max(len + start, 0);
        } else {
            start = Math.min(start, len);
        }

        if (end == null) {
            end = len;
        } else if (end < 0) {
            end = Math.max(len + end, 0);
        } else {
            end = Math.min(end, len);
        }

        var ret = [];

        while (start < end) {
            ret.push(arr[start++]);
        }

        return ret;
    };

    return exports;
})({});

/* ------------------------------ reverse ------------------------------ */

export var reverse = _.reverse = (function (exports) {
    /* Reverse array without mutating it.
     *
     * |Name  |Desc           |
     * |------|---------------|
     * |arr   |Array to modify|
     * |return|Reversed array |
     */

    /* example
     * reverse([1, 2, 3]); // -> [3, 2, 1]
     */

    /* typescript
     * export declare function reverse(arr: any[]): any[];
     */
    exports = function(arr) {
        var len = arr.length;
        var ret = Array(len);
        len--;

        for (var i = 0; i <= len; i++) {
            ret[len - i] = arr[i];
        }

        return ret;
    };

    return exports;
})({});

/* ------------------------------ isBrowser ------------------------------ */

export var isBrowser = _.isBrowser = (function (exports) {
    /* Check if running in a browser.
     */

    /* example
     * console.log(isBrowser); // -> true if running in a browser
     */

    /* typescript
     * export declare const isBrowser: boolean;
     */
    exports =
        typeof window === 'object' &&
        typeof document === 'object' &&
        document.nodeType === 9;

    return exports;
})({});

/* ------------------------------ noop ------------------------------ */

export var noop = _.noop = (function (exports) {
    /* A no-operation function.
     */

    /* example
     * noop(); // Does nothing
     */

    /* typescript
     * export declare function noop(): void;
     */
    exports = function() {};

    return exports;
})({});

/* ------------------------------ before ------------------------------ */

export var before = _.before = (function (exports) {
    /* Create a function that invokes less than n times.
     *
     * |Name  |Desc                                            |
     * |------|------------------------------------------------|
     * |n     |Number of calls at which fn is no longer invoked|
     * |fn    |Function to restrict                            |
     * |return|New restricted function                         |
     *
     * Subsequent calls to the created function return the result of the last fn invocation.
     */

    /* example
     * const fn = before(5, function() {});
     * fn(); // Allow function to be call 4 times at last.
     */

    /* typescript
     * export declare function before(n: number, fn: Function): Function;
     */
    exports = function(n, fn) {
        var memo;
        return function() {
            if (--n > 0) memo = fn.apply(this, arguments);
            if (n <= 1) fn = null;
            return memo;
        };
    };

    return exports;
})({});

/* ------------------------------ splitCase ------------------------------ */

export var splitCase = _.splitCase = (function (exports) {
    /* Split different string case to an array.
     *
     * |Name  |Desc           |
     * |------|---------------|
     * |str   |String to split|
     * |return|Result array   |
     */

    /* example
     * splitCase('foo-bar'); // -> ['foo', 'bar']
     * splitCase('foo bar'); // -> ['foo', 'bar']
     * splitCase('foo_bar'); // -> ['foo', 'bar']
     * splitCase('foo.bar'); // -> ['foo', 'bar']
     * splitCase('fooBar'); // -> ['foo', 'bar']
     * splitCase('foo-Bar'); // -> ['foo', 'bar']
     */

    /* typescript
     * export declare function splitCase(str: string): string[];
     */
    var regUpperCase = /([A-Z])/g;
    var regSeparator = /[_.\- ]+/g;
    var regTrim = /(^-)|(-$)/g;

    exports = function(str) {
        str = str
            .replace(regUpperCase, '-$1')
            .toLowerCase()
            .replace(regSeparator, '-')
            .replace(regTrim, '');
        return str.split('-');
    };

    return exports;
})({});

/* ------------------------------ camelCase ------------------------------ */

export var camelCase = _.camelCase = (function (exports) {
    /* Convert string to "camelCase".
     *
     * |Name  |Desc              |
     * |------|------------------|
     * |str   |String to convert |
     * |return|Camel cased string|
     */

    /* example
     * camelCase('foo-bar'); // -> fooBar
     * camelCase('foo bar'); // -> fooBar
     * camelCase('foo_bar'); // -> fooBar
     * camelCase('foo.bar'); // -> fooBar
     */

    /* typescript
     * export declare function camelCase(str: string): string;
     */

    /* dependencies
     * splitCase 
     */

    exports = function(str) {
        var arr = splitCase(str);
        var ret = arr[0];
        arr.shift();
        arr.forEach(capitalize, arr);
        ret += arr.join('');
        return ret;
    };

    function capitalize(val, idx) {
        this[idx] = val.replace(/\w/, function(match) {
            return match.toUpperCase();
        });
    }

    return exports;
})({});

/* ------------------------------ kebabCase ------------------------------ */

export var kebabCase = _.kebabCase = (function (exports) {
    /* Convert string to "kebabCase".
     *
     * |Name  |Desc              |
     * |------|------------------|
     * |str   |String to convert |
     * |return|Kebab cased string|
     */

    /* example
     * kebabCase('fooBar'); // -> foo-bar
     * kebabCase('foo bar'); // -> foo-bar
     * kebabCase('foo_bar'); // -> foo-bar
     * kebabCase('foo.bar'); // -> foo-bar
     */

    /* typescript
     * export declare function kebabCase(str: string): string;
     */

    /* dependencies
     * splitCase 
     */

    exports = function(str) {
        return splitCase(str).join('-');
    };

    return exports;
})({});

/* ------------------------------ clamp ------------------------------ */

export var clamp = _.clamp = (function (exports) {
    /* Clamp number within the inclusive lower and upper bounds.
     *
     * |Name  |Desc           |
     * |------|---------------|
     * |n     |Number to clamp|
     * |lower |Lower bound    |
     * |upper |Upper bound    |
     * |return|Clamped number |
     */

    /* example
     * clamp(-10, -5, 5); // -> -5
     * clamp(10, -5, 5); // -> 5
     * clamp(2, -5, 5); // -> 2
     * clamp(10, 5); // -> 5
     * clamp(2, 5); // -> 2
     */

    /* typescript
     * export declare function clamp(n: number, lower: number, upper: number): number;
     * export declare function clamp(n: number, upper: number): number;
     */

    /* dependencies
     * isUndef 
     */

    exports = function(n, lower, upper) {
        if (isUndef(upper)) {
            upper = lower;
            lower = undefined;
        }

        if (!isUndef(lower) && n < lower) return lower;
        if (n > upper) return upper;
        return n;
    };

    return exports;
})({});

/* ------------------------------ idxOf ------------------------------ */

export var idxOf = _.idxOf = (function (exports) {
    /* Get the index at which the first occurrence of value.
     *
     * |Name     |Desc                |
     * |---------|--------------------|
     * |arr      |Array to search     |
     * |val      |Value to search for |
     * |fromIdx=0|Index to search from|
     * |return   |Value index         |
     */

    /* example
     * idxOf([1, 2, 1, 2], 2, 2); // -> 3
     */

    /* typescript
     * export declare function idxOf(arr: any[], val: any, fromIdx?: number): number;
     */
    exports = function(arr, val, fromIdx) {
        return Array.prototype.indexOf.call(arr, val, fromIdx);
    };

    return exports;
})({});

/* ------------------------------ create ------------------------------ */

export var create = _.create = (function (exports) {
    /* Create new object using given object as prototype.
     *
     * |Name  |Desc                   |
     * |------|-----------------------|
     * |proto |Prototype of new object|
     * |return|Created object         |
     */

    /* example
     * const obj = create({ a: 1 });
     * console.log(obj.a); // -> 1
     */

    /* typescript
     * export declare function create(proto?: object): any;
     */

    /* dependencies
     * isObj 
     */

    exports = function(proto) {
        if (!isObj(proto)) return {};
        if (objCreate) return objCreate(proto);

        function noop() {}

        noop.prototype = proto;
        return new noop();
    };

    var objCreate = Object.create;

    return exports;
})({});

/* ------------------------------ inherits ------------------------------ */

export var inherits = _.inherits = (function (exports) {
    /* Inherit the prototype methods from one constructor into another.
     *
     * |Name      |Desc       |
     * |----------|-----------|
     * |Class     |Child Class|
     * |SuperClass|Super Class|
     */

    /* example
     * function People(name) {
     *     this._name = name;
     * }
     * People.prototype = {
     *     getName: function () {
     *         return this._name;
     *     }
     * };
     * function Student(name) {
     *     this._name = name;
     * }
     * inherits(Student, People);
     * const s = new Student('RedHood');
     * s.getName(); // -> 'RedHood'
     */

    /* typescript
     * export declare function inherits(Class: Function, SuperClass: Function): void;
     */

    /* dependencies
     * create 
     */

    exports = function(Class, SuperClass) {
        Class.prototype = create(SuperClass.prototype);
    };

    return exports;
})({});

/* ------------------------------ toStr ------------------------------ */

export var toStr = _.toStr = (function (exports) {
    /* Convert value to a string.
     *
     * |Name  |Desc            |
     * |------|----------------|
     * |val   |Value to convert|
     * |return|Result string   |
     */

    /* example
     * toStr(null); // -> ''
     * toStr(1); // -> '1'
     * toStr(false); // -> 'false'
     * toStr([1, 2, 3]); // -> '1,2,3'
     */

    /* typescript
     * export declare function toStr(val: any): string;
     */
    exports = function(val) {
        return val == null ? '' : val.toString();
    };

    return exports;
})({});

/* ------------------------------ debounce ------------------------------ */

export var debounce = _.debounce = (function (exports) {
    /* Return a new debounced version of the passed function.
     *
     * |Name  |Desc                           |
     * |------|-------------------------------|
     * |fn    |Function to debounce           |
     * |wait  |Number of milliseconds to delay|
     * |return|New debounced function         |
     */

    /* example
     * const calLayout = debounce(function () {}, 300);
     * // $(window).resize(calLayout);
     */

    /* typescript
     * export declare function debounce(fn: Function, wait: number): Function;
     */
    exports = function(fn, wait, immediate) {
        var timeout;
        return function() {
            var ctx = this;
            var args = arguments;

            var throttler = function() {
                timeout = null;
                fn.apply(ctx, args);
            };

            if (!immediate) clearTimeout(timeout);
            if (!immediate || !timeout) timeout = setTimeout(throttler, wait);
        };
    };

    return exports;
})({});

/* ------------------------------ ucs2 ------------------------------ */

export var ucs2 = _.ucs2 = (function (exports) {
    /* UCS-2 encoding and decoding.
     *
     * ### encode
     *
     * Create a string using an array of code point values.
     *
     * |Name  |Desc                |
     * |------|--------------------|
     * |arr   |Array of code points|
     * |return|Encoded string      |
     *
     * ### decode
     *
     * Create an array of code point values using a string.
     *
     * |Name  |Desc                |
     * |------|--------------------|
     * |str   |Input string        |
     * |return|Array of code points|
     */

    /* example
     * ucs2.encode([0x61, 0x62, 0x63]); // -> 'abc'
     * ucs2.decode('abc'); // -> [0x61, 0x62, 0x63]
     * '𝌆'.length; // -> 2
     * ucs2.decode('𝌆').length; // -> 1
     */

    /* typescript
     * export declare const ucs2: {
     *     encode(arr: number[]): string;
     *     decode(str: string): number[];
     * };
     */
    // https://mathiasbynens.be/notes/javascript-encoding
    exports = {
        encode: function(arr) {
            return String.fromCodePoint.apply(String, arr);
        },
        decode: function(str) {
            var ret = [];
            var i = 0;
            var len = str.length;

            while (i < len) {
                var c = str.charCodeAt(i++); // A high surrogate

                if (c >= 0xd800 && c <= 0xdbff && i < len) {
                    var tail = str.charCodeAt(i++); // nextC >= 0xDC00 && nextC <= 0xDFFF

                    if ((tail & 0xfc00) === 0xdc00) {
                        // C = (H - 0xD800) * 0x400 + L - 0xDC00 + 0x10000
                        ret.push(((c & 0x3ff) << 10) + (tail & 0x3ff) + 0x10000);
                    } else {
                        ret.push(c);
                        i--;
                    }
                } else {
                    ret.push(c);
                }
            }

            return ret;
        }
    };

    return exports;
})({});

/* ------------------------------ utf8 ------------------------------ */

export var utf8 = _.utf8 = (function (exports) {
    /* UTF-8 encoding and decoding.
     *
     * ### encode
     *
     * Turn any UTF-8 decoded string into UTF-8 encoded string.
     *
     * |Name  |Desc            |
     * |------|----------------|
     * |str   |String to encode|
     * |return|Encoded string  |
     *
     * ### decode
     *
     * Turn any UTF-8 encoded string into UTF-8 decoded string.
     *
     * |Name      |Desc                  |
     * |----------|----------------------|
     * |str       |String to decode      |
     * |safe=false|Suppress error if true|
     * |return    |Decoded string        |
     */

    /* example
     * utf8.encode('\uD800\uDC00'); // ->  '\xF0\x90\x80\x80'
     * utf8.decode('\xF0\x90\x80\x80'); // -> '\uD800\uDC00'
     */

    /* typescript
     * export declare const utf8: {
     *     encode(str: string): string;
     *     decode(str: string, safe?: boolean): string;
     * };
     */

    /* dependencies
     * ucs2 
     */ // https://encoding.spec.whatwg.org/#utf-8

    exports = {
        encode: function(str) {
            var codePoints = ucs2.decode(str);
            var byteArr = '';

            for (var i = 0, len = codePoints.length; i < len; i++) {
                byteArr += encodeCodePoint(codePoints[i]);
            }

            return byteArr;
        },
        decode: function(str, safe) {
            byteArr = ucs2.decode(str);
            byteIdx = 0;
            byteCount = byteArr.length;
            codePoint = 0;
            bytesSeen = 0;
            bytesNeeded = 0;
            lowerBoundary = 0x80;
            upperBoundary = 0xbf;
            var codePoints = [];
            var tmp;

            while ((tmp = decodeCodePoint(safe)) !== false) {
                codePoints.push(tmp);
            }

            return ucs2.encode(codePoints);
        }
    };
    var fromCharCode = String.fromCharCode;

    function encodeCodePoint(codePoint) {
        // U+0000 to U+0080, ASCII code point
        if ((codePoint & 0xffffff80) === 0) {
            return fromCharCode(codePoint);
        }

        var ret = '',
            count,
            offset; // U+0080 to U+07FF, inclusive

        if ((codePoint & 0xfffff800) === 0) {
            count = 1;
            offset = 0xc0;
        } else if ((codePoint & 0xffff0000) === 0) {
            // U+0800 to U+FFFF, inclusive
            count = 2;
            offset = 0xe0;
        } else if ((codePoint & 0xffe00000) == 0) {
            // U+10000 to U+10FFFF, inclusive
            count = 3;
            offset = 0xf0;
        }

        ret += fromCharCode((codePoint >> (6 * count)) + offset);

        while (count > 0) {
            var tmp = codePoint >> (6 * (count - 1));
            ret += fromCharCode(0x80 | (tmp & 0x3f));
            count--;
        }

        return ret;
    }

    var byteArr,
        byteIdx,
        byteCount,
        codePoint,
        bytesSeen,
        bytesNeeded,
        lowerBoundary,
        upperBoundary;

    function decodeCodePoint(safe) {
        /* eslint-disable no-constant-condition */
        while (true) {
            if (byteIdx >= byteCount && bytesNeeded) {
                if (safe) return goBack();
                throw new Error('Invalid byte index');
            }

            if (byteIdx === byteCount) return false;
            var byte = byteArr[byteIdx];
            byteIdx++;

            if (!bytesNeeded) {
                // 0x00 to 0x7F
                if ((byte & 0x80) === 0) {
                    return byte;
                } // 0xC2 to 0xDF

                if ((byte & 0xe0) === 0xc0) {
                    bytesNeeded = 1;
                    codePoint = byte & 0x1f;
                } else if ((byte & 0xf0) === 0xe0) {
                    // 0xE0 to 0xEF
                    if (byte === 0xe0) lowerBoundary = 0xa0;
                    if (byte === 0xed) upperBoundary = 0x9f;
                    bytesNeeded = 2;
                    codePoint = byte & 0xf;
                } else if ((byte & 0xf8) === 0xf0) {
                    // 0xF0 to 0xF4
                    if (byte === 0xf0) lowerBoundary = 0x90;
                    if (byte === 0xf4) upperBoundary = 0x8f;
                    bytesNeeded = 3;
                    codePoint = byte & 0x7;
                } else {
                    if (safe) return goBack();
                    throw new Error('Invalid UTF-8 detected');
                }

                continue;
            }

            if (byte < lowerBoundary || byte > upperBoundary) {
                if (safe) {
                    byteIdx--;
                    return goBack();
                }

                throw new Error('Invalid continuation byte');
            }

            lowerBoundary = 0x80;
            upperBoundary = 0xbf;
            codePoint = (codePoint << 6) | (byte & 0x3f);
            bytesSeen++;
            if (bytesSeen !== bytesNeeded) continue;
            var tmp = codePoint;
            codePoint = 0;
            bytesNeeded = 0;
            bytesSeen = 0;
            return tmp;
        }
    }

    function goBack() {
        var start = byteIdx - bytesSeen - 1;
        byteIdx = start + 1;
        codePoint = 0;
        bytesNeeded = 0;
        bytesSeen = 0;
        lowerBoundary = 0x80;
        upperBoundary = 0xbf;
        return byteArr[start];
    }

    return exports;
})({});

/* ------------------------------ root ------------------------------ */

export var root = _.root = (function (exports) {
    /* Root object reference, `global` in nodeJs, `window` in browser. */

    /* typescript
     * export declare const root: any;
     */

    /* dependencies
     * isBrowser 
     */

    exports = isBrowser ? window : global;

    return exports;
})({});

/* ------------------------------ detectMocha ------------------------------ */

export var detectMocha = _.detectMocha = (function (exports) {
    /* Detect if mocha is running.
     */

    /* example
     * detectMocha(); // -> True if mocha is running.
     */

    /* typescript
     * export declare function detectMocha(): boolean;
     */

    /* dependencies
     * root 
     */

    exports = function() {
        for (var i = 0, len = methods.length; i < len; i++) {
            var method = methods[i];
            if (typeof root[method] !== 'function') return false;
        }

        return true;
    };

    var methods = ['afterEach', 'after', 'beforeEach', 'before', 'describe', 'it'];

    return exports;
})({});

/* ------------------------------ keys ------------------------------ */

export var keys = _.keys = (function (exports) {
    /* Create an array of the own enumerable property names of object.
     *
     * |Name  |Desc                   |
     * |------|-----------------------|
     * |obj   |Object to query        |
     * |return|Array of property names|
     */

    /* example
     * keys({a: 1}); // -> ['a']
     */

    /* typescript
     * export declare function keys(obj: any): string[];
     */

    /* dependencies
     * has detectMocha 
     */

    if (Object.keys && !detectMocha()) {
        exports = Object.keys;
    } else {
        exports = function(obj) {
            var ret = [];

            for (var key in obj) {
                if (has(obj, key)) ret.push(key);
            }

            return ret;
        };
    }

    return exports;
})({});

/* ------------------------------ freeze ------------------------------ */

export var freeze = _.freeze = (function (exports) {
    /* Shortcut for Object.freeze.
     *
     * Use Object.defineProperties if Object.freeze is not supported.
     *
     * |Name  |Desc            |
     * |------|----------------|
     * |obj   |Object to freeze|
     * |return|Object passed in|
     */

    /* example
     * const a = {b: 1};
     * freeze(a);
     * a.b = 2;
     * console.log(a); // -> {b: 1}
     */

    /* typescript
     * export declare function freeze<T>(obj: T): T;
     */

    /* dependencies
     * keys 
     */

    exports = function(obj) {
        if (Object.freeze) return Object.freeze(obj);
        keys(obj).forEach(function(prop) {
            if (!Object.getOwnPropertyDescriptor(obj, prop).configurable) return;
            Object.defineProperty(obj, prop, {
                writable: false,
                configurable: false
            });
        });
        return obj;
    };

    return exports;
})({});

/* ------------------------------ detectOs ------------------------------ */

export var detectOs = _.detectOs = (function (exports) {
    /* Detect operating system using ua.
     *
     * |Name                  |Desc                 |
     * |----------------------|---------------------|
     * |ua=navigator.userAgent|Browser userAgent    |
     * |return                |Operating system name|
     *
     * Supported os: windows, os x, linux, ios, android, windows phone
     */

    /* example
     * if (detectOs() === 'ios') {
     *     // Do something about ios...
     * }
     */

    /* typescript
     * export declare function detectOs(ua?: string): string;
     */

    /* dependencies
     * isBrowser 
     */

    exports = function(ua) {
        ua = ua || (isBrowser ? navigator.userAgent : '');
        ua = ua.toLowerCase();
        if (detect('windows phone')) return 'windows phone';
        if (detect('win')) return 'windows';
        if (detect('android')) return 'android';
        if (detect('ipad') || detect('iphone') || detect('ipod')) return 'ios';
        if (detect('mac')) return 'os x';
        if (detect('linux')) return 'linux';

        function detect(keyword) {
            return ua.indexOf(keyword) > -1;
        }

        return 'unknown';
    };

    return exports;
})({});

/* ------------------------------ restArgs ------------------------------ */

export var restArgs = _.restArgs = (function (exports) {
    /* This accumulates the arguments passed into an array, after a given index.
     *
     * |Name      |Desc                                   |
     * |----------|---------------------------------------|
     * |function  |Function that needs rest parameters    |
     * |startIndex|The start index to accumulates         |
     * |return    |Generated function with rest parameters|
     */

    /* example
     * const paramArr = restArgs(function (rest) { return rest });
     * paramArr(1, 2, 3, 4); // -> [1, 2, 3, 4]
     */

    /* typescript
     * export declare function restArgs(fn: Function, startIndex?: number): Function;
     */
    exports = function(fn, startIdx) {
        startIdx = startIdx == null ? fn.length - 1 : +startIdx;
        return function() {
            var len = Math.max(arguments.length - startIdx, 0);
            var rest = new Array(len);
            var i;

            for (i = 0; i < len; i++) {
                rest[i] = arguments[i + startIdx];
            } // Call runs faster than apply.

            switch (startIdx) {
                case 0:
                    return fn.call(this, rest);

                case 1:
                    return fn.call(this, arguments[0], rest);

                case 2:
                    return fn.call(this, arguments[0], arguments[1], rest);
            }

            var args = new Array(startIdx + 1);

            for (i = 0; i < startIdx; i++) {
                args[i] = arguments[i];
            }

            args[startIdx] = rest;
            return fn.apply(this, args);
        };
    };

    return exports;
})({});

/* ------------------------------ optimizeCb ------------------------------ */

export var optimizeCb = _.optimizeCb = (function (exports) {
    /* Used for function context binding.
     */

    /* typescript
     * export declare function optimizeCb(fn: Function, ctx: any, argCount?: number): Function;
     */

    /* dependencies
     * isUndef 
     */

    exports = function(fn, ctx, argCount) {
        if (isUndef(ctx)) return fn;

        switch (argCount == null ? 3 : argCount) {
            case 1:
                return function(val) {
                    return fn.call(ctx, val);
                };

            case 3:
                return function(val, idx, collection) {
                    return fn.call(ctx, val, idx, collection);
                };

            case 4:
                return function(accumulator, val, idx, collection) {
                    return fn.call(ctx, accumulator, val, idx, collection);
                };
        }

        return function() {
            return fn.apply(ctx, arguments);
        };
    };

    return exports;
})({});

/* ------------------------------ types ------------------------------ */

export var types = _.types = (function (exports) {
    /* Used for typescript definitions only.
     */

    /* typescript
     * export declare namespace types {
     *     interface Collection<T> {}
     *     interface List<T> extends Collection<T> {
     *         [index: number]: T;
     *         length: number;
     *     }
     *     interface ListIterator<T, TResult> {
     *         (value: T, index: number, list: List<T>): TResult;
     *     }
     *     interface Dictionary<T> extends Collection<T> {
     *         [index: string]: T;
     *     }
     *     interface ObjectIterator<T, TResult> {
     *         (element: T, key: string, list: Dictionary<T>): TResult;
     *     }
     *     interface MemoIterator<T, TResult> {
     *         (prev: TResult, curr: T, index: number, list: List<T>): TResult;
     *     }
     *     interface MemoObjectIterator<T, TResult> {
     *         (prev: TResult, curr: T, key: string, list: Dictionary<T>): TResult;
     *     }
     * }
     * export declare const types: {}
     */
    exports = {};

    return exports;
})({});

/* ------------------------------ endWith ------------------------------ */

export var endWith = _.endWith = (function (exports) {
    /* Check if string ends with the given target string.
     *
     * |Name  |Desc                           |
     * |------|-------------------------------|
     * |str   |The string to search           |
     * |suffix|String suffix                  |
     * |return|True if string ends with target|
     */

    /* example
     * endWith('ab', 'b'); // -> true
     */

    /* typescript
     * export declare function endWith(str: string, suffix: string): boolean;
     */
    exports = function(str, suffix) {
        var idx = str.length - suffix.length;
        return idx >= 0 && str.indexOf(suffix, idx) === idx;
    };

    return exports;
})({});

/* ------------------------------ escape ------------------------------ */

export var escape = _.escape = (function (exports) {
    /* Escapes a string for insertion into HTML, replacing &, <, >, ", `, and ' characters.
     *
     * |Name  |Desc            |
     * |------|----------------|
     * |str   |String to escape|
     * |return|Escaped string  |
     */

    /* example
     * escape('You & Me'); // -> 'You &amp; Me'
     */

    /* typescript
     * export declare function escape(str: string): string;
     */

    /* dependencies
     * keys 
     */

    exports = function(str) {
        return regTest.test(str) ? str.replace(regReplace, replaceFn) : str;
    };

    var map = (exports.map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
    });
    var regSrc = '(?:' + keys(map).join('|') + ')';
    var regTest = new RegExp(regSrc);
    var regReplace = new RegExp(regSrc, 'g');

    var replaceFn = function(match) {
        return map[match];
    };

    return exports;
})({});

/* ------------------------------ escapeJsStr ------------------------------ */

export var escapeJsStr = _.escapeJsStr = (function (exports) {
    /* Escape string to be a valid JavaScript string literal between quotes.
     *
     * http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.4
     *
     * |Name  |Desc            |
     * |------|----------------|
     * |str   |String to escape|
     * |return|Escaped string  |
     */

    /* example
     * escapeJsStr('\"\n'); // -> '\\"\\\\n'
     */

    /* typescript
     * export declare function escapeJsStr(str: string): string;
     */

    /* dependencies
     * toStr 
     */

    exports = function(str) {
        return toStr(str).replace(regEscapeChars, function(char) {
            switch (char) {
                case '"':
                case "'":
                case '\\':
                    return '\\' + char;

                case '\n':
                    return '\\n';

                case '\r':
                    return '\\r';
                // Line separator

                case '\u2028':
                    return '\\u2028';
                // Paragraph separator

                case '\u2029':
                    return '\\u2029';
            }
        });
    };

    var regEscapeChars = /["'\\\n\r\u2028\u2029]/g;

    return exports;
})({});

/* ------------------------------ escapeJsonStr ------------------------------ */

export var escapeJsonStr = _.escapeJsonStr = (function (exports) {
    /* Escape json string.
     */

    /* dependencies
     * escapeJsStr 
     */

    exports = function (str) {
      return escapeJsStr(str)
        .replace(/\\'/g, "'")
        .replace(/\t/g, '\\t')
    }

    return exports;
})({});

/* ------------------------------ escapeRegExp ------------------------------ */

export var escapeRegExp = _.escapeRegExp = (function (exports) {
    /* Escape special chars to be used as literals in RegExp constructors.
     *
     * |Name  |Desc            |
     * |------|----------------|
     * |str   |String to escape|
     * |return|Escaped string  |
     */

    /* example
     * escapeRegExp('[licia]'); // -> '\\[licia\\]'
     */

    /* typescript
     * export declare function escapeRegExp(str: string): string;
     */
    exports = function(str) {
        return str.replace(/\W/g, '\\$&');
    };

    return exports;
})({});

/* ------------------------------ fileSize ------------------------------ */

export var fileSize = _.fileSize = (function (exports) {
    /* Turn bytes into human readable file size.
     *
     * |Name  |Desc              |
     * |------|------------------|
     * |bytes |File bytes        |
     * |return|Readable file size|
     */

    /* example
     * fileSize(5); // -> '5'
     * fileSize(1500); // -> '1.46K'
     * fileSize(1500000); // -> '1.43M'
     * fileSize(1500000000); // -> '1.4G'
     * fileSize(1500000000000); // -> '1.36T'
     */

    /* typescript
     * export declare function fileSize(bytes: number): string;
     */
    exports = function(bytes) {
        if (bytes <= 0) return '0';
        var suffixIdx = Math.floor(Math.log(bytes) / Math.log(1024));
        var val = bytes / Math.pow(2, suffixIdx * 10);
        return +val.toFixed(2) + suffixList[suffixIdx];
    };

    var suffixList = ['', 'K', 'M', 'G', 'T'];

    return exports;
})({});

/* ------------------------------ fullUrl ------------------------------ */

export var fullUrl = _.fullUrl = (function (exports) {
    /* Add origin to url if needed.
     */

    let link = document.createElement('a')

    exports = function (href) {
      link.href = href

      return (
        link.protocol + '//' + link.host + link.pathname + link.search + link.hash
      )
    }

    return exports;
})({});

/* ------------------------------ upperFirst ------------------------------ */

export var upperFirst = _.upperFirst = (function (exports) {
    /* Convert the first character of string to upper case.
     *
     * |Name  |Desc             |
     * |------|-----------------|
     * |str   |String to convert|
     * |return|Converted string |
     */

    /* example
     * upperFirst('red'); // -> Red
     */

    /* typescript
     * export declare function upperFirst(str: string): string;
     */
    exports = function(str) {
        if (str.length < 1) return str;
        return str[0].toUpperCase() + str.slice(1);
    };

    return exports;
})({});

/* ------------------------------ getObjType ------------------------------ */

export var getObjType = _.getObjType = (function (exports) {
    /* Get object type.
     */

    /* dependencies
     * upperFirst 
     */

    exports = function (obj) {
      if (obj.constructor && obj.constructor.name) return obj.constructor.name

      return upperFirst({}.toString.call(obj).replace(/(\[object )|]/g, ''))
    }

    return exports;
})({});

/* ------------------------------ identity ------------------------------ */

export var identity = _.identity = (function (exports) {
    /* Return the first argument given.
     *
     * |Name  |Desc       |
     * |------|-----------|
     * |val   |Any value  |
     * |return|Given value|
     */

    /* example
     * identity('a'); // -> 'a'
     */

    /* typescript
     * export declare function identity<T>(val: T): T;
     */
    exports = function(val) {
        return val;
    };

    return exports;
})({});

/* ------------------------------ objToStr ------------------------------ */

export var objToStr = _.objToStr = (function (exports) {
    /* Alias of Object.prototype.toString.
     *
     * |Name  |Desc                                |
     * |------|------------------------------------|
     * |val   |Source value                        |
     * |return|String representation of given value|
     */

    /* example
     * objToStr(5); // -> '[object Number]'
     */

    /* typescript
     * export declare function objToStr(val: any): string;
     */
    var ObjToStr = Object.prototype.toString;

    exports = function(val) {
        return ObjToStr.call(val);
    };

    return exports;
})({});

/* ------------------------------ isArgs ------------------------------ */

export var isArgs = _.isArgs = (function (exports) {
    /* Check if value is classified as an arguments object.
     *
     * |Name  |Desc                                |
     * |------|------------------------------------|
     * |val   |Value to check                      |
     * |return|True if value is an arguments object|
     */

    /* example
     * (function () {
     *     isArgs(arguments); // -> true
     * })();
     */

    /* typescript
     * export declare function isArgs(val: any): boolean;
     */

    /* dependencies
     * objToStr 
     */

    exports = function(val) {
        return objToStr(val) === '[object Arguments]';
    };

    return exports;
})({});

/* ------------------------------ isArr ------------------------------ */

export var isArr = _.isArr = (function (exports) {
    /* Check if value is an `Array` object.
     *
     * |Name  |Desc                              |
     * |------|----------------------------------|
     * |val   |Value to check                    |
     * |return|True if value is an `Array` object|
     */

    /* example
     * isArr([]); // -> true
     * isArr({}); // -> false
     */

    /* typescript
     * export declare function isArr(val: any): boolean;
     */

    /* dependencies
     * objToStr 
     */

    exports =
        Array.isArray ||
        function(val) {
            return objToStr(val) === '[object Array]';
        };

    return exports;
})({});

/* ------------------------------ castPath ------------------------------ */

export var castPath = _.castPath = (function (exports) {
    /* Cast value into a property path array.
     *
     * |Name  |Desc               |
     * |------|-------------------|
     * |path  |Value to inspect   |
     * |obj   |Object to query    |
     * |return|Property path array|
     */

    /* example
     * castPath('a.b.c'); // -> ['a', 'b', 'c']
     * castPath(['a']); // -> ['a']
     * castPath('a[0].b'); // -> ['a', '0', 'b']
     * castPath('a.b.c', {'a.b.c': true}); // -> ['a.b.c']
     */

    /* typescript
     * export declare function castPath(path: string | string[], obj?: any): string[];
     */

    /* dependencies
     * has isArr 
     */

    exports = function(str, obj) {
        if (isArr(str)) return str;
        if (obj && has(obj, str)) return [str];
        var ret = [];
        str.replace(regPropName, function(match, number, quote, str) {
            ret.push(quote ? str.replace(regEscapeChar, '$1') : number || match);
        });
        return ret;
    }; // Lodash _stringToPath

    var regPropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    var regEscapeChar = /\\(\\)?/g;

    return exports;
})({});

/* ------------------------------ safeGet ------------------------------ */

export var safeGet = _.safeGet = (function (exports) {
    /* Get object property, don't throw undefined error.
     *
     * |Name  |Desc                     |
     * |------|-------------------------|
     * |obj   |Object to query          |
     * |path  |Path of property to get  |
     * |return|Target value or undefined|
     */

    /* example
     * const obj = {a: {aa: {aaa: 1}}};
     * safeGet(obj, 'a.aa.aaa'); // -> 1
     * safeGet(obj, ['a', 'aa']); // -> {aaa: 1}
     * safeGet(obj, 'a.b'); // -> undefined
     */

    /* typescript
     * export declare function safeGet(obj: any, path: string | string[]): any;
     */

    /* dependencies
     * isUndef castPath 
     */

    exports = function(obj, path) {
        path = castPath(path, obj);
        var prop;
        prop = path.shift();

        while (!isUndef(prop)) {
            obj = obj[prop];
            if (obj == null) return;
            prop = path.shift();
        }

        return obj;
    };

    return exports;
})({});

/* ------------------------------ flatten ------------------------------ */

export var flatten = _.flatten = (function (exports) {
    /* Recursively flatten an array.
     *
     * |Name  |Desc               |
     * |------|-------------------|
     * |arr   |Array to flatten   |
     * |return|New flattened array|
     */

    /* example
     * flatten(['a', ['b', ['c']], 'd', ['e']]); // -> ['a', 'b', 'c', 'd', 'e']
     */

    /* typescript
     * export declare function flatten(arr: any[]): any[];
     */

    /* dependencies
     * isArr 
     */

    exports = function(arr) {
        return flat(arr, []);
    };

    function flat(arr, res) {
        var len = arr.length,
            i = -1,
            cur;

        while (len--) {
            cur = arr[++i];
            isArr(cur) ? flat(cur, res) : res.push(cur);
        }

        return res;
    }

    return exports;
})({});

/* ------------------------------ isDate ------------------------------ */

export var isDate = _.isDate = (function (exports) {
    /* Check if value is classified as a Date object.
     *
     * |Name  |Desc                          |
     * |------|------------------------------|
     * |val   |value to check                |
     * |return|True if value is a Date object|
     */

    /* example
     * isDate(new Date()); // -> true
     */

    /* typescript
     * export declare function isDate(val: any): boolean;
     */

    /* dependencies
     * objToStr 
     */

    exports = function(val) {
        return objToStr(val) === '[object Date]';
    };

    return exports;
})({});

/* ------------------------------ isFn ------------------------------ */

export var isFn = _.isFn = (function (exports) {
    /* Check if value is a function.
     *
     * |Name  |Desc                       |
     * |------|---------------------------|
     * |val   |Value to check             |
     * |return|True if value is a function|
     *
     * Generator function is also classified as true.
     */

    /* example
     * isFn(function() {}); // -> true
     * isFn(function*() {}); // -> true
     * isFn(async function() {}); // -> true
     */

    /* typescript
     * export declare function isFn(val: any): boolean;
     */

    /* dependencies
     * objToStr 
     */

    exports = function(val) {
        var objStr = objToStr(val);
        return (
            objStr === '[object Function]' ||
            objStr === '[object GeneratorFunction]' ||
            objStr === '[object AsyncFunction]'
        );
    };

    return exports;
})({});

/* ------------------------------ getProto ------------------------------ */

export var getProto = _.getProto = (function (exports) {
    /* Get prototype of an object.
     *
     * |Name  |Desc                                         |
     * |------|---------------------------------------------|
     * |obj   |Target object                                |
     * |return|Prototype of given object, null if not exists|
     */

    /* example
     * const a = {};
     * getProto(Object.create(a)); // -> a
     */

    /* typescript
     * export declare function getProto(obj: any): any;
     */

    /* dependencies
     * isObj isFn 
     */

    var getPrototypeOf = Object.getPrototypeOf;
    var ObjectCtr = {}.constructor;

    exports = function(obj) {
        if (!isObj(obj)) return;
        if (getPrototypeOf) return getPrototypeOf(obj);
        var proto = obj.__proto__;
        if (proto || proto === null) return proto;
        if (isFn(obj.constructor)) return obj.constructor.prototype;
        if (obj instanceof ObjectCtr) return ObjectCtr.prototype;
    };

    return exports;
})({});

/* ------------------------------ isMiniProgram ------------------------------ */

export var isMiniProgram = _.isMiniProgram = (function (exports) {
    /* Check if running in wechat mini program.
     */

    /* example
     * console.log(isMiniProgram); // -> true if running in mini program.
     */

    /* typescript
     * export declare const isMiniProgram: boolean;
     */

    /* dependencies
     * isFn 
     */
    /* eslint-disable no-undef */

    exports = typeof wx !== 'undefined' && isFn(wx.openLocation);

    return exports;
})({});

/* ------------------------------ isNum ------------------------------ */

export var isNum = _.isNum = (function (exports) {
    /* Check if value is classified as a Number primitive or object.
     *
     * |Name  |Desc                                 |
     * |------|-------------------------------------|
     * |val   |Value to check                       |
     * |return|True if value is correctly classified|
     */

    /* example
     * isNum(5); // -> true
     * isNum(5.1); // -> true
     * isNum({}); // -> false
     */

    /* typescript
     * export declare function isNum(val: any): boolean;
     */

    /* dependencies
     * objToStr 
     */

    exports = function(val) {
        return objToStr(val) === '[object Number]';
    };

    return exports;
})({});

/* ------------------------------ isArrLike ------------------------------ */

export var isArrLike = _.isArrLike = (function (exports) {
    /* Check if value is array-like.
     *
     * |Name  |Desc                       |
     * |------|---------------------------|
     * |val   |Value to check             |
     * |return|True if value is array like|
     *
     * Function returns false.
     */

    /* example
     * isArrLike('test'); // -> true
     * isArrLike(document.body.children); // -> true;
     * isArrLike([1, 2, 3]); // -> true
     */

    /* typescript
     * export declare function isArrLike(val: any): boolean;
     */

    /* dependencies
     * isNum isFn 
     */

    var MAX_ARR_IDX = Math.pow(2, 53) - 1;

    exports = function(val) {
        if (!val) return false;
        var len = val.length;
        return isNum(len) && len >= 0 && len <= MAX_ARR_IDX && !isFn(val);
    };

    return exports;
})({});

/* ------------------------------ each ------------------------------ */

export var each = _.each = (function (exports) {
    /* Iterate over elements of collection and invokes iterator for each element.
     *
     * |Name    |Desc                          |
     * |--------|------------------------------|
     * |obj     |Collection to iterate over    |
     * |iterator|Function invoked per iteration|
     * |ctx     |Function context              |
     */

    /* example
     * each({'a': 1, 'b': 2}, function (val, key) {});
     */

    /* typescript
     * export declare function each<T>(
     *     list: types.List<T>,
     *     iterator: types.ListIterator<T, void>,
     *     ctx?: any
     * ): types.List<T>;
     * export declare function each<T>(
     *     object: types.Dictionary<T>,
     *     iterator: types.ObjectIterator<T, void>,
     *     ctx?: any
     * ): types.Collection<T>;
     */

    /* eslint-disable no-unused-vars */

    /* dependencies
     * isArrLike keys optimizeCb types 
     */

    exports = function(obj, iterator, ctx) {
        iterator = optimizeCb(iterator, ctx);
        var i, len;

        if (isArrLike(obj)) {
            for (i = 0, len = obj.length; i < len; i++) {
                iterator(obj[i], i, obj);
            }
        } else {
            var _keys = keys(obj);

            for (i = 0, len = _keys.length; i < len; i++) {
                iterator(obj[_keys[i]], _keys[i], obj);
            }
        }

        return obj;
    };

    return exports;
})({});

/* ------------------------------ createAssigner ------------------------------ */

export var createAssigner = _.createAssigner = (function (exports) {
    /* Used to create extend, extendOwn and defaults.
     *
     * |Name    |Desc                          |
     * |--------|------------------------------|
     * |keysFn  |Function to get object keys   |
     * |defaults|No override when set to true  |
     * |return  |Result function, extend...    |
     */

    /* typescript
     * export declare function createAssigner(keysFn: Function, defaults: boolean): Function;
     */

    /* dependencies
     * isUndef each 
     */

    exports = function(keysFn, defaults) {
        return function(obj) {
            each(arguments, function(src, idx) {
                if (idx === 0) return;
                var keys = keysFn(src);
                each(keys, function(key) {
                    if (!defaults || isUndef(obj[key])) obj[key] = src[key];
                });
            });
            return obj;
        };
    };

    return exports;
})({});

/* ------------------------------ extendOwn ------------------------------ */

export var extendOwn = _.extendOwn = (function (exports) {
    /* Like extend, but only copies own properties over to the destination object.
     *
     * |Name       |Desc              |
     * |-----------|------------------|
     * |destination|Destination object|
     * |...sources |Sources objects   |
     * |return     |Destination object|
     */

    /* example
     * extendOwn({name: 'RedHood'}, {age: 24}); // -> {name: 'RedHood', age: 24}
     */

    /* typescript
     * export declare function extendOwn(destination: any, ...sources: any[]): any;
     */

    /* dependencies
     * keys createAssigner 
     */

    exports = createAssigner(keys);

    return exports;
})({});

/* ------------------------------ values ------------------------------ */

export var values = _.values = (function (exports) {
    /* Create an array of the own enumerable property values of object.
     *
     * |Name  |Desc                    |
     * |------|------------------------|
     * |obj   |Object to query         |
     * |return|Array of property values|
     */

    /* example
     * values({one: 1, two: 2}); // -> [1, 2]
     */

    /* typescript
     * export declare function values(obj: any): any[];
     */

    /* dependencies
     * each 
     */

    exports = function(obj) {
        var ret = [];
        each(obj, function(val) {
            ret.push(val);
        });
        return ret;
    };

    return exports;
})({});

/* ------------------------------ isStr ------------------------------ */

export var isStr = _.isStr = (function (exports) {
    /* Check if value is a string primitive.
     *
     * |Name  |Desc                               |
     * |------|-----------------------------------|
     * |val   |Value to check                     |
     * |return|True if value is a string primitive|
     */

    /* example
     * isStr('licia'); // -> true
     */

    /* typescript
     * export declare function isStr(val: any): boolean;
     */

    /* dependencies
     * objToStr 
     */

    exports = function(val) {
        return objToStr(val) === '[object String]';
    };

    return exports;
})({});

/* ------------------------------ contain ------------------------------ */

export var contain = _.contain = (function (exports) {
    /* Check if the value is present in the list.
     *
     * |Name  |Desc                                |
     * |------|------------------------------------|
     * |target|Target object                       |
     * |val   |Value to check                      |
     * |return|True if value is present in the list|
     */

    /* example
     * contain([1, 2, 3], 1); // -> true
     * contain({a: 1, b: 2}, 1); // -> true
     * contain('abc', 'a'); // -> true
     */

    /* typescript
     * export declare function contain(
     *     arr: any[] | {} | string,
     *     val: any
     * ): boolean;
     */

    /* dependencies
     * idxOf isStr isArrLike values 
     */

    exports = function(arr, val) {
        if (isStr(arr)) return arr.indexOf(val) > -1;
        if (!isArrLike(arr)) arr = values(arr);
        return idxOf(arr, val) >= 0;
    };

    return exports;
})({});

/* ------------------------------ isEmpty ------------------------------ */

export var isEmpty = _.isEmpty = (function (exports) {
    /* Check if value is an empty object or array.
     *
     * |Name  |Desc                  |
     * |------|----------------------|
     * |val   |Value to check        |
     * |return|True if value is empty|
     */

    /* example
     * isEmpty([]); // -> true
     * isEmpty({}); // -> true
     * isEmpty(''); // -> true
     */

    /* typescript
     * export declare function isEmpty(val: any): boolean;
     */

    /* dependencies
     * isArrLike isArr isStr isArgs keys 
     */

    exports = function(val) {
        if (val == null) return true;

        if (isArrLike(val) && (isArr(val) || isStr(val) || isArgs(val))) {
            return val.length === 0;
        }

        return keys(val).length === 0;
    };

    return exports;
})({});

/* ------------------------------ isBool ------------------------------ */

export var isBool = _.isBool = (function (exports) {
    /* Check if value is a boolean primitive.
     *
     * |Name  |Desc                      |
     * |------|--------------------------|
     * |val   |Value to check            |
     * |return|True if value is a boolean|
     */

    /* example
     * isBool(true); // -> true
     * isBool(false); // -> true
     * isBool(1); // -> false
     */

    /* typescript
     * export declare function isBool(val: any): boolean;
     */
    exports = function(val) {
        return val === true || val === false;
    };

    return exports;
})({});

/* ------------------------------ startWith ------------------------------ */

export var startWith = _.startWith = (function (exports) {
    /* Check if string starts with the given target string.
     *
     * |Name  |Desc                             |
     * |------|---------------------------------|
     * |str   |String to search                 |
     * |prefix|String prefix                    |
     * |return|True if string starts with prefix|
     */

    /* example
     * startWith('ab', 'a'); // -> true
     */

    /* typescript
     * export declare function startWith(str: string, prefix: string): boolean;
     */
    exports = function(str, prefix) {
        return str.indexOf(prefix) === 0;
    };

    return exports;
})({});

/* ------------------------------ isCrossOrig ------------------------------ */

export var isCrossOrig = _.isCrossOrig = (function (exports) {
    /* Check if a url is cross origin.
     */

    /* dependencies
     * startWith 
     */

    let origin = window.location.origin

    exports = function (url) {
      return !startWith(url, origin)
    }

    return exports;
})({});

/* ------------------------------ isEl ------------------------------ */

export var isEl = _.isEl = (function (exports) {
    /* Check if value is a DOM element.
     *
     * |Name  |Desc                          |
     * |------|------------------------------|
     * |val   |Value to check                |
     * |return|True if value is a DOM element|
     */

    /* example
     * isEl(document.body); // -> true
     */

    /* typescript
     * export declare function isEl(val: any): boolean;
     */
    exports = function(val) {
        return !!(val && val.nodeType === 1);
    };

    return exports;
})({});

/* ------------------------------ isErr ------------------------------ */

export var isErr = _.isErr = (function (exports) {
    /* Check if value is an error.
     *
     * |Name  |Desc                     |
     * |------|-------------------------|
     * |val   |Value to check           |
     * |return|True if value is an error|
     */

    /* example
     * isErr(new Error()); // -> true
     */

    /* typescript
     * export declare function isErr(val: any): boolean;
     */

    /* dependencies
     * objToStr 
     */

    exports = function(val) {
        return objToStr(val) === '[object Error]';
    };

    return exports;
})({});

/* ------------------------------ isHidden ------------------------------ */

export var isHidden = _.isHidden = (function (exports) {
    /* Check if element is hidden.
     *
     * |Name   |Desc                     |
     * |-------|-------------------------|
     * |el     |Target element           |
     * |options|Check options            |
     * |return |True if element is hidden|
     *
     * Available options:
     *
     * |Name            |Desc                         |
     * |----------------|-----------------------------|
     * |display=true    |Check if it is displayed     |
     * |visibility=false|Check visibility css property|
     * |opacity=false   |Check opacity css property   |
     * |size=false      |Check width and height       |
     * |viewport=false  |Check if it is in viewport   |
     * |overflow=false  |Check if hidden in overflow  |
     */

    /* example
     * isHidden(document.createElement('div')); // -> true
     */

    /* typescript
     * export declare function isHidden(el: Element, options?: {
     *     display?: boolean;
     *     visibility?: boolean;
     *     opacity?: boolean;
     *     size?: boolean;
     *     viewport?: boolean;
     *     overflow?: boolean;
     * }): boolean;
     */

    /* dependencies
     * root 
     */

    var getComputedStyle = root.getComputedStyle;
    var document = root.document;

    exports = function(el) {
        var _ref =
                arguments.length > 1 && arguments[1] !== undefined
                    ? arguments[1]
                    : {},
            _ref$display = _ref.display,
            display = _ref$display === void 0 ? true : _ref$display,
            _ref$visibility = _ref.visibility,
            visibility = _ref$visibility === void 0 ? false : _ref$visibility,
            _ref$opacity = _ref.opacity,
            opacity = _ref$opacity === void 0 ? false : _ref$opacity,
            _ref$size = _ref.size,
            size = _ref$size === void 0 ? false : _ref$size,
            _ref$viewport = _ref.viewport,
            viewport = _ref$viewport === void 0 ? false : _ref$viewport,
            _ref$overflow = _ref.overflow,
            overflow = _ref$overflow === void 0 ? false : _ref$overflow;

        if (display) {
            return el.offsetParent === null;
        }

        var computedStyle = getComputedStyle(el);

        if (visibility && computedStyle.visibility === 'hidden') {
            return true;
        }

        if (opacity) {
            if (computedStyle.opacity === '0') {
                return true;
            } else {
                var cur = el;

                while ((cur = cur.parentElement)) {
                    var _computedStyle = getComputedStyle(cur);

                    if (_computedStyle.opacity === '0') {
                        return true;
                    }
                }
            }
        }

        var clientRect = el.getBoundingClientRect();

        if (size && (clientRect.width === 0 || clientRect.height === 0)) {
            return true;
        }

        if (viewport) {
            var containerRect = {
                top: 0,
                left: 0,
                right: document.documentElement.clientWidth,
                bottom: document.documentElement.clientHeight
            };
            return isOutside(clientRect, containerRect);
        }

        if (overflow) {
            var _cur = el;

            while ((_cur = _cur.parentElement)) {
                var _computedStyle2 = getComputedStyle(_cur);

                var _overflow = _computedStyle2.overflow;

                if (_overflow === 'scroll' || _overflow === 'hidden') {
                    var curRect = _cur.getBoundingClientRect();

                    if (isOutside(clientRect, curRect)) return true;
                }
            }
        }

        return false;
    };

    function isOutside(clientRect, containerRect) {
        return (
            clientRect.right < containerRect.left ||
            clientRect.left > containerRect.right ||
            clientRect.bottom < containerRect.top ||
            clientRect.top > containerRect.bottom
        );
    }

    return exports;
})({});

/* ------------------------------ isMatch ------------------------------ */

export var isMatch = _.isMatch = (function (exports) {
    /* Check if keys and values in src are contained in obj.
     *
     * |Name  |Desc                              |
     * |------|----------------------------------|
     * |obj   |Object to inspect                 |
     * |src   |Object of property values to match|
     * |return|True if object is match           |
     */

    /* example
     * isMatch({a: 1, b: 2}, {a: 1}); // -> true
     */

    /* typescript
     * export declare function isMatch(obj: any, src: any): boolean;
     */

    /* dependencies
     * keys 
     */

    exports = function(obj, src) {
        var _keys = keys(src);

        var len = _keys.length;
        if (obj == null) return !len;
        obj = Object(obj);

        for (var i = 0; i < len; i++) {
            var key = _keys[i];
            if (src[key] !== obj[key] || !(key in obj)) return false;
        }

        return true;
    };

    return exports;
})({});

/* ------------------------------ memoize ------------------------------ */

export var memoize = _.memoize = (function (exports) {
    /* Memoize a given function by caching the computed result.
     *
     * |Name  |Desc                                |
     * |------|------------------------------------|
     * |fn    |Function to have its output memoized|
     * |hashFn|Function to create cache key        |
     * |return|New memoized function               |
     */

    /* example
     * const fibonacci = memoize(function(n) {
     *     return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
     * });
     */

    /* typescript
     * export declare function memoize(fn: Function, hashFn?: Function): Function;
     */

    /* dependencies
     * has 
     */

    exports = function(fn, hashFn) {
        var memoize = function(key) {
            var cache = memoize.cache;
            var address = '' + (hashFn ? hashFn.apply(this, arguments) : key);
            if (!has(cache, address)) cache[address] = fn.apply(this, arguments);
            return cache[address];
        };

        memoize.cache = {};
        return memoize;
    };

    return exports;
})({});

/* ------------------------------ isMobile ------------------------------ */

export var isMobile = _.isMobile = (function (exports) {
    /* Check whether client is using a mobile browser using ua.
     *
     * |Name                  |Desc                                 |
     * |----------------------|-------------------------------------|
     * |ua=navigator.userAgent|User agent                           |
     * |return                |True if ua belongs to mobile browsers|
     */

    /* example
     * isMobile(navigator.userAgent);
     */

    /* typescript
     * export declare function isMobile(ua?: string): boolean;
     */

    /* dependencies
     * isBrowser memoize 
     */

    var regMobileAll = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;
    var regMobileFour = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i;
    exports = memoize(function(ua) {
        ua = ua || (isBrowser ? navigator.userAgent : '');
        return regMobileAll.test(ua) || regMobileFour.test(ua.substr(0, 4));
    });

    return exports;
})({});

/* ------------------------------ prefix ------------------------------ */

export var prefix = _.prefix = (function (exports) {
    /* Add vendor prefixes to a CSS attribute.
     *
     * |Name  |Desc                  |
     * |------|----------------------|
     * |name  |Property name         |
     * |return|Prefixed property name|
     *
     * ### dash
     *
     * Create a dasherize version.
     */

    /* example
     * prefix('text-emphasis'); // -> 'WebkitTextEmphasis'
     * prefix.dash('text-emphasis'); // -> '-webkit-text-emphasis'
     * prefix('color'); // -> 'color'
     */

    /* typescript
     * export declare namespace prefix {
     *     function dash(name: string): string;
     * }
     * export declare function prefix(name: string): string;
     */

    /* dependencies
     * memoize camelCase upperFirst has kebabCase 
     */

    exports = memoize(function(name) {
        name = name.replace(regPrefixes, '');
        name = camelCase(name);
        if (has(style, name)) return name;
        var i = prefixes.length;

        while (i--) {
            var prefixName = prefixes[i] + upperFirst(name);
            if (has(style, prefixName)) return prefixName;
        }

        return name;
    });
    exports.dash = memoize(function(name) {
        var camelCaseResult = exports(name);
        return (
            (regPrefixes.test(camelCaseResult) ? '-' : '') +
            kebabCase(camelCaseResult)
        );
    });
    var prefixes = ['O', 'ms', 'Moz', 'Webkit'];
    var regPrefixes = /^(O)|(ms)|(Moz)|(Webkit)|(-o-)|(-ms-)|(-moz-)|(-webkit-)/g;
    var style = document.createElement('p').style;

    return exports;
})({});

/* ------------------------------ isNaN ------------------------------ */

export var isNaN = _.isNaN = (function (exports) {
    /* Check if value is an NaN.
     *
     * |Name  |Desc                   |
     * |------|-----------------------|
     * |val   |Value to check         |
     * |return|True if value is an NaN|
     *
     * Undefined is not an NaN, different from global isNaN function.
     */

    /* example
     * isNaN(0); // -> false
     * isNaN(NaN); // -> true
     */

    /* typescript
     * export declare function isNaN(val: any): boolean;
     */

    /* dependencies
     * isNum 
     */

    exports = function(val) {
        return isNum(val) && val !== +val;
    };

    return exports;
})({});

/* ------------------------------ isNil ------------------------------ */

export var isNil = _.isNil = (function (exports) {
    /* Check if value is null or undefined, the same as value == null.
     *
     * |Name  |Desc                              |
     * |------|----------------------------------|
     * |val   |Value to check                    |
     * |return|True if value is null or undefined|
     */

    /* example
     * isNil(null); // -> true
     * isNil(void 0); // -> true
     * isNil(undefined); // -> true
     * isNil(false); // -> false
     * isNil(0); // -> false
     * isNil([]); // -> false
     */

    /* typescript
     * export declare function isNil(val: any): boolean;
     */
    exports = function(val) {
        return val == null;
    };

    return exports;
})({});

/* ------------------------------ toSrc ------------------------------ */

export var toSrc = _.toSrc = (function (exports) {
    /* Convert function to its source code.
     *
     * |Name  |Desc               |
     * |------|-------------------|
     * |fn    |Function to convert|
     * |return|Source code        |
     */

    /* example
     * toSrc(Math.min); // -> 'function min() { [native code] }'
     * toSrc(function () {}) // -> 'function () { }'
     */

    /* typescript
     * export declare function toSrc(fn: Function): string;
     */

    /* dependencies
     * isNil 
     */

    exports = function(fn) {
        if (isNil(fn)) return '';

        try {
            return fnToStr.call(fn);
            /* eslint-disable no-empty */
        } catch (e) {}

        try {
            return fn + '';
            /* eslint-disable no-empty */
        } catch (e) {}

        return '';
    };

    var fnToStr = Function.prototype.toString;

    return exports;
})({});

/* ------------------------------ isNative ------------------------------ */

export var isNative = _.isNative = (function (exports) {
    /* Check if value is a native function.
     *
     * |Name  |Desc                              |
     * |------|----------------------------------|
     * |val   |Value to check                    |
     * |return|True if value is a native function|
     */

    /* example
     * isNative(function () {}); // -> false
     * isNative(Math.min); // -> true
     */

    /* typescript
     * export declare function isNative(val: any): boolean;
     */

    /* dependencies
     * isObj isFn toSrc 
     */

    exports = function(val) {
        if (!isObj(val)) return false;
        if (isFn(val)) return regIsNative.test(toSrc(val)); // Detect host constructors (Safari > 4; really typed array specific)

        return regIsHostCtor.test(toSrc(val));
    };

    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var regIsNative = new RegExp(
        '^' +
            toSrc(hasOwnProperty)
                .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
                .replace(
                    /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                    '$1.*?'
                ) +
            '$'
    );
    var regIsHostCtor = /^\[object .+?Constructor\]$/;

    return exports;
})({});

/* ------------------------------ isNull ------------------------------ */

export var isNull = _.isNull = (function (exports) {
    /* Check if value is an Null.
     *
     * |Name  |Desc                    |
     * |------|------------------------|
     * |val   |Value to check          |
     * |return|True if value is an Null|
     */

    /* example
     * isNull(null); // -> true
     */

    /* typescript
     * export declare function isNull(val: any): boolean;
     */
    exports = function(val) {
        return val === null;
    };

    return exports;
})({});

/* ------------------------------ isPrimitive ------------------------------ */

export var isPrimitive = _.isPrimitive = (function (exports) {
    /* Check if value is string, number, boolean or null.
     *
     * |Name  |Desc                        |
     * |------|----------------------------|
     * |val   |Value to check              |
     * |return|True if value is a primitive|
     */

    /* example
     * isPrimitive(5); // -> true
     * isPrimitive('abc'); // -> true
     * isPrimitive(false); // -> true
     */

    /* typescript
     * export declare function isPrimitive(val: any): boolean;
     */
    exports = function(val) {
        var type = typeof val;
        return val == null || (type !== 'function' && type !== 'object');
    };

    return exports;
})({});

/* ------------------------------ isPromise ------------------------------ */

export var isPromise = _.isPromise = (function (exports) {
    /* Check if value looks like a promise.
     *
     * |Name  |Desc                              |
     * |------|----------------------------------|
     * |val   |Value to check                    |
     * |return|True if value looks like a promise|
     */

    /* example
     * isPromise(new Promise(function () {})); // -> true
     * isPromise({}); // -> false
     */

    /* typescript
     * export declare function isPromise(val: any): boolean;
     */

    /* dependencies
     * isObj isFn 
     */

    exports = function(val) {
        return isObj(val) && isFn(val.then);
    };

    return exports;
})({});

/* ------------------------------ isRegExp ------------------------------ */

export var isRegExp = _.isRegExp = (function (exports) {
    /* Check if value is a regular expression.
     *
     * |Name  |Desc                                 |
     * |------|-------------------------------------|
     * |val   |Value to check                       |
     * |return|True if value is a regular expression|
     */

    /* example
     * isRegExp(/a/); // -> true
     */

    /* typescript
     * export declare function isRegExp(val: any): boolean;
     */

    /* dependencies
     * objToStr 
     */

    exports = function(val) {
        return objToStr(val) === '[object RegExp]';
    };

    return exports;
})({});

/* ------------------------------ isSorted ------------------------------ */

export var isSorted = _.isSorted = (function (exports) {
    /* Check if an array is sorted.
     *
     * |Name  |Desc                   |
     * |------|-----------------------|
     * |arr   |Array to check         |
     * |cmp   |Comparator             |
     * |return|True if array is sorted|
     */

    /* example
     * isSorted([1, 2, 3]); // -> true
     * isSorted([3, 2, 1]); // -> false
     */

    /* typescript
     * export declare function isSorted(arr: any[], cmp?: Function): boolean;
     */
    exports = function(arr) {
        var cmp =
            arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : exports.defComparator;

        for (var i = 0, len = arr.length; i < len - 1; i++) {
            if (cmp(arr[i], arr[i + 1]) > 0) return false;
        }

        return true;
    };

    exports.defComparator = function(a, b) {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    };

    return exports;
})({});

/* ------------------------------ loadJs ------------------------------ */

export var loadJs = _.loadJs = (function (exports) {
    /* Inject script tag into page with given src value.
     *
     * |Name|Desc           |
     * |----|---------------|
     * |src |Script source  |
     * |cb  |Onload callback|
     */

    /* example
     * loadJs('main.js', function (isLoaded) {
     *     // Do something...
     * });
     */

    /* typescript
     * export declare function loadJs(src: string, cb?: Function): void;
     */
    exports = function(src, cb) {
        var script = document.createElement('script');
        script.src = src;

        script.onload = function() {
            var isNotLoaded =
                script.readyState &&
                script.readyState != 'complete' &&
                script.readyState != 'loaded';
            cb && cb(!isNotLoaded);
        };

        document.body.appendChild(script);
    };

    return exports;
})({});

/* ------------------------------ lowerCase ------------------------------ */

export var lowerCase = _.lowerCase = (function (exports) {
    /* Convert string to lower case.
     *
     * |Name  |Desc              |
     * |------|------------------|
     * |str   |String to convert |
     * |return|Lower cased string|
     */

    /* example
     * lowerCase('TEST'); // -> 'test'
     */

    /* typescript
     * export declare function lowerCase(str: string): string;
     */

    /* dependencies
     * toStr 
     */

    exports = function(str) {
        return toStr(str).toLocaleLowerCase();
    };

    return exports;
})({});

/* ------------------------------ repeat ------------------------------ */

export var repeat = _.repeat = (function (exports) {
    /* Repeat string n-times.
     *
     * |Name  |Desc            |
     * |------|----------------|
     * |str   |String to repeat|
     * |n     |Repeat times    |
     * |return|Repeated string |
     */

    /* example
     * repeat('a', 3); // -> 'aaa'
     * repeat('ab', 2); // -> 'abab'
     * repeat('*', 0); // -> ''
     */

    /* typescript
     * export declare function repeat(str: string, n: number): string;
     */
    exports = function(str, n) {
        var ret = '';
        if (n < 1) return '';

        while (n > 0) {
            if (n & 1) ret += str;
            n >>= 1;
            str += str;
        }

        return ret;
    };

    return exports;
})({});

/* ------------------------------ lpad ------------------------------ */

export var lpad = _.lpad = (function (exports) {
    /* Pad string on the left side if it's shorter than length.
     *
     * |Name  |Desc                  |
     * |------|----------------------|
     * |str   |String to pad         |
     * |len   |Padding length        |
     * |chars |String used as padding|
     * |return|Result string         |
     */

    /* example
     * lpad('a', 5); // -> '    a'
     * lpad('a', 5, '-'); // -> '----a'
     * lpad('abc', 3, '-'); // -> 'abc'
     * lpad('abc', 5, 'ab'); // -> 'ababc'
     */

    /* typescript
     * export declare function lpad(str: string, len: number, chars?: string): string;
     */

    /* dependencies
     * repeat toStr 
     */

    exports = function(str, len, chars) {
        str = toStr(str);
        var strLen = str.length;
        chars = chars || ' ';
        if (strLen < len) str = (repeat(chars, len - strLen) + str).slice(-len);
        return str;
    };

    return exports;
})({});

/* ------------------------------ dateFormat ------------------------------ */

export var dateFormat = _.dateFormat = (function (exports) {
    /* Simple but extremely useful date format function.
     *
     * |Name         |Desc                 |
     * |-------------|---------------------|
     * |date=new Date|Date object to format|
     * |mask         |Format mask          |
     * |utc=false    |UTC or not           |
     * |gmt=false    |GMT or not           |
     * |return       |Formatted duration   |
     *
     * |Mask|Desc                                                             |
     * |----|-----------------------------------------------------------------|
     * |d   |Day of the month as digits; no leading zero for single-digit days|
     * |dd  |Day of the month as digits; leading zero for single-digit days   |
     * |ddd |Day of the week as a three-letter abbreviation                   |
     * |dddd|Day of the week as its full name                                 |
     * |m   |Month as digits; no leading zero for single-digit months         |
     * |mm  |Month as digits; leading zero for single-digit months            |
     * |mmm |Month as a three-letter abbreviation                             |
     * |mmmm|Month as its full name                                           |
     * |yy  |Year as last two digits; leading zero for years less than 10     |
     * |yyyy|Year represented by four digits                                  |
     * |h   |Hours; no leading zero for single-digit hours (12-hour clock)    |
     * |hh  |Hours; leading zero for single-digit hours (12-hour clock)       |
     * |H   |Hours; no leading zero for single-digit hours (24-hour clock)    |
     * |HH  |Hours; leading zero for single-digit hours (24-hour clock)       |
     * |M   |Minutes; no leading zero for single-digit minutes                |
     * |MM  |Minutes; leading zero for single-digit minutes                   |
     * |s   |Seconds; no leading zero for single-digit seconds                |
     * |ss  |Seconds; leading zero for single-digit seconds                   |
     * |l L |Milliseconds. l gives 3 digits. L gives 2 digits                 |
     * |t   |Lowercase, single-character time marker string: a or p           |
     * |tt  |Lowercase, two-character time marker string: am or pm            |
     * |T   |Uppercase, single-character time marker string: A or P           |
     * |TT  |Uppercase, two-character time marker string: AM or PM            |
     * |Z   |US timezone abbreviation, e.g. EST or MDT                        |
     * |o   |GMT/UTC timezone offset, e.g. -0500 or +0230                     |
     * |S   |The date's ordinal suffix (st, nd, rd, or th)                    |
     * |UTC:|Must be the first four characters of the mask                    |
     */

    /* example
     * dateFormat('isoDate'); // -> 2016-11-19
     * dateFormat('yyyy-mm-dd HH:MM:ss'); // -> 2016-11-19 19:00:04
     * dateFormat(new Date(), 'yyyy-mm-dd'); // -> 2016-11-19
     */

    /* typescript
     * export declare function dateFormat(
     *     date: Date,
     *     mask: string,
     *     utc?: boolean,
     *     gmt?: boolean
     * ): string;
     * export declare function dateFormat(
     *     mask: string,
     *     utc?: boolean,
     *     gmt?: boolean
     * ): string;
     */

    /* dependencies
     * isStr isDate toStr lpad 
     */

    exports = function(date, mask, utc, gmt) {
        if (arguments.length === 1 && isStr(date) && !regNum.test(date)) {
            mask = date;
            date = undefined;
        }

        date = date || new Date();
        if (!isDate(date)) date = new Date(date);
        mask = toStr(exports.masks[mask] || mask || exports.masks['default']);
        var maskSlice = mask.slice(0, 4);

        if (maskSlice === 'UTC:' || maskSlice === 'GMT:') {
            mask = mask.slice(4);
            utc = true;
            if (maskSlice === 'GMT:') gmt = true;
        }

        var prefix = utc ? 'getUTC' : 'get';
        var d = date[prefix + 'Date']();
        var D = date[prefix + 'Day']();
        var m = date[prefix + 'Month']();
        var y = date[prefix + 'FullYear']();
        var H = date[prefix + 'Hours']();
        var M = date[prefix + 'Minutes']();
        var s = date[prefix + 'Seconds']();
        var L = date[prefix + 'Milliseconds']();
        var o = utc ? 0 : date.getTimezoneOffset();
        var flags = {
            d: d,
            dd: padZero(d),
            ddd: exports.i18n.dayNames[D],
            dddd: exports.i18n.dayNames[D + 7],
            m: m + 1,
            mm: padZero(m + 1),
            mmm: exports.i18n.monthNames[m],
            mmmm: exports.i18n.monthNames[m + 12],
            yy: toStr(y).slice(2),
            yyyy: y,
            h: H % 12 || 12,
            hh: padZero(H % 12 || 12),
            H: H,
            HH: padZero(H),
            M: M,
            MM: padZero(M),
            s: s,
            ss: padZero(s),
            l: padZero(L, 3),
            L: padZero(Math.round(L / 10)),
            t: H < 12 ? 'a' : 'p',
            tt: H < 12 ? 'am' : 'pm',
            T: H < 12 ? 'A' : 'P',
            TT: H < 12 ? 'AM' : 'PM',
            Z: gmt
                ? 'GMT'
                : utc
                ? 'UTC'
                : (toStr(date).match(regTimezone) || [''])
                      .pop()
                      .replace(regTimezoneClip, ''),
            o:
                (o > 0 ? '-' : '+') +
                padZero(Math.floor(Math.abs(o) / 60) * 100 + (Math.abs(o) % 60), 4),
            S: ['th', 'st', 'nd', 'rd'][
                d % 10 > 3 ? 0 : (((d % 100) - (d % 10) != 10) * d) % 10
            ]
        };
        return mask.replace(regToken, function(match) {
            if (match in flags) return flags[match];
            return match.slice(1, match.length - 1);
        });
    };

    var padZero = function(str) {
        var len =
            arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
        return lpad(toStr(str), len, '0');
    };

    var regToken = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|"[^"]*"|'[^']*'/g;
    var regTimezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
    var regNum = /\d/;
    var regTimezoneClip = /[^-+\dA-Z]/g;
    exports.masks = {
        default: 'ddd mmm dd yyyy HH:MM:ss',
        shortDate: 'm/d/yy',
        mediumDate: 'mmm d, yyyy',
        longDate: 'mmmm d, yyyy',
        fullDate: 'dddd, mmmm d, yyyy',
        shortTime: 'h:MM TT',
        mediumTime: 'h:MM:ss TT',
        longTime: 'h:MM:ss TT Z',
        isoDate: 'yyyy-mm-dd',
        isoTime: 'HH:MM:ss',
        isoDateTime: "yyyy-mm-dd'T'HH:MM:sso",
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
        expiresHeaderFormat: 'ddd, dd mmm yyyy HH:MM:ss Z'
    };
    exports.i18n = {
        dayNames: [
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat',
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ],
        monthNames: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ]
    };

    return exports;
})({});

/* ------------------------------ ltrim ------------------------------ */

export var ltrim = _.ltrim = (function (exports) {
    /* Remove chars or white-spaces from beginning of string.
     *
     * |Name  |Desc              |
     * |------|------------------|
     * |str   |String to trim    |
     * |chars |Characters to trim|
     * |return|Trimmed string    |
     */

    /* example
     * ltrim(' abc  '); // -> 'abc  '
     * ltrim('_abc_', '_'); // -> 'abc_'
     * ltrim('_abc_', ['a', '_']); // -> 'bc_'
     */

    /* typescript
     * export declare function ltrim(str: string, chars?: string | string[]): string;
     */
    var regSpace = /^\s+/;

    exports = function(str, chars) {
        if (chars == null) return str.replace(regSpace, '');
        var start = 0;
        var len = str.length;
        var charLen = chars.length;
        var found = true;
        var i;
        var c;

        while (found && start < len) {
            found = false;
            i = -1;
            c = str.charAt(start);

            while (++i < charLen) {
                if (c === chars[i]) {
                    found = true;
                    start++;
                    break;
                }
            }
        }

        return start >= len ? '' : str.substr(start, len);
    };

    return exports;
})({});

/* ------------------------------ matcher ------------------------------ */

export var matcher = _.matcher = (function (exports) {
    /* Return a predicate function that checks if attrs are contained in an object.
     *
     * |Name  |Desc                              |
     * |------|----------------------------------|
     * |attrs |Object of property values to match|
     * |return|New predicate function            |
     */

    /* example
     * const filter = require('licia/filter');
     *
     * const objects = [
     *     {a: 1, b: 2, c: 3 },
     *     {a: 4, b: 5, c: 6 }
     * ];
     * filter(objects, matcher({a: 4, c: 6 })); // -> [{a: 4, b: 5, c: 6}]
     */

    /* typescript
     * export declare function matcher(attrs: any): Function;
     */

    /* dependencies
     * extendOwn isMatch 
     */

    exports = function(attrs) {
        attrs = extendOwn({}, attrs);
        return function(obj) {
            return isMatch(obj, attrs);
        };
    };

    return exports;
})({});

/* ------------------------------ safeCb ------------------------------ */

export var safeCb = _.safeCb = (function (exports) {
    /* Create callback based on input value.
     */

    /* typescript
     * export declare function safeCb(val?: any, ctx?: any, argCount?: number): Function;
     */

    /* dependencies
     * isFn isObj optimizeCb matcher identity 
     */

    exports = function(val, ctx, argCount) {
        if (val == null) return identity;
        if (isFn(val)) return optimizeCb(val, ctx, argCount);
        if (isObj(val)) return matcher(val);
        return function(key) {
            return function(obj) {
                return obj == null ? undefined : obj[key];
            };
        };
    };

    return exports;
})({});

/* ------------------------------ filter ------------------------------ */

export var filter = _.filter = (function (exports) {
    /* Iterates over elements of collection, returning an array of all the values that pass a truth test.
     *
     * |Name     |Desc                                   |
     * |---------|---------------------------------------|
     * |obj      |Collection to iterate over             |
     * |predicate|Function invoked per iteration         |
     * |ctx      |Predicate context                      |
     * |return   |Array of all values that pass predicate|
     */

    /* example
     * filter([1, 2, 3, 4, 5], function (val) {
     *     return val % 2 === 0;
     * }); // -> [2, 4]
     */

    /* typescript
     * export declare function filter<T>(
     *     list: types.List<T>,
     *     iterator: types.ListIterator<T, boolean>,
     *     context?: any
     * ): T[];
     * export declare function filter<T>(
     *     object: types.Dictionary<T>,
     *     iterator: types.ObjectIterator<T, boolean>,
     *     context?: any
     * ): T[];
     */

    /* eslint-disable no-unused-vars */

    /* dependencies
     * safeCb each types 
     */

    exports = function(obj, predicate, ctx) {
        var ret = [];
        predicate = safeCb(predicate, ctx);
        each(obj, function(val, idx, list) {
            if (predicate(val, idx, list)) ret.push(val);
        });
        return ret;
    };

    return exports;
})({});

/* ------------------------------ difference ------------------------------ */

export var difference = _.difference = (function (exports) {
    /* Create an array of unique array values not included in the other given array.
     *
     * |Name   |Desc                        |
     * |-------|----------------------------|
     * |arr    |Array to inspect            |
     * |...rest|Values to exclude           |
     * |return |New array of filtered values|
     */

    /* example
     * difference([3, 2, 1], [4, 2]); // -> [3, 1]
     */

    /* typescript
     * export declare function difference(arr: any[], ...rest: any[]): any[];
     */

    /* dependencies
     * restArgs flatten filter contain 
     */

    exports = restArgs(function(arr, rest) {
        rest = flatten(rest);
        return filter(arr, function(val) {
            return !contain(rest, val);
        });
    });

    return exports;
})({});

/* ------------------------------ unique ------------------------------ */

export var unique = _.unique = (function (exports) {
    /* Create duplicate-free version of an array.
     *
     * |Name  |Desc                         |
     * |------|-----------------------------|
     * |arr   |Array to inspect             |
     * |cmp   |Function for comparing values|
     * |return|New duplicate free array     |
     */

    /* example
     * unique([1, 2, 3, 1]); // -> [1, 2, 3]
     */

    /* typescript
     * export declare function unique(
     *     arr: any[],
     *     cmp?: (a: any, b: any) => boolean | number
     * ): any[];
     */

    /* dependencies
     * filter 
     */

    exports = function(arr, cmp) {
        cmp = cmp || isEqual;
        return filter(arr, function(item, idx, arr) {
            var len = arr.length;

            while (++idx < len) {
                if (cmp(item, arr[idx])) return false;
            }

            return true;
        });
    };

    function isEqual(a, b) {
        return a === b;
    }

    return exports;
})({});

/* ------------------------------ allKeys ------------------------------ */

export var allKeys = _.allKeys = (function (exports) {
    /* Retrieve all the names of object's own and inherited properties.
     *
     * |Name   |Desc                       |
     * |-------|---------------------------|
     * |obj    |Object to query            |
     * |options|Options                    |
     * |return |Array of all property names|
     *
     * Available options:
     *
     * |Name              |Desc                     |
     * |------------------|-------------------------|
     * |prototype=true    |Include prototype keys   |
     * |unenumerable=false|Include unenumerable keys|
     * |symbol=false      |Include symbol keys      |
     *
     * Members of Object's prototype won't be retrieved.
     */

    /* example
     * const obj = Object.create({zero: 0});
     * obj.one = 1;
     * allKeys(obj) // -> ['zero', 'one']
     */

    /* typescript
     * export declare namespace allKeys {
     *     interface IOptions {
     *         prototype?: boolean;
     *         unenumerable?: boolean;
     *     }
     * }
     * export declare function allKeys(
     *     obj: any,
     *     options: { symbol: true } & allKeys.IOptions
     * ): Array<string | Symbol>;
     * export declare function allKeys(
     *     obj: any,
     *     options?: ({ symbol: false } & allKeys.IOptions) | allKeys.IOptions
     * ): string[];
     */

    /* dependencies
     * keys getProto unique 
     */

    var getOwnPropertyNames = Object.getOwnPropertyNames;
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;

    exports = function(obj) {
        var _ref =
                arguments.length > 1 && arguments[1] !== undefined
                    ? arguments[1]
                    : {},
            _ref$prototype = _ref.prototype,
            prototype = _ref$prototype === void 0 ? true : _ref$prototype,
            _ref$unenumerable = _ref.unenumerable,
            unenumerable = _ref$unenumerable === void 0 ? false : _ref$unenumerable,
            _ref$symbol = _ref.symbol,
            symbol = _ref$symbol === void 0 ? false : _ref$symbol;

        var ret = [];

        if ((unenumerable || symbol) && getOwnPropertyNames) {
            var getKeys = keys;
            if (unenumerable && getOwnPropertyNames) getKeys = getOwnPropertyNames;

            do {
                ret = ret.concat(getKeys(obj));

                if (symbol && getOwnPropertySymbols) {
                    ret = ret.concat(getOwnPropertySymbols(obj));
                }
            } while (
                prototype &&
                (obj = getProto(obj)) &&
                obj !== Object.prototype
            );

            ret = unique(ret);
        } else {
            if (prototype) {
                for (var key in obj) {
                    ret.push(key);
                }
            } else {
                ret = keys(obj);
            }
        }

        return ret;
    };

    return exports;
})({});

/* ------------------------------ defaults ------------------------------ */

export var defaults = _.defaults = (function (exports) {
    /* Fill in undefined properties in object with the first value present in the following list of defaults objects.
     *
     * |Name  |Desc              |
     * |------|------------------|
     * |obj   |Destination object|
     * |...src|Sources objects   |
     * |return|Destination object|
     */

    /* example
     * defaults({name: 'RedHood'}, {name: 'Unknown', age: 24}); // -> {name: 'RedHood', age: 24}
     */

    /* typescript
     * export declare function defaults(obj: any, ...src: any[]): any;
     */

    /* dependencies
     * createAssigner allKeys 
     */

    exports = createAssigner(allKeys, true);

    return exports;
})({});

/* ------------------------------ highlight ------------------------------ */

export var highlight = _.highlight = (function (exports) {
    /* Highlight code.
     *
     * |Name   |Desc                        |
     * |-------|----------------------------|
     * |str    |Code string                 |
     * |lang=js|Language, js, html or css   |
     * |style  |Keyword highlight style     |
     * |return |Highlighted html code string|
     *
     * Available styles:
     *
     * comment, string, number, keyword, operator
     */

    /* example
     * highlight('const a = 5;', 'js', {
     *     keyword: 'color:#569cd6;'
     * }); // -> '<span style="color:#569cd6;">const</span> a <span style="color:#994500;">=</span> <span style="color:#0086b3;">5</span>;'
     */

    /* typescript
     * export declare function highlight(
     *     str: string,
     *     lang?: string,
     *     style?: {
     *         comment?: string;
     *         string?: string;
     *         number?: string;
     *         keyword?: string;
     *         operator?: string;
     *     }
     * ): string;
     */

    /* dependencies
     * each defaults 
     */ // https://github.com/trentrichardson/jQuery-Litelighter

    exports = function(str) {
        var lang =
            arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : 'js';
        var style =
            arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        defaults(style, defStyle);
        str = str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        lang = language[lang];
        var subLangSi = 0;
        var subLangs = [];
        each(lang, function(val) {
            if (!val.language) return;
            str = str.replace(val.re, function($1, $2) {
                subLangs[subLangSi++] = exports($2, val.language, style);
                return $1.replace($2, '___subtmpl' + (subLangSi - 1) + '___');
            });
        });
        each(lang, function(val, key) {
            if (language[val.language]) return;
            str = str.replace(val.re, '___' + key + '___$1___end' + key + '___');
        });
        var levels = [];
        str = str.replace(/___(?!subtmpl)\w+?___/g, function($0) {
            var end = $0.substr(3, 3) === 'end',
                tag = (!end ? $0.substr(3) : $0.substr(6)).replace(/_/g, ''),
                lastTag = levels.length > 0 ? levels[levels.length - 1] : null;

            if (
                !end &&
                (lastTag == null ||
                    tag == lastTag ||
                    (lastTag != null &&
                        lang[lastTag] &&
                        lang[lastTag].embed != undefined &&
                        lang[lastTag].embed.indexOf(tag) > -1))
            ) {
                levels.push(tag);
                return $0;
            } else if (end && tag == lastTag) {
                levels.pop();
                return $0;
            }

            return '';
        });
        each(lang, function(val, key) {
            str = str
                .replace(new RegExp('___end' + key + '___', 'g'), '</span>')
                .replace(
                    new RegExp('___' + key + '___', 'g'),
                    '<span style="' + style[val.style] + '">'
                );
        });
        each(lang, function(val) {
            if (!val.language) return;
            str = str.replace(/___subtmpl\d+___/g, function($tmpl) {
                var i = parseInt($tmpl.replace(/___subtmpl(\d+)___/, '$1'), 10);
                return subLangs[i];
            });
        });
        return str;
    };

    var defStyle = {
        comment: 'color:#63a35c;',
        string: 'color:#183691;',
        number: 'color:#0086b3;',
        keyword: 'color:#a71d5d;',
        operator: 'color:#994500;'
    };
    var language = {};
    language.js = {
        comment: {
            re: /(\/\/.*|\/\*([\s\S]*?)\*\/)/g,
            style: 'comment'
        },
        string: {
            re: /(('.*?')|(".*?"))/g,
            style: 'string'
        },
        numbers: {
            re: /(-?(\d+|\d+\.\d+|\.\d+))/g,
            style: 'number'
        },
        keywords: {
            re: /(?:\b)(function|for|foreach|while|if|else|elseif|switch|break|as|return|this|class|self|default|var|const|let|false|true|null|undefined)(?:\b)/gi,
            style: 'keyword'
        },
        operator: {
            re: /(\+|-|\/|\*|%|=|&lt;|&gt;|\||\?|\.)/g,
            style: 'operator'
        }
    };
    language.html = {
        comment: {
            re: /(&lt;!--([\s\S]*?)--&gt;)/g,
            style: 'comment'
        },
        tag: {
            re: /(&lt;\/?\w(.|\n)*?\/?&gt;)/g,
            style: 'keyword',
            embed: ['string']
        },
        string: language.js.string,
        css: {
            re: /(?:&lt;style.*?&gt;)([\s\S]*)?(?:&lt;\/style&gt;)/gi,
            language: 'css'
        },
        script: {
            re: /(?:&lt;script.*?&gt;)([\s\S]*?)(?:&lt;\/script&gt;)/gi,
            language: 'js'
        }
    };
    language.css = {
        comment: language.js.comment,
        string: language.js.string,
        numbers: {
            re: /((-?(\d+|\d+\.\d+|\.\d+)(%|px|em|pt|in)?)|#[0-9a-fA-F]{3}[0-9a-fA-F]{3})/g,
            style: 'number'
        },
        keywords: {
            re: /(@\w+|:?:\w+|[a-z-]+:)/g,
            style: 'keyword'
        }
    };

    return exports;
})({});

/* ------------------------------ extend ------------------------------ */

export var extend = _.extend = (function (exports) {
    /* Copy all of the properties in the source objects over to the destination object.
     *
     * |Name       |Desc              |
     * |-----------|------------------|
     * |destination|Destination object|
     * |...sources |Sources objects   |
     * |return     |Destination object|
     */

    /* example
     * extend({name: 'RedHood'}, {age: 24}); // -> {name: 'RedHood', age: 24}
     */

    /* typescript
     * export declare function extend(destination: any, ...sources: any[]): any;
     */

    /* dependencies
     * createAssigner allKeys 
     */

    exports = createAssigner(allKeys);

    return exports;
})({});

/* ------------------------------ clone ------------------------------ */

export var clone = _.clone = (function (exports) {
    /* Create a shallow-copied clone of the provided plain object.
     *
     * Any nested objects or arrays will be copied by reference, not duplicated.
     *
     * |Name  |Desc          |
     * |------|--------------|
     * |val   |Value to clone|
     * |return|Cloned value  |
     */

    /* example
     * clone({name: 'eustia'}); // -> {name: 'eustia'}
     */

    /* typescript
     * export declare function clone<T>(val: T): T;
     */

    /* dependencies
     * isObj isArr extend 
     */

    exports = function(obj) {
        if (!isObj(obj)) return obj;
        return isArr(obj) ? obj.slice() : extend({}, obj);
    };

    return exports;
})({});

/* ------------------------------ copy ------------------------------ */

export var copy = _.copy = (function (exports) {
    /* Copy text to clipboard using document.execCommand.
     *
     * |Name|Desc             |
     * |----|-----------------|
     * |text|Text to copy     |
     * |cb  |Optional callback|
     */

    /* example
     * copy('text', function (err) {
     *     // Handle errors.
     * });
     */

    /* typescript
     * export declare function copy(text: string, cb?: Function): void;
     */

    /* dependencies
     * extend noop 
     */

    exports = function(text, cb) {
        cb = cb || noop;
        var el = document.createElement('textarea');
        var body = document.body;
        extend(el.style, {
            fontSize: '12pt',
            border: '0',
            padding: '0',
            margin: '0',
            position: 'absolute',
            left: '-9999px'
        });
        el.value = text;
        body.appendChild(el); // Prevent showing ios keyboard.

        el.setAttribute('readonly', '');
        el.select();
        el.setSelectionRange(0, text.length);

        try {
            document.execCommand('copy');
            cb();
        } catch (e) {
            cb(e);
        } finally {
            body.removeChild(el);
        }
    };

    return exports;
})({});

/* ------------------------------ map ------------------------------ */

export var map = _.map = (function (exports) {
    /* Create an array of values by running each element in collection through iteratee.
     *
     * |Name    |Desc                          |
     * |--------|------------------------------|
     * |object  |Collection to iterate over    |
     * |iterator|Function invoked per iteration|
     * |context |Function context              |
     * |return  |New mapped array              |
     */

    /* example
     * map([4, 8], function (n) { return n * n; }); // -> [16, 64]
     */

    /* typescript
     * export declare function map<T, TResult>(
     *     list: types.List<T>,
     *     iterator: types.ListIterator<T, TResult>,
     *     context?: any
     * ): TResult[];
     * export declare function map<T, TResult>(
     *     object: types.Dictionary<T>,
     *     iterator: types.ObjectIterator<T, TResult>,
     *     context?: any
     * ): TResult[];
     */

    /* eslint-disable no-unused-vars */

    /* dependencies
     * safeCb keys isArrLike types 
     */

    exports = function(obj, iterator, ctx) {
        iterator = safeCb(iterator, ctx);

        var _keys = !isArrLike(obj) && keys(obj);

        var len = (_keys || obj).length;
        var results = Array(len);

        for (var i = 0; i < len; i++) {
            var curKey = _keys ? _keys[i] : i;
            results[i] = iterator(obj[curKey], curKey, obj);
        }

        return results;
    };

    return exports;
})({});

/* ------------------------------ decodeUriComponent ------------------------------ */

export var decodeUriComponent = _.decodeUriComponent = (function (exports) {
    /* Better decodeURIComponent that does not throw if input is invalid.
     *
     * |Name  |Desc            |
     * |------|----------------|
     * |str   |String to decode|
     * |return|Decoded string  |
     */

    /* example
     * decodeUriComponent('%%25%'); // -> '%%%'
     * decodeUriComponent('%E0%A4%A'); // -> '\xE0\xA4%A'
     */

    /* typescript
     * export declare function decodeUriComponent(str: string): string;
     */

    /* dependencies
     * each ucs2 map utf8 
     */

    exports = function(str) {
        try {
            return decodeURIComponent(str);
        } catch (e) {
            var matches = str.match(regMatcher);

            if (!matches) {
                return str;
            }

            each(matches, function(match) {
                str = str.replace(match, decode(match));
            });
            return str;
        }
    };

    function decode(str) {
        str = str.split('%').slice(1);
        var bytes = map(str, hexToInt);
        str = ucs2.encode(bytes);
        str = utf8.decode(str, true);
        return str;
    }

    function hexToInt(numStr) {
        return +('0x' + numStr);
    }

    var regMatcher = /(%[a-f0-9]{2})+/gi;

    return exports;
})({});

/* ------------------------------ cookie ------------------------------ */

export var cookie = _.cookie = (function (exports) {
    /* Simple api for handling browser cookies.
     *
     * ### get
     *
     * Get cookie value.
     *
     * |Name  |Desc                      |
     * |------|--------------------------|
     * |key   |Cookie key                |
     * |return|Corresponding cookie value|
     *
     * ### set
     *
     * Set cookie value.
     *
     * |Name   |Desc          |
     * |-------|--------------|
     * |key    |Cookie key    |
     * |val    |Cookie value  |
     * |options|Cookie options|
     * |return |Module cookie |
     *
     * ### remove
     *
     * Remove cookie value.
     *
     * |Name   |Desc          |
     * |-------|--------------|
     * |key    |Cookie key    |
     * |options|Cookie options|
     * |return |Module cookie |
     */

    /* example
     * cookie.set('a', '1', {path: '/'});
     * cookie.get('a'); // -> '1'
     * cookie.remove('a');
     */

    /* typescript
     * export declare namespace cookie {
     *     interface IOptions {
     *         path?: string;
     *         expires?: number;
     *         domain?: string;
     *         secure?: boolean;
     *     }
     *     interface ICookie {
     *         get(key: string, options?: cookie.IOptions): string;
     *         set(key: string, val: string, options?: cookie.IOptions): ICookie;
     *         remove(key: string, options?: cookie.IOptions): ICookie;
     *     }
     * }
     * export declare const cookie: cookie.ICookie;
     */

    /* dependencies
     * defaults isNum isUndef decodeUriComponent 
     */

    var defOpts = {
        path: '/'
    };

    function setCookie(key, val, options) {
        if (!isUndef(val)) {
            options = options || {};
            options = defaults(options, defOpts);

            if (isNum(options.expires)) {
                var expires = new Date();
                expires.setMilliseconds(
                    expires.getMilliseconds() + options.expires * 864e5
                );
                options.expires = expires;
            }

            val = encodeURIComponent(val);
            key = encodeURIComponent(key);
            document.cookie = [
                key,
                '=',
                val,
                options.expires && '; expires=' + options.expires.toUTCString(),
                options.path && '; path=' + options.path,
                options.domain && '; domain=' + options.domain,
                options.secure ? '; secure' : ''
            ].join('');
            return exports;
        }

        var cookies = document.cookie ? document.cookie.split('; ') : [];
        var result = key ? undefined : {};

        for (var i = 0, len = cookies.length; i < len; i++) {
            var c = cookies[i];
            var parts = c.split('=');
            var name = decodeUriComponent(parts.shift());
            c = parts.join('=');
            c = decodeUriComponent(c);

            if (key === name) {
                result = c;
                break;
            }

            if (!key) result[name] = c;
        }

        return result;
    }

    exports = {
        get: setCookie,
        set: setCookie,
        remove: function(key, options) {
            options = options || {};
            options.expires = -1;
            return setCookie(key, '', options);
        }
    };

    return exports;
})({});

/* ------------------------------ toArr ------------------------------ */

export var toArr = _.toArr = (function (exports) {
    /* Convert value to an array.
     *
     * |Name  |Desc            |
     * |------|----------------|
     * |val   |Value to convert|
     * |return|Converted array |
     */

    /* example
     * toArr({a: 1, b: 2}); // -> [{a: 1, b: 2}]
     * toArr('abc'); // -> ['abc']
     * toArr(1); // -> [1]
     * toArr(null); // -> []
     */

    /* typescript
     * export declare function toArr(val: any): any[];
     */

    /* dependencies
     * isArrLike map isArr isStr 
     */

    exports = function(val) {
        if (!val) return [];
        if (isArr(val)) return val;
        if (isArrLike(val) && !isStr(val)) return map(val);
        return [val];
    };

    return exports;
})({});

/* ------------------------------ Class ------------------------------ */

export var Class = _.Class = (function (exports) {
    /* Create JavaScript class.
     *
     * |Name   |Desc                             |
     * |-------|---------------------------------|
     * |methods|Public methods                   |
     * [statics|Static methods                   |
     * |return |Function used to create instances|
     */

    /* example
     * const People = Class({
     *     initialize: function People(name, age) {
     *         this.name = name;
     *         this.age = age;
     *     },
     *     introduce: function () {
     *         return 'I am ' + this.name + ', ' + this.age + ' years old.';
     *     }
     * });
     *
     * const Student = People.extend({
     *     initialize: function Student(name, age, school) {
     *         this.callSuper(People, 'initialize', arguments);
     *
     *         this.school = school;
     *     },
     *     introduce: function () {
     *         return this.callSuper(People, 'introduce') + '\n I study at ' + this.school + '.';
     *     }
     * }, {
     *     is: function (obj) {
     *         return obj instanceof Student;
     *     }
     * });
     *
     * const a = new Student('allen', 17, 'Hogwarts');
     * a.introduce(); // -> 'I am allen, 17 years old. \n I study at Hogwarts.'
     * Student.is(a); // -> true
     */

    /* typescript
     * export declare namespace Class {
     *     class Base {
     *         toString(): string;
     *     }
     *     class IConstructor extends Base {
     *         constructor(...args: any[]);
     *         static extend(methods: any, statics: any): IConstructor;
     *         static inherits(Class: Function): void;
     *         static methods(methods: any): IConstructor;
     *         static statics(statics: any): IConstructor;
     *         [method: string]: any;
     *     }
     * }
     * export declare function Class(methods: any, statics?: any): Class.IConstructor;
     */

    /* dependencies
     * extend inherits safeGet
     */

    exports = function(methods, statics) {
        return Base.extend(methods, statics);
    };

    function makeClass(parent, methods, statics) {
        statics = statics || {};
        var className =
            methods.className || safeGet(methods, 'initialize.name') || '';
        delete methods.className;
        var ctor = function(...args) {
            return this.initialize && this.initialize(...args) || this;
        };

        inherits(ctor, parent);
        ctor.prototype.constructor = ctor;

        ctor.extend = function(methods, statics) {
            return makeClass(ctor, methods, statics);
        };

        ctor.inherits = function(Class) {
            inherits(ctor, Class);
        };

        ctor.methods = function(methods) {
            extend(ctor.prototype, methods);
            return ctor;
        };

        ctor.statics = function(statics) {
            extend(ctor, statics);
            return ctor;
        };

        ctor.methods(methods).statics(statics);
        return ctor;
    }

    var Base = (exports.Base = makeClass(Object, {
        className: 'Base',
        callSuper: function(parent, name, args) {
            var superMethod = parent.prototype[name];
            return superMethod.apply(this, args);
        },
        toString: function() {
            return this.constructor.name;
        }
    }));

    return exports;
})({});

/* ------------------------------ Enum ------------------------------ */

export var Enum = _.Enum = (function (exports) {
    /* Enum type implementation.
     *
     * ### constructor
     *
     * |Name|Desc            |
     * |----|----------------|
     * |arr |Array of strings|
     *
     * |Name|Desc                  |
     * |----|----------------------|
     * |obj |Pairs of key and value|
     */

    /* example
     * const importance = new Enum([
     *     'NONE', 'TRIVIAL', 'REGULAR', 'IMPORTANT', 'CRITICAL'
     * ]);
     * const val = 1;
     * if (val === importance.CRITICAL) {
     *     // Do something.
     * }
     */

    /* typescript
     * export declare class Enum {
     *     size: number;
     *     constructor(map: string[] | { [member: string]: any });
     *     [key: string]: any;
     * }
     */

    /* dependencies
     * Class freeze isArr each keys 
     */

    exports = Class({
        initialize: function Enum(map) {
            if (isArr(map)) {
                this.size = map.length;
                each(
                    map,
                    function(member, val) {
                        this[member] = val;
                    },
                    this
                );
            } else {
                this.size = keys(map).length;
                each(
                    map,
                    function(val, member) {
                        this[member] = val;
                    },
                    this
                );
            }

            freeze(this);
        }
    });

    return exports;
})({});

/* ------------------------------ MutationObserver ------------------------------ */

export var MutationObserver = _.MutationObserver = (function (exports) {
    /* Safe MutationObserver, does nothing if MutationObserver is not supported.
     */

    /* example
     * const observer = new MutationObserver(function (mutations) {
     *     // Do something.
     * });
     * observer.observe(document.documentElement);
     * observer.disconnect();
     */

    /* typescript
     */

    /* dependencies
     * Class 
     */

    exports =
        window.MutationObserver ||
        window.WebKitMutationObserver ||
        window.MozMutationObserver;

    if (!exports) {
        exports = Class({
            initialize: function MutationObserver() {},
            observe: function() {},
            disconnect: function() {},
            takeRecords: function() {}
        });
    }

    return exports;
})({});

/* ------------------------------ Select ------------------------------ */

export var Select = _.Select = (function (exports) {
    /* Simple wrapper of querySelectorAll to make dom selection easier.
     *
     * ### constructor
     *
     * |Name    |Desc               |
     * |--------|-------------------|
     * |selector|Dom selector string|
     *
     * ### find
     *
     * Get desdendants of current matched elements.
     *
     * |Name    |Desc               |
     * |--------|-------------------|
     * |selector|Dom selector string|
     *
     * ### each
     *
     * Iterate over matched elements.
     *
     * |Name|Desc                                |
     * |----|------------------------------------|
     * |fn  |Function to execute for each element|
     */

    /* example
     * const $test = new Select('#test');
     * $test.find('.test').each(function (idx, element) {
     *     // Manipulate dom nodes
     * });
     */

    /* typescript
     * export declare class Select {
     *     constructor(selector: string | Element);
     *     find(selector: string): Select;
     *     each(fn: Function): Select;
     * }
     */

    /* dependencies
     * Class isStr each 
     */

    exports = Class({
        className: 'Select',
        initialize: function(selector) {
            this.length = 0;
            if (!selector) return this;
            if (isStr(selector)) return rootSelect.find(selector);

            if (selector.nodeType) {
                this[0] = selector;
                this.length = 1;
            }
        },
        find: function(selector) {
            var ret = new exports();
            this.each(function() {
                mergeArr(ret, this.querySelectorAll(selector));
            });
            return ret;
        },
        each: function(fn) {
            each(this, function(element, idx) {
                fn.call(element, idx, element);
            });
            return this;
        }
    });
    var rootSelect = new exports(document);

    function mergeArr(first, second) {
        var len = second.length;
        var i = first.length;

        for (var j = 0; j < len; j++) {
            first[i++] = second[j];
        }

        first.length = i;
        return first;
    }

    return exports;
})({});

/* ------------------------------ $safeEls ------------------------------ */

export var $safeEls = _.$safeEls = (function (exports) {
    /* Convert value into an array, if it's a string, do querySelector.
     *
     * |Name  |Desc             |
     * |------|-----------------|
     * |val   |Value to convert |
     * |return|Array of elements|
     */

    /* example
     * $safeEls(document.querySelector('.test'));
     * $safeEls(document.querySelectorAll('.test'));
     * $safeEls('.test'); // -> Array of elements with test class
     */

    /* typescript
     * export declare namespace $safeEls {
     *     type El = Element | Element[] | NodeListOf<Element> | string;
     * }
     * export declare function $safeEls(val: $safeEls.El): Element[];
     */

    /* dependencies
     * isStr toArr Select 
     */

    exports = function(val) {
        return toArr(isStr(val) ? new Select(val) : val);
    };

    return exports;
})({});

/* ------------------------------ $attr ------------------------------ */

export var $attr = _.$attr = (function (exports) {
    /* Element attribute manipulation.
     *
     * Get the value of an attribute for the first element in the set of matched elements.
     *
     * |Name   |Desc                            |
     * |-------|--------------------------------|
     * |element|Elements to manipulate          |
     * |name   |Attribute name                  |
     * |return |Attribute value of first element|
     *
     * Set one or more attributes for the set of matched elements.
     *
     * |Name   |Desc                  |
     * |-------|----------------------|
     * |element|Elements to manipulate|
     * |name   |Attribute name        |
     * |val    |Attribute value       |
     *
     * |Name      |Desc                                  |
     * |----------|--------------------------------------|
     * |element   |Elements to manipulate                |
     * |attributes|Object of attribute-value pairs to set|
     *
     * ### remove
     *
     * Remove an attribute from each element in the set of matched elements.
     *
     * |Name   |Desc                  |
     * |-------|----------------------|
     * |element|Elements to manipulate|
     * |name   |Attribute name        |
     */

    /* example
     * $attr('#test', 'attr1', 'test');
     * $attr('#test', 'attr1'); // -> test
     * $attr.remove('#test', 'attr1');
     * $attr('#test', {
     *     'attr1': 'test',
     *     'attr2': 'test'
     * });
     */

    /* typescript
     * export declare namespace $attr {
     *     function remove(element: $safeEls.El, name: string): void;
     * }
     * export declare function $attr(
     *     element: $safeEls.El,name: string,
     *     value: string
     * ): void;
     * export declare function $attr(
     *     element: $safeEls.El,
     *     attributes: { [name: string]: string }
     * ): void;
     * export declare function $attr(element: $safeEls.El, name: string): string;
     */

    /* dependencies
     * toArr isObj isStr each isUndef $safeEls 
     */

    exports = function(els, name, val) {
        els = $safeEls(els);
        var isGetter = isUndef(val) && isStr(name);
        if (isGetter) return getAttr(els[0], name);
        var attrs = name;

        if (!isObj(attrs)) {
            attrs = {};
            attrs[name] = val;
        }

        setAttr(els, attrs);
    };

    exports.remove = function(els, names) {
        els = $safeEls(els);
        names = toArr(names);
        each(els, function(node) {
            each(names, function(name) {
                node.removeAttribute(name);
            });
        });
    };

    function getAttr(el, name) {
        return el.getAttribute(name);
    }

    function setAttr(els, attrs) {
        each(els, function(el) {
            each(attrs, function(val, name) {
                el.setAttribute(name, val);
            });
        });
    }

    return exports;
})({});

/* ------------------------------ $css ------------------------------ */

export var $css = _.$css = (function (exports) {
    /* Element css manipulation.
     *
     * Get the computed style properties for the first element in the set of matched elements.
     *
     * |Name   |Desc                      |
     * |-------|--------------------------|
     * |element|Elements to manipulate    |
     * |name   |Property name             |
     * |return |Css value of first element|
     *
     * Set one or more CSS properties for the set of matched elements.
     *
     * |Name   |Desc                  |
     * |-------|----------------------|
     * |element|Elements to manipulate|
     * |name   |Property name         |
     * |val    |Css value             |
     *
     * |Name      |Desc                            |
     * |----------|--------------------------------|
     * |element   |Elements to manipulate          |
     * |properties|Object of css-value pairs to set|
     */

    /* example
     * $css('#test', {
     *     color: '#fff',
     *     background: 'black'
     * });
     * $css('#test', 'display', 'block');
     * $css('#test', 'color'); // -> #fff
     */

    /* typescript
     * export declare function $css(element: $safeEls.El, name: string): string;
     * export declare function $css(element: $safeEls.El, name: string, val: string): void;
     * export declare function $css(
     *     element: $safeEls.El,
     *     properties: { [name: string]: string }
     * ): void;
     */

    /* dependencies
     * isStr isObj kebabCase isUndef contain isNum $safeEls prefix each 
     */

    exports = function(nodes, name, val) {
        nodes = $safeEls(nodes);
        var isGetter = isUndef(val) && isStr(name);
        if (isGetter) return getCss(nodes[0], name);
        var css = name;

        if (!isObj(css)) {
            css = {};
            css[name] = val;
        }

        setCss(nodes, css);
    };

    function getCss(node, name) {
        return (
            node.style[prefix(name)] ||
            getComputedStyle(node, '').getPropertyValue(name)
        );
    }

    function setCss(nodes, css) {
        each(nodes, function(node) {
            var cssText = ';';
            each(css, function(val, key) {
                key = prefix.dash(key);
                cssText += key + ':' + addPx(key, val) + ';';
            });
            node.style.cssText += cssText;
        });
    }

    var cssNumProps = [
        'column-count',
        'columns',
        'font-weight',
        'line-weight',
        'opacity',
        'z-index',
        'zoom'
    ];

    function addPx(key, val) {
        var needPx = isNum(val) && !contain(cssNumProps, kebabCase(key));
        return needPx ? val + 'px' : val;
    }

    return exports;
})({});

/* ------------------------------ $data ------------------------------ */

export var $data = _.$data = (function (exports) {
    /* Wrapper of $attr, adds data- prefix to keys.
     */

    /* example
     * $data('#test', 'attr1', 'eustia');
     */

    /* typescript
     * export declare function $data(
     *     element: $safeEls.El,
     *     name: string,
     *     value: string
     * ): void;
     * export declare function $data(
     *     element: $safeEls.El,
     *     attributes: { [name: string]: string }
     * ): void;
     * export declare function $data(element: $safeEls.El, name: string): string;
     */

    /* eslint-disable no-unused-vars */

    /* dependencies
     * $attr isStr isObj each $safeEls 
     */

    exports = function(nodes, name, val) {
        var dataName = name;
        if (isStr(name)) dataName = 'data-' + name;

        if (isObj(name)) {
            dataName = {};
            each(name, function(val, key) {
                dataName['data-' + key] = val;
            });
        }

        return $attr(nodes, dataName, val);
    };

    return exports;
})({});

/* ------------------------------ $insert ------------------------------ */

export var $insert = _.$insert = (function (exports) {
    /* Insert html on different position.
     *
     * ### before
     *
     * Insert content before elements.
     *
     * ### after
     *
     * Insert content after elements.
     *
     * ### prepend
     *
     * Insert content to the beginning of elements.
     *
     * ### append
     *
     * Insert content to the end of elements.
     *
     * |Name   |Desc                  |
     * |-------|----------------------|
     * |element|Elements to manipulate|
     * |content|Html strings          |
     */

    /* example
     * // <div id="test"><div class="mark"></div></div>
     * $insert.before('#test', '<div>licia</div>');
     * // -> <div>licia</div><div id="test"><div class="mark"></div></div>
     * $insert.after('#test', '<div>licia</div>');
     * // -> <div id="test"><div class="mark"></div></div><div>licia</div>
     * $insert.prepend('#test', '<div>licia</div>');
     * // -> <div id="test"><div>licia</div><div class="mark"></div></div>
     * $insert.append('#test', '<div>licia</div>');
     * // -> <div id="test"><div class="mark"></div><div>licia</div></div>
     */

    /* typescript
     * export declare namespace $insert {
     *     type IInsert = (element: $safeEls.El, content: string) => void;
     * }
     * export declare const $insert: {
     *     before: $insert.IInsert;
     *     after: $insert.IInsert;
     *     append: $insert.IInsert;
     *     prepend: $insert.IInsert;
     * };
     */

    /* dependencies
     * each $safeEls 
     */

    exports = {
        before: insertFactory('beforebegin'),
        after: insertFactory('afterend'),
        append: insertFactory('beforeend'),
        prepend: insertFactory('afterbegin')
    };

    function insertFactory(type) {
        return function(nodes, val) {
            nodes = $safeEls(nodes);
            each(nodes, function(node) {
                node.insertAdjacentHTML(type, val);
            });
        };
    }

    return exports;
})({});

/* ------------------------------ $offset ------------------------------ */

export var $offset = _.$offset = (function (exports) {
    /* Get the position of the element in document.
     *
     * |Name   |Desc                  |
     * |-------|----------------------|
     * |element|Elements to get offset|
     * |return |Element position      |
     */

    /* example
     * $offset('#test'); // -> {left: 0, top: 0, width: 0, height: 0}
     */

    /* typescript
     * export declare namespace $offset {
     *     interface IOffset {
     *         left: number;
     *         top: number;
     *         width: number;
     *         height: number;
     *     }
     * }
     * export declare function $offset(element: $safeEls.El): $offset.IOffset;
     */

    /* dependencies
     * $safeEls 
     */

    exports = function(els) {
        els = $safeEls(els);
        var el = els[0];
        var clientRect = el.getBoundingClientRect();
        return {
            left: clientRect.left + window.pageXOffset,
            top: clientRect.top + window.pageYOffset,
            width: Math.round(clientRect.width),
            height: Math.round(clientRect.height)
        };
    };

    return exports;
})({});

/* ------------------------------ $property ------------------------------ */

export var $property = _.$property = (function (exports) {
    /* Element property html, text, val getter and setter.
     *
     * ### html
     *
     * Get the HTML contents of the first element in the set of matched elements or
     * set the HTML contents of every matched element.
     *
     * ### text
     *
     * Get the combined text contents of each element in the set of matched
     * elements, including their descendants, or set the text contents of the
     * matched elements.
     *
     * ### val
     *
     * Get the current value of the first element in the set of matched elements or
     * set the value of every matched element.
     */

    /* example
     * $property.html('#test', 'licia');
     * $property.html('#test'); // -> licia
     */

    /* typescript
     * export declare namespace $property {
     *     interface IProperty {
     *         (element: $safeEls.El, value: string): void;
     *         (element: $safeEls.El): string;
     *     }
     * }
     * export declare const $property: {
     *     html: $property.IProperty;
     *     val: $property.IProperty;
     *     text: $property.IProperty;
     * };
     */

    /* dependencies
     * isUndef each $safeEls 
     */

    exports = {
        html: propFactory('innerHTML'),
        text: propFactory('textContent'),
        val: propFactory('value')
    };

    function propFactory(name) {
        return function(nodes, val) {
            nodes = $safeEls(nodes);
            var node = nodes[0];

            if (isUndef(val)) {
                return node ? node[name] : '';
            }

            if (!node) return;
            each(nodes, function(node) {
                node[name] = val;
            });
        };
    }

    return exports;
})({});

/* ------------------------------ $remove ------------------------------ */

export var $remove = _.$remove = (function (exports) {
    /* Remove the set of matched elements from the DOM.
     *
     * |Name   |Desc              |
     * |-------|------------------|
     * |element|Elements to delete|
     */

    /* example
     * $remove('#test');
     */

    /* typescript
     * export declare function $remove(element: $safeEls.El);
     */

    /* dependencies
     * each $safeEls 
     */

    exports = function(els) {
        els = $safeEls(els);
        each(els, function(el) {
            var parent = el.parentNode;
            if (parent) parent.removeChild(el);
        });
    };

    return exports;
})({});

/* ------------------------------ $show ------------------------------ */

export var $show = _.$show = (function (exports) {
    /* Show elements.
     *
     * |Name   |Desc            |
     * |-------|----------------|
     * |element|Elements to show|
     */

    /* example
     * $show('#test');
     */

    /* typescript
     * export declare function $show(element: $safeEls.El): void;
     */

    /* dependencies
     * each $safeEls 
     */

    exports = function(els) {
        els = $safeEls(els);
        each(els, function(el) {
            if (isHidden(el)) {
                el.style.display = getDefDisplay(el.nodeName);
            }
        });
    };

    function isHidden(el) {
        return getComputedStyle(el, '').getPropertyValue('display') == 'none';
    }

    var elDisplay = {};

    function getDefDisplay(elName) {
        var el, display;

        if (!elDisplay[elName]) {
            el = document.createElement(elName);
            document.documentElement.appendChild(el);
            display = getComputedStyle(el, '').getPropertyValue('display');
            el.parentNode.removeChild(el);
            display == 'none' && (display = 'block');
            elDisplay[elName] = display;
        }

        return elDisplay[elName];
    }

    return exports;
})({});

/* ------------------------------ Stack ------------------------------ */

export var Stack = _.Stack = (function (exports) {
    /* Stack data structure.
     *
     * ### size
     *
     * Stack size.
     *
     * ### clear
     *
     * Clear the stack.
     *
     * ### push
     *
     * Add an item to the stack.
     *
     * |Name  |Desc        |
     * |------|------------|
     * |item  |Item to add |
     * |return|Current size|
     *
     * ### pop
     *
     * Get the last item of the stack.
     *
     * ### peek
     *
     * Get the last item without removing it.
     *
     * ### forEach
     *
     * Iterate over the stack.
     *
     * |Name    |Desc                      |
     * |--------|--------------------------|
     * |iterator|Function invoked iteration|
     * |ctx     |Function context          |
     *
     * ### toArr
     *
     * Convert the stack to a JavaScript array.
     */

    /* example
     * const stack = new Stack();
     *
     * stack.push(2); // -> 1
     * stack.push(3); // -> 2
     * stack.pop(); // -> 3
     */

    /* typescript
     * export declare class Stack {
     *     size: number;
     *     clear(): void;
     *     push(item: any): number;
     *     pop(): any;
     *     peek(): any;
     *     forEach(iterator: Function, context?: any): void;
     *     toArr(): any[];
     * }
     */

    /* dependencies
     * Class reverse 
     */

    exports = Class({
        initialize: function Stack() {
            this.clear();
        },
        clear: function() {
            this._items = [];
            this.size = 0;
        },
        push: function(item) {
            this._items.push(item);

            return ++this.size;
        },
        pop: function() {
            if (!this.size) return;
            this.size--;
            return this._items.pop();
        },
        peek: function() {
            return this._items[this.size - 1];
        },
        forEach: function(iterator, ctx) {
            ctx = arguments.length > 1 ? ctx : this;
            var items = this._items;

            for (var i = this.size - 1, j = 0; i >= 0; i--, j++) {
                iterator.call(ctx, items[i], j, this);
            }
        },
        toArr: function() {
            return reverse(this._items);
        }
    });

    return exports;
})({});

/* ------------------------------ delegate ------------------------------ */

export var delegate = _.delegate = (function (exports) {
    /* Event delegation.
     *
     * ### add
     *
     * Add event delegation.
     *
     * |Name    |Desc          |
     * |--------|--------------|
     * |el      |Parent element|
     * |type    |Event type    |
     * |selector|Match selector|
     * |cb      |Event callback|
     *
     * ### remove
     *
     * Remove event delegation.
     */

    /* example
     * const container = document.getElementById('container');
     * function clickHandler() {
     *     // Do something...
     * }
     * delegate.add(container, 'click', '.children', clickHandler);
     * delegate.remove(container, 'click', '.children', clickHandler);
     */

    /* typescript
     * export declare const delegate: {
     *     add(el: Element, type: string, selector: string, cb: Function): void;
     *     remove(el: Element, type: string, selector: string, cb: Function): void;
     * };
     */

    /* dependencies
     * Class contain 
     */

    function retTrue() {
        return true;
    }

    function retFalse() {
        return false;
    }

    function trigger(e) {
        var handlers = this.events[e.type];
        var handler;
        var handlerQueue = formatHandlers.call(this, e, handlers);
        e = new exports.Event(e);
        var i = 0,
            j,
            matched,
            ret;

        while ((matched = handlerQueue[i++]) && !e.isPropagationStopped()) {
            e.curTarget = matched.el;
            j = 0;

            while (
                (handler = matched.handlers[j++]) &&
                !e.isImmediatePropagationStopped()
            ) {
                ret = handler.handler.apply(matched.el, [e]);

                if (ret === false) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }
    }

    function formatHandlers(e, handlers) {
        var current = e.target;
        var ret = [];
        var delegateCount = handlers.delegateCount;
        var selector;
        var matches;
        var handler;
        var i;

        if (current.nodeType) {
            for (; current !== this; current = current.parentNode || this) {
                matches = [];

                for (i = 0; i < delegateCount; i++) {
                    handler = handlers[i];
                    selector = handler.selector + ' ';

                    if (matches[selector] === undefined) {
                        matches[selector] = contain(
                            this.querySelectorAll(selector),
                            current
                        );
                    }

                    if (matches[selector]) matches.push(handler);
                }

                if (matches.length)
                    ret.push({
                        el: current,
                        handlers: matches
                    });
            }
        }

        if (delegateCount < handlers.length) {
            ret.push({
                el: this,
                handlers: handlers.slice(delegateCount)
            });
        }

        return ret;
    }

    exports = {
        add: function(el, type, selector, fn) {
            var handler = {
                selector: selector,
                handler: fn
            };
            var handlers;
            if (!el.events) el.events = {};

            if (!(handlers = el.events[type])) {
                handlers = el.events[type] = [];
                handlers.delegateCount = 0;
                el.addEventListener(
                    type,
                    function() {
                        trigger.apply(el, arguments);
                    },
                    false
                );
            }

            selector
                ? handlers.splice(handlers.delegateCount++, 0, handler)
                : handlers.push(handler);
        },
        remove: function(el, type, selector, fn) {
            var events = el.events;
            if (!events || !events[type]) return;
            var handlers = events[type];
            var i = handlers.length;
            var handler;

            while (i--) {
                handler = handlers[i];

                if (
                    (!selector || handler.selector == selector) &&
                    handler.handler == fn
                ) {
                    handlers.splice(i, 1);

                    if (handler.selector) {
                        handlers.delegateCount--;
                    }
                }
            }
        },
        Event: Class({
            className: 'Event',
            initialize: function Event(e) {
                this.origEvent = e;
            },
            isDefaultPrevented: retFalse,
            isPropagationStopped: retFalse,
            isImmediatePropagationStopped: retFalse,
            preventDefault: function() {
                var e = this.origEvent;
                this.isDefaultPrevented = retTrue;
                if (e && e.preventDefault) e.preventDefault();
            },
            stopPropagation: function() {
                var e = this.origEvent;
                this.isPropagationStopped = retTrue;
                if (e && e.stopPropagation) e.stopPropagation();
            },
            stopImmediatePropagation: function() {
                var e = this.origEvent;
                this.isImmediatePropagationStopped = retTrue;
                if (e && e.stopImmediatePropagation) e.stopImmediatePropagation();
                this.stopPropagation();
            }
        })
    };

    return exports;
})({});

/* ------------------------------ $event ------------------------------ */

export var $event = _.$event = (function (exports) {
    /* bind events to certain dom elements.
     */

    /* example
     * function clickHandler() {
     *     // Do something...
     * }
     * $event.on('#test', 'click', clickHandler);
     * $event.off('#test', 'click', clickHandler);
     */

    /* typescript
     * export declare const $event: {
     *     on(
     *         element: $safeEls.El,
     *         event: string,
     *         selector: string,
     *         handler: Function
     *     ): void;
     *     on(element: $safeEls.El, event: string, handler: Function): void;
     *     off(
     *         element: $safeEls.El,
     *         event: string,
     *         selector: string,
     *         handler: Function
     *     ): void;
     *     off(element: $safeEls.El, event: string, handler: Function): void;
     * };
     */

    /* dependencies
     * delegate isUndef $safeEls each 
     */

    exports = {
        on: eventFactory('add'),
        off: eventFactory('remove')
    };

    function eventFactory(type) {
        return function(nodes, event, selector, handler) {
            nodes = $safeEls(nodes);

            if (isUndef(handler)) {
                handler = selector;
                selector = undefined;
            }

            each(nodes, function(node) {
                delegate[type](node, event, selector, handler);
            });
        };
    }

    return exports;
})({});

/* ------------------------------ concat ------------------------------ */

export var concat = _.concat = (function (exports) {
    /* Concat multiple arrays into a single array.
     *
     * |Name  |Desc              |
     * |------|------------------|
     * |...arr|Arrays to concat  |
     * |return|Concatenated array|
     */

    /* example
     * concat([1, 2], [3], [4, 5]); // -> [1, 2, 3, 4, 5]
     */

    /* typescript
     * export declare function concat(...args: Array<any[]>): any[];
     */

    /* dependencies
     * toArr 
     */

    exports = function() {
        var args = toArr(arguments);
        var ret = [];

        for (var i = 0, len = args.length; i < len; i++) {
            ret = ret.concat(toArr(args[i]));
        }

        return ret;
    };

    return exports;
})({});

/* ------------------------------ mapObj ------------------------------ */

export var mapObj = _.mapObj = (function (exports) {
    /* Map for objects.
     *
     * |Name    |Desc                          |
     * |--------|------------------------------|
     * |object  |Object to iterate over        |
     * |iterator|Function invoked per iteration|
     * |context |Function context              |
     * |return  |New mapped object             |
     */

    /* example
     * mapObj({a: 1, b: 2}, function (val, key) { return val + 1 }); // -> {a: 2, b: 3}
     */

    /* typescript
     * export declare function mapObj<T, TResult>(
     *     object: types.Dictionary<T>,
     *     iterator: types.ObjectIterator<T, TResult>,
     *     context?: any
     * ): types.Dictionary<TResult>;
     */

    /* eslint-disable no-unused-vars */

    /* dependencies
     * safeCb keys types 
     */

    exports = function(obj, iterator, ctx) {
        iterator = safeCb(iterator, ctx);

        var _keys = keys(obj);

        var len = _keys.length;
        var ret = {};

        for (var i = 0; i < len; i++) {
            var curKey = _keys[i];
            ret[curKey] = iterator(obj[curKey], curKey, obj);
        }

        return ret;
    };

    return exports;
})({});

/* ------------------------------ cloneDeep ------------------------------ */

export var cloneDeep = _.cloneDeep = (function (exports) {
    /* Recursively clone value.
     *
     * |Name  |Desc             |
     * |------|-----------------|
     * |val   |Value to clone   |
     * |return|Deep cloned Value|
     */

    /* example
     * const obj = [{a: 1}, {a: 2}];
     * const obj2 = cloneDeep(obj);
     * console.log(obj[0] === obj2[1]); // -> false
     */

    /* typescript
     * export declare function cloneDeep<T>(val: T): T;
     */

    /* dependencies
     * isObj isFn isArr mapObj 
     */

    exports = function(obj) {
        if (isArr(obj)) {
            return obj.map(function(val) {
                return exports(val);
            });
        }

        if (isObj(obj) && !isFn(obj)) {
            return mapObj(obj, function(val) {
                return exports(val);
            });
        }

        return obj;
    };

    return exports;
})({});

/* ------------------------------ some ------------------------------ */

export var some = _.some = (function (exports) {
    /* Check if predicate return truthy for any element.
     *
     * |Name     |Desc                                          |
     * |---------|----------------------------------------------|
     * |obj      |Collection to iterate over                    |
     * |predicate|Function to invoked per iteration             |
     * |ctx      |Predicate context                             |
     * |return   |True if any element passes the predicate check|
     */

    /* example
     * some([2, 5], function (val) {
     *     return val % 2 === 0;
     * }); // -> true
     */

    /* typescript
     * export declare function some<T>(
     *     list: types.List<T>,
     *     iterator?: types.ListIterator<T, boolean>,
     *     context?: any
     * ): boolean;
     * export declare function some<T>(
     *     object: types.Dictionary<T>,
     *     iterator?: types.ObjectIterator<T, boolean>,
     *     context?: any
     * ): boolean;
     */

    /* eslint-disable no-unused-vars */

    /* dependencies
     * safeCb isArrLike keys types 
     */

    exports = function(obj, predicate, ctx) {
        predicate = safeCb(predicate, ctx);

        var _keys = !isArrLike(obj) && keys(obj);

        var len = (_keys || obj).length;

        for (var i = 0; i < len; i++) {
            var key = _keys ? _keys[i] : i;
            if (predicate(obj[key], key, obj)) return true;
        }

        return false;
    };

    return exports;
})({});

/* ------------------------------ $class ------------------------------ */

export var $class = _.$class = (function (exports) {
    /* Element class manipulations.
     *
     * ### add
     *
     * Add the specified class(es) to each element in the set of matched elements.
     *
     * |Name   |Desc                  |
     * |-------|----------------------|
     * |element|Elements to manipulate|
     * |names  |Classes to add        |
     *
     * ### has
     *
     * Determine whether any of the matched elements are assigned the given class.
     *
     * |Name   |Desc                                 |
     * |-------|-------------------------------------|
     * |element|Elements to manipulate               |
     * |name   |Class name                           |
     * |return |True if elements has given class name|
     *
     * ### toggle
     *
     * Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the state argument.
     *
     * |Name   |Desc                  |
     * |-------|----------------------|
     * |element|Elements to manipulate|
     * |name   |Class name to toggle  |
     *
     * ### remove
     *
     * Remove a single class, multiple classes, or all classes from each element in the set of matched elements.
     *
     * |Name   |Desc                  |
     * |-------|----------------------|
     * |element|Elements to manipulate|
     * |name   |Class names to remove |
     */

    /* example
     * $class.add('#test', 'class1');
     * $class.add('#test', ['class1', 'class2']);
     * $class.has('#test', 'class1'); // -> true
     * $class.remove('#test', 'class1');
     * $class.has('#test', 'class1'); // -> false
     * $class.toggle('#test', 'class1');
     * $class.has('#test', 'class1'); // -> true
     */

    /* typescript
     * export declare const $class: {
     *     add(element: $safeEls.El, name: string | string[]): void;
     *     has(element: $safeEls.El, name: string): boolean;
     *     toggle(element: $safeEls.El, name: string): void;
     *     remove(element: $safeEls.El, name: string): void;
     * };
     */

    /* dependencies
     * toArr some $safeEls isStr each 
     */

    exports = {
        add: function(els, name) {
            els = $safeEls(els);
            var names = safeName(name);
            each(els, function(el) {
                var classList = [];
                each(names, function(name) {
                    if (!exports.has(el, name)) classList.push(name);
                });

                if (classList.length !== 0) {
                    el.className += (el.className ? ' ' : '') + classList.join(' ');
                }
            });
        },
        has: function(els, name) {
            els = $safeEls(els);
            var regName = new RegExp('(^|\\s)' + name + '(\\s|$)');
            return some(els, function(el) {
                return regName.test(el.className);
            });
        },
        toggle: function(els, name) {
            els = $safeEls(els);
            each(els, function(el) {
                if (!exports.has(el, name)) return exports.add(el, name);
                exports.remove(el, name);
            });
        },
        remove: function(els, name) {
            els = $safeEls(els);
            var names = safeName(name);
            each(els, function(el) {
                each(names, function(name) {
                    el.classList.remove(name);
                });
            });
        }
    };

    function safeName(name) {
        return isStr(name) ? name.split(/\s+/) : toArr(name);
    }

    return exports;
})({});

/* ------------------------------ $ ------------------------------ */

export var $ = _.$ = (function (exports) {
    /* jQuery like style dom manipulator.
     *
     * ### Available methods
     *
     * offset, hide, show, first, last, get, eq, on, off, html, text, val, css, attr,
     * data, rmAttr, remove, addClass, rmClass, toggleClass, hasClass, append, prepend,
     * before, after
     */

    /* example
     * const $btn = $('#btn');
     * $btn.html('eustia');
     * $btn.addClass('btn');
     * $btn.show();
     * $btn.on('click', function () {
     *     // Do something...
     * });
     */

    /* typescript
     * export declare namespace $ {
     *     class $ extends Select {
     *         find(selector: string): $;
     *         each(fn: Function): $;
     *         offset(): $offset.IOffset;
     *         hide(): $;
     *         show(): $;
     *         first(): $;
     *         last(): $;
     *         get(index: number): Element;
     *         eq(index: number): Element;
     *         on(event: string, selector: string, handler: Function): $;
     *         on(event: string, handler: Function): $;
     *         off(event: string, selector: string, handler: Function): $;
     *         off(event: string, handler: Function): $;
     *         html(): string;
     *         html(value: string): $;
     *         text(): string;
     *         text(value: string): $;
     *         val(): string;
     *         val(value: string): $;
     *         css(name: string): string;
     *         css(name: string, value: string): $;
     *         css(properties: { [name: string]: string }): $;
     *         attr(name: string): string;
     *         attr(name: string, value: string): $;
     *         attr(attributes: { [name: string]: string }): $;
     *         data(name: string): string;
     *         data(name: string, value: string): $;
     *         data(attributes: { [name: string]: string }): $;
     *         rmAttr(name: string): $;
     *         remove(): $;
     *         addClass(name: string | string[]): $;
     *         rmClass(name: string): $;
     *         toggleClass(name: string): $;
     *         hasClass(name: string): boolean;
     *         parent(): $;
     *         append(content: string): $;
     *         prepend(content: string): $;
     *         before(content: string): $;
     *         after(content: string): $;
     *     }
     * }
     * declare function $(selector: string | Element): $.$;
     */

    /* dependencies
     * Select $offset $show $css $attr $property last $remove $data $event $class $insert isUndef isStr 
     */

    exports = function(selector) {
        return new Select(selector);
    };

    Select.methods({
        offset: function() {
            return $offset(this);
        },
        hide: function() {
            return this.css('display', 'none');
        },
        show: function() {
            $show(this);
            return this;
        },
        first: function() {
            return exports(this[0]);
        },
        last: function() {
            return exports(last(this));
        },
        get: function(idx) {
            return this[idx];
        },
        eq: function(idx) {
            return exports(this[idx]);
        },
        on: function(event, selector, handler) {
            $event.on(this, event, selector, handler);
            return this;
        },
        off: function(event, selector, handler) {
            $event.off(this, event, selector, handler);
            return this;
        },
        html: function(val) {
            var result = $property.html(this, val);
            if (isUndef(val)) return result;
            return this;
        },
        text: function(val) {
            var result = $property.text(this, val);
            if (isUndef(val)) return result;
            return this;
        },
        val: function(val) {
            var result = $property.val(this, val);
            if (isUndef(val)) return result;
            return this;
        },
        css: function(name, val) {
            var result = $css(this, name, val);
            if (isGetter(name, val)) return result;
            return this;
        },
        attr: function(name, val) {
            var result = $attr(this, name, val);
            if (isGetter(name, val)) return result;
            return this;
        },
        data: function(name, val) {
            var result = $data(this, name, val);
            if (isGetter(name, val)) return result;
            return this;
        },
        rmAttr: function(name) {
            $attr.remove(this, name);
            return this;
        },
        remove: function() {
            $remove(this);
            return this;
        },
        addClass: function(name) {
            $class.add(this, name);
            return this;
        },
        rmClass: function(name) {
            $class.remove(this, name);
            return this;
        },
        toggleClass: function(name) {
            $class.toggle(this, name);
            return this;
        },
        hasClass: function(name) {
            return $class.has(this, name);
        },
        parent: function() {
            return exports(this[0].parentNode);
        },
        append: function(val) {
            $insert.append(this, val);
            return this;
        },
        prepend: function(val) {
            $insert.prepend(this, val);
            return this;
        },
        before: function(val) {
            $insert.before(this, val);
            return this;
        },
        after: function(val) {
            $insert.after(this, val);
            return this;
        }
    });

    var isGetter = function(name, val) {
        return isUndef(val) && isStr(name);
    };

    return exports;
})({});

/* ------------------------------ memStorage ------------------------------ */

export var memStorage = _.memStorage = (function (exports) {
    /* Memory-backed implementation of the Web Storage API.
     *
     * A replacement for environments where localStorage or sessionStorage is not available.
     */

    /* example
     * const localStorage = window.localStorage || memStorage;
     * localStorage.setItem('test', 'licia');
     */

    /* typescript
     * export declare const memStorage: typeof window.localStorage;
     */

    /* dependencies
     * keys 
     */

    exports = {
        getItem: function(key) {
            return (API_KEYS[key] ? cloak[key] : this[key]) || null;
        },
        setItem: function(key, val) {
            API_KEYS[key] ? (cloak[key] = val) : (this[key] = val);
        },
        removeItem: function(key) {
            API_KEYS[key] ? delete cloak[key] : delete this[key];
        },
        key: function(i) {
            var keys = enumerableKeys();
            return i >= 0 && i < keys.length ? keys[i] : null;
        },
        clear: function() {
            var keys = uncloakedKeys();
            /* eslint-disable no-cond-assign */

            for (var i = 0, key; (key = keys[i]); i++) {
                delete this[key];
            }

            keys = cloakedKeys();
            /* eslint-disable no-cond-assign */

            for (var _i = 0, _key; (_key = keys[_i]); _i++) {
                delete cloak[_key];
            }
        }
    };
    Object.defineProperty(exports, 'length', {
        enumerable: false,
        configurable: true,
        get: function() {
            return enumerableKeys().length;
        }
    });
    var cloak = {};
    var API_KEYS = {
        getItem: 1,
        setItem: 1,
        removeItem: 1,
        key: 1,
        clear: 1,
        length: 1
    };

    function enumerableKeys() {
        return uncloakedKeys().concat(cloakedKeys());
    }

    function uncloakedKeys() {
        return keys(exports).filter(function(key) {
            return !API_KEYS[key];
        });
    }

    function cloakedKeys() {
        return keys(cloak);
    }

    return exports;
})({});

/* ------------------------------ safeStorage ------------------------------ */

export var safeStorage = _.safeStorage = (function (exports) {
    /* Use storage safely in safari private browsing and older browsers.
     *
     * |Name        |Desc             |
     * |------------|-----------------|
     * |type='local'|local or session |
     * |return      |Specified storage|
     */

    /* example
     * const localStorage = safeStorage('local');
     * localStorage.setItem('licia', 'util');
     */

    /* typescript
     * export declare function safeStorage(type?: string): typeof window.localStorage;
     */

    /* dependencies
     * memStorage 
     */

    exports = function(type) {
        type = type || 'local';
        var ret;

        switch (type) {
            case 'local':
                ret = window.localStorage;
                break;

            case 'session':
                ret = window.sessionStorage;
                break;
        }

        try {
            // Safari private browsing
            var x = 'test-localStorage-' + Date.now();
            ret.setItem(x, x);
            var y = ret.getItem(x);
            ret.removeItem(x);
            if (y !== x) throw new Error();
        } catch (e) {
            return memStorage;
        }

        return ret;
    };

    return exports;
})({});

/* ------------------------------ meta ------------------------------ */

export var meta = _.meta = (function (exports) {
    /* Document meta manipulation, turn name and content into key value pairs.
     *
     * Get meta content with given name. If name is omitted, all pairs will be return.
     *
     * |Name  |Desc        |
     * |------|------------|
     * |name  |Meta name   |
     * |return|Meta content|
     *
     * Set meta content.
     *
     * |Name   |Desc        |
     * |-------|------------|
     * |name   |Meta name   |
     * |content|Meta content|
     *
     * |Name |Desc                        |
     * |-----|----------------------------|
     * |metas|Object of name content pairs|
     *
     * ### remove
     *
     * Remove metas.
     *
     * |Name|Desc     |
     * |----|---------|
     * |name|Meta name|
     */

    /* example
     * // <meta name="a" content="1"/> <meta name="b" content="2"/> <meta name="c" content="3"/>
     * meta(); // -> {a: '1', b: '2', c: '3'}
     * meta('a'); // -> '1'
     * meta(['a', 'c']); // -> {a: '1', c: '3'}
     * meta('d', '4');
     * meta({
     *     d: '5',
     *     e: '6',
     *     f: '7'
     * });
     * meta.remove('d');
     * meta.remove(['e', 'f']);
     */

    /* typescript
     * export declare namespace meta {
     *     function remove(nameList: string | string[]): void;
     * }
     * export declare function meta(): {};
     * export declare function meta(key: string): string;
     * export declare function meta(keys: string[]): {};
     * export declare function meta(key, value): void;
     * export declare function meta(pairs: {}): void;
     */

    /* dependencies
     * each isStr isUndef contain isArr isObj toArr 
     */

    exports = function(name, content) {
        if (isUndef(name)) return getAllMeta();
        var isGetter = (isStr(name) && isUndef(content)) || isArr(name);
        if (isGetter) return getMeta(name);
        var metas = name;

        if (!isObj(metas)) {
            metas = {};
            metas[name] = content;
        }

        setMeta(metas);
    };

    exports.remove = function(nameList) {
        nameList = toArr(nameList);
        each(nameList, function(name) {
            var meta = selectMeta(name);
            if (meta) doc.head.removeChild(meta);
        });
    };

    var doc = document;

    function getAllMeta() {
        var ret = {};
        metaEach(function(name, content) {
            ret[name] = content;
        });
        return ret;
    }

    function getMeta(name) {
        if (isStr(name)) {
            var meta = selectMeta(name);
            if (meta) return meta.getAttribute('content');
        } else {
            var ret = {};
            metaEach(function(key, val) {
                if (contain(name, key)) ret[key] = val;
            });
            return ret;
        }
    }

    function setMeta(metas) {
        each(metas, function(content, name) {
            var meta = selectMeta(name);
            if (meta) return meta.setAttribute('content', content);
            meta = doc.createElement('meta');
            meta.setAttribute('name', name);
            meta.setAttribute('content', content);
            doc.head.appendChild(meta);
        });
    }

    function metaEach(fn) {
        var metaList = doc.querySelectorAll('meta');
        each(metaList, function(meta) {
            var name = meta.getAttribute('name');
            var content = meta.getAttribute('content');
            if (!name || !content) return;
            fn(name, content);
        });
    }

    function selectMeta(name) {
        return doc.querySelector('meta[name="' + name + '"]');
    }

    return exports;
})({});

/* ------------------------------ toNum ------------------------------ */

export var toNum = _.toNum = (function (exports) {
    /* Convert value to a number.
     *
     * |Name  |Desc            |
     * |------|----------------|
     * |val   |Value to process|
     * |return|Result number   |
     */

    /* example
     * toNum('5'); // -> 5
     */

    /* typescript
     * export declare function toNum(val: any): number;
     */

    /* dependencies
     * isNum isObj isFn isStr 
     */

    exports = function(val) {
        if (isNum(val)) return val;

        if (isObj(val)) {
            var temp = isFn(val.valueOf) ? val.valueOf() : val;
            val = isObj(temp) ? temp + '' : temp;
        }

        if (!isStr(val)) return val === 0 ? val : +val;
        return +val;
    };

    return exports;
})({});

/* ------------------------------ ms ------------------------------ */

export var ms = _.ms = (function (exports) {
    /* Convert time string formats to milliseconds.
     *
     * Turn time string into milliseconds.
     *
     * |Name  |Desc         |
     * |------|-------------|
     * |str   |String format|
     * |return|Milliseconds |
     *
     * Turn milliseconds into time string.
     *
     * |Name  |Desc         |
     * |------|-------------|
     * |num   |Milliseconds |
     * |return|String format|
     */

    /* example
     * ms('1s'); // -> 1000
     * ms('1m'); // -> 60000
     * ms('1.5h'); // -> 5400000
     * ms('1d'); // -> 86400000
     * ms('1y'); // -> 31557600000
     * ms('1000'); // -> 1000
     * ms(1500); // -> '1.5s'
     * ms(60000); // -> '1m'
     */

    /* typescript
     * export declare function ms(str: string): number;
     * export declare function ms(num: number): string;
     */

    /* dependencies
     * toNum isStr 
     */

    exports = function(str) {
        if (isStr(str)) {
            var match = str.match(regStrTime);
            if (!match) return 0;
            return toNum(match[1]) * factor[match[2] || 'ms'];
        } else {
            var num = str;
            var suffix = 'ms';

            for (var i = 0, len = suffixList.length; i < len; i++) {
                if (num >= factor[suffixList[i]]) {
                    suffix = suffixList[i];
                    break;
                }
            }

            return +(num / factor[suffix]).toFixed(2) + suffix;
        }
    };

    var factor = {
        ms: 1,
        s: 1000
    };
    factor.m = factor.s * 60;
    factor.h = factor.m * 60;
    factor.d = factor.h * 24;
    factor.y = factor.d * 365.25;
    var suffixList = ['y', 'd', 'h', 'm', 's'];
    var regStrTime = /^((?:\d+)?\.?\d+) *(s|m|h|d|y)?$/;

    return exports;
})({});

/* ------------------------------ toInt ------------------------------ */

export var toInt = _.toInt = (function (exports) {
    /* Convert value to an integer.
     *
     * |Name  |Desc             |
     * |------|-----------------|
     * |val   |Value to convert |
     * |return|Converted integer|
     */

    /* example
     * toInt(1.1); // -> 1
     * toInt(undefined); // -> 0
     */

    /* typescript
     * export declare function toInt(val: any): number;
     */

    /* dependencies
     * toNum 
     */

    exports = function(val) {
        if (!val) return val === 0 ? val : 0;
        val = toNum(val);
        return val - (val % 1);
    };

    return exports;
})({});

/* ------------------------------ detectBrowser ------------------------------ */

export var detectBrowser = _.detectBrowser = (function (exports) {
    /* Detect browser info using ua.
     *
     * |Name                  |Desc                              |
     * |----------------------|----------------------------------|
     * |ua=navigator.userAgent|Browser userAgent                 |
     * |return                |Object containing name and version|
     *
     * Browsers supported: ie, chrome, edge, firefox, opera, safari, ios(mobile safari), android(android browser)
     */

    /* example
     * const browser = detectBrowser();
     * if (browser.name === 'ie' && browser.version < 9) {
     *     // Do something about old IE...
     * }
     */

    /* typescript
     * export declare function detectBrowser(ua?: string): {
     *     name: string;
     *     version: number;
     * };
     */

    /* dependencies
     * isBrowser toInt keys 
     */

    exports = function(ua) {
        ua = ua || (isBrowser ? navigator.userAgent : '');
        ua = ua.toLowerCase();
        var ieVer = getVer(ua, 'msie ');
        if (ieVer)
            return {
                version: ieVer,
                name: 'ie'
            };
        if (regIe11.test(ua))
            return {
                version: 11,
                name: 'ie'
            };

        for (var i = 0, len = browsers.length; i < len; i++) {
            var name = browsers[i];
            var match = ua.match(regBrowsers[name]);
            if (match == null) continue;
            var version = toInt(match[1].split('.')[0]);
            if (name === 'opera') version = getVer(ua, 'version/') || version;
            return {
                name: name,
                version: version
            };
        }

        return {
            name: 'unknown',
            version: -1
        };
    };

    var regBrowsers = {
        edge: /edge\/([0-9._]+)/,
        firefox: /firefox\/([0-9.]+)(?:\s|$)/,
        opera: /opera\/([0-9.]+)(?:\s|$)/,
        android: /android\s([0-9.]+)/,
        ios: /version\/([0-9._]+).*mobile.*safari.*/,
        safari: /version\/([0-9._]+).*safari/,
        chrome: /(?!chrom.*opr)chrom(?:e|ium)\/([0-9.]+)(:?\s|$)/
    };
    var regIe11 = /trident\/7\./;
    var browsers = keys(regBrowsers);

    function getVer(ua, mark) {
        var idx = ua.indexOf(mark);
        if (idx > -1)
            return toInt(ua.substring(idx + mark.length, ua.indexOf('.', idx)));
    }

    return exports;
})({});

/* ------------------------------ nextTick ------------------------------ */

export var nextTick = _.nextTick = (function (exports) {
    /* Next tick for both node and browser.
     *
     * |Name|Desc            |
     * |----|----------------|
     * |cb  |Function to call|
     *
     * Use process.nextTick if available.
     *
     * Otherwise setImmediate or setTimeout is used as fallback.
     */

    /* example
     * nextTick(function () {
     *     // Do something...
     * });
     */

    /* typescript
     * export declare function nextTick(cb: Function): void;
     */
    if (typeof process === 'object' && process.nextTick) {
        exports = process.nextTick;
    } else if (typeof setImmediate === 'function') {
        exports = function(cb) {
            setImmediate(ensureCallable(cb));
        };
    } else {
        exports = function(cb) {
            setTimeout(ensureCallable(cb), 0);
        };
    }

    function ensureCallable(fn) {
        if (typeof fn !== 'function')
            throw new TypeError(fn + ' is not a function');
        return fn;
    }

    return exports;
})({});

/* ------------------------------ now ------------------------------ */

export var now = _.now = (function (exports) {
    /* Gets the number of milliseconds that have elapsed since the Unix epoch.
     */

    /* example
     * now(); // -> 1468826678701
     */

    /* typescript
     * export declare function now(): number;
     */
    exports =
        Date.now ||
        function() {
            return new Date().getTime();
        };

    return exports;
})({});

/* ------------------------------ partial ------------------------------ */

export var partial = _.partial = (function (exports) {
    /* Partially apply a function by filling in given arguments.
     *
     * |Name       |Desc                                    |
     * |-----------|----------------------------------------|
     * |fn         |Function to partially apply arguments to|
     * |...partials|Arguments to be partially applied       |
     * |return     |New partially applied function          |
     */

    /* example
     * const sub5 = partial(function (a, b) { return b - a }, 5);
     * sub5(20); // -> 15
     */

    /* typescript
     * export declare function partial(fn: Function, ...partials: any[]): Function;
     */

    /* dependencies
     * restArgs toArr 
     */

    exports = restArgs(function(fn, partials) {
        return function() {
            var args = [];
            args = args.concat(partials);
            args = args.concat(toArr(arguments));
            return fn.apply(this, args);
        };
    });

    return exports;
})({});

/* ------------------------------ once ------------------------------ */

export var once = _.once = (function (exports) {
    /* Create a function that invokes once.
     *
     * |Name  |Desc                   |
     * |------|-----------------------|
     * |fn    |Function to restrict   |
     * |return|New restricted function|
     */

    /* example
     * function init() {};
     * const initOnce = once(init);
     * initOnce();
     * initOnce(); // -> init is invoked once
     */

    /* typescript
     * export declare function once(fn: Function): Function;
     */

    /* dependencies
     * partial before 
     */

    exports = partial(before, 2);

    return exports;
})({});

/* ------------------------------ Emitter ------------------------------ */

export var Emitter = _.Emitter = (function (exports) {
    /* Event emitter class which provides observer pattern.
     *
     * ### on
     *
     * Bind event.
     *
     * ### off
     *
     * Unbind event.
     *
     * ### once
     *
     * Bind event that trigger once.
     *
     * |Name    |Desc          |
     * |--------|--------------|
     * |event   |Event name    |
     * |listener|Event listener|
     *
     * ### emit
     *
     * Emit event.
     *
     * |Name   |Desc                        |
     * |-------|----------------------------|
     * |event  |Event name                  |
     * |...args|Arguments passed to listener|
     *
     * ### mixin
     *
     * [static] Mixin object class methods.
     *
     * |Name|Desc           |
     * |----|---------------|
     * |obj |Object to mixin|
     */

    /* example
     * const event = new Emitter();
     * event.on('test', function () { console.log('test') });
     * event.emit('test'); // Logs out 'test'.
     * Emitter.mixin({});
     */

    /* typescript
     * export declare class Emitter {
     *     on(event: string, listener: Function): Emitter;
     *     off(event: string, listener: Function): Emitter;
     *     once(event: string, listener: Function): Emitter;
     *     emit(event: string): Emitter;
     *     static mixin(obj: any): any;
     * }
     */

    /* dependencies
     * Class has each slice once 
     */

    exports = Class(
        {
            initialize: function Emitter() {
                this._events = this._events || {};
            },
            on: function(event, listener) {
                this._events[event] = this._events[event] || [];

                this._events[event].push(listener);

                return this;
            },
            off: function(event, listener) {
                if (!has(this._events, event)) return;

                this._events[event].splice(
                    this._events[event].indexOf(listener),
                    1
                );

                return this;
            },
            once: function(event, listener) {
                this.on(event, once(listener));
                return this;
            },
            emit: function(event) {
                if (!has(this._events, event)) return;
                var args = slice(arguments, 1);
                each(
                    this._events[event],
                    function(val) {
                        val.apply(this, args);
                    },
                    this
                );
                return this;
            }
        },
        {
            mixin: function(obj) {
                each(['on', 'off', 'once', 'emit'], function(val) {
                    obj[val] = exports.prototype[val];
                });
                obj._events = obj._events || {};
            }
        }
    );

    return exports;
})({});

/* ------------------------------ Logger ------------------------------ */

export var Logger = _.Logger = (function (exports) {
    /* Simple logger with level filter.
     *
     * ### constructor
     *
     * |Name       |Desc        |
     * |-----------|------------|
     * |name       |Logger name |
     * |level=DEBUG|Logger level|
     *
     * ### setLevel
     *
     * Set level.
     *
     * |Name |Desc        |
     * |-----|------------|
     * |level|Logger level|
     *
     * ### getLevel
     *
     * Get current level.
     *
     * ### trace, debug, info, warn, error
     *
     * Logging methods.
     *
     * ### Log Levels
     *
     * TRACE, DEBUG, INFO, WARN, ERROR and SILENT.
     */

    /* example
     * const logger = new Logger('licia', Logger.level.ERROR);
     * logger.trace('test');
     *
     * // Format output.
     * logger.formatter = function (type, argList) {
     *     argList.push(new Date().getTime());
     *
     *     return argList;
     * };
     *
     * logger.on('all', function (type, argList) {
     *     // It's not affected by log level.
     * });
     *
     * logger.on('debug', function (argList) {
     *     // Affected by log level.
     * });
     */

    /* typescript
     * export declare class Logger extends Emitter {
     *     name: string;
     *     formatter(type: string, argList: any[]): any[];
     *     constructor(name: string, level?: string | number);
     *     setLevel(level: string | number): Logger;
     *     getLevel(): number;
     *     trace(...args: any[]): Logger;
     *     debug(...args: any[]): Logger;
     *     info(...args: any[]): Logger;
     *     warn(...args: any[]): Logger;
     *     error(...args: any[]): Logger;
     *     static level: Enum;
     * }
     */

    /* dependencies
     * Emitter Enum toArr isUndef clone isStr isNum 
     */

    exports = Emitter.extend(
        {
            initialize: function Logger(name, level) {
                this.name = name;
                this.setLevel(isUndef(level) ? exports.level.DEBUG : level);
                this.callSuper(Emitter, 'initialize', arguments);
            },
            setLevel: function(level) {
                if (isStr(level)) {
                    level = exports.level[level.toUpperCase()];
                    if (level) this._level = level;
                    return this;
                }

                if (isNum(level)) this._level = level;
                return this;
            },
            getLevel: function() {
                return this._level;
            },
            formatter: function(type, argList) {
                return argList;
            },
            trace: function() {
                return this._log('trace', arguments);
            },
            debug: function() {
                return this._log('debug', arguments);
            },
            info: function() {
                return this._log('info', arguments);
            },
            warn: function() {
                return this._log('warn', arguments);
            },
            error: function() {
                return this._log('error', arguments);
            },
            _log: function(type, argList) {
                argList = toArr(argList);
                if (argList.length === 0) return this;
                this.emit('all', type, clone(argList));
                if (exports.level[type.toUpperCase()] < this._level) return this;
                this.emit(type, clone(argList));
                /* eslint-disable no-console */

                var consoleMethod = type === 'debug' ? console.log : console[type];
                consoleMethod.apply(console, this.formatter(type, argList));
                return this;
            }
        },
        {
            level: new Enum({
                TRACE: 0,
                DEBUG: 1,
                INFO: 2,
                WARN: 3,
                ERROR: 4,
                SILENT: 5
            })
        }
    );

    return exports;
})({});

/* ------------------------------ MediaQuery ------------------------------ */

export var MediaQuery = _.MediaQuery = (function (exports) {
    /* CSS media query listener.
     *
     * Extend from Emitter.
     *
     * ### constructor
     *
     * |Name |Desc       |
     * |-----|-----------|
     * |query|Media query|
     *
     * ### isMatch
     *
     * Return true if given media query matches.
     *
     * ### Events
     *
     * #### match
     *
     * Triggered when a media query matches.
     *
     * #### unmatch
     *
     * Opposite of match.
     */

    /* example
     * const mediaQuery = new MediaQuery('screen and (max-width:1000px)');
     * mediaQuery.isMatch(); // -> false
     * mediaQuery.on('match', () => {
     *     // Do something...
     * });
     */

    /* typescript
     * export declare class MediaQuery extends Emitter {
     *     constructor(query: string);
     *     isMatch(): boolean;
     * }
     */

    /* dependencies
     * Emitter 
     */

    exports = Emitter.extend({
        className: 'MediaQuery',
        initialize: function(query) {
            var _this = this;

            this.callSuper(Emitter, 'initialize');
            this._mql = window.matchMedia(query);

            this._mql.addListener(function() {
                _this.emit(_this.isMatch() ? 'match' : 'unmatch');
            });
        },
        isMatch: function() {
            return this._mql.matches;
        }
    });

    return exports;
})({});

/* ------------------------------ isDarkMode ------------------------------ */

export var isDarkMode = _.isDarkMode = (function (exports) {
    /* Detect dark mode.
     */

    /* example
     * console.log(isDarkMode()); // true if dark mode
     */

    /* typescript
     * export declare function isDarkMode(): boolean;
     */

    /* dependencies
     * MediaQuery 
     */

    var m = new MediaQuery('(prefers-color-scheme: dark)');

    exports = function() {
        return m.isMatch();
    };

    return exports;
})({});

/* ------------------------------ Store ------------------------------ */

export var Store = _.Store = (function (exports) {
    /* Memory storage.
     *
     * Extend from Emitter.
     *
     * ### constructor
     *
     * |Name|Desc        |
     * |----|------------|
     * |data|Initial data|
     *
     * ### set
     *
     * Set value.
     *
     * |Name|Desc        |
     * |----|------------|
     * |key |Value key   |
     * |val |Value to set|
     *
     * Set values.
     *
     * |Name  |Desc           |
     * |------|---------------|
     * |values|Key value pairs|
     *
     * This emit a change event whenever is called.
     *
     * ### get
     *
     * Get value.
     *
     * |Name  |Desc              |
     * |------|------------------|
     * |key   |Value key         |
     * |return|Value of given key|
     *
     * Get values.
     *
     * |Name  |Desc           |
     * |------|---------------|
     * |keys  |Array of keys  |
     * |return|Key value pairs|
     *
     * ### remove
     *
     * Remove value.
     *
     * |Name|Desc         |
     * |----|-------------|
     * |key |Key to remove|
     *
     * ### clear
     *
     * Clear all data.
     *
     * ### each
     *
     * Iterate over values.
     *
     * |Name|Desc                          |
     * |----|------------------------------|
     * |fn  |Function invoked per iteration|
     */

    /* example
     * const store = new Store('test');
     * store.set('user', {name: 'licia'});
     * store.get('user').name; // -> 'licia'
     * store.clear();
     * store.each(function (val, key) {
     *     // Do something.
     * });
     * store.on('change', function (key, newVal, oldVal) {
     *     // It triggers whenever set is called.
     * });
     */

    /* typescript
     * export declare class Store extends Emitter {
     *     constructor(data?: {});
     *     set(key: string, val: any): void;
     *     set(values: {}): void;
     *     get(key: string): any;
     *     get(keys: string[]): {};
     *     remove(key: string): void;
     *     remove(keys: string[]): void;
     *     clear(): void;
     *     each(fn: (...args: any[]) => void): void;
     * }
     */

    /* dependencies
     * Emitter isStr isObj each toArr 
     */

    exports = Emitter.extend({
        initialize: function Store(data) {
            this.callSuper(Emitter, 'initialize', arguments);
            this._data = data || {};
            this.save(this._data);
        },
        set: function(key, val) {
            var data;

            if (isStr(key)) {
                data = {};
                data[key] = val;
            } else if (isObj(key)) {
                data = key;
            }

            var self = this;
            each(data, function(val, key) {
                var oldVal = self._data[key];
                self._data[key] = val;
                self.emit('change', key, val, oldVal);
            });
            this.save(this._data);
        },
        get: function(key) {
            var data = this._data;
            if (isStr(key)) return data[key];
            var ret = {};
            each(key, function(val) {
                ret[val] = data[val];
            });
            return ret;
        },
        remove: function(key) {
            key = toArr(key);
            var data = this._data;
            each(key, function(val) {
                delete data[val];
            });
            this.save(data);
        },
        clear: function() {
            this._data = {};
            this.save(this._data);
        },
        each: function(fn) {
            each(this._data, fn);
        },
        // This methods exists to be overwritten.
        save: function(data) {
            this._data = data;
        }
    });

    return exports;
})({});

/* ------------------------------ orientation ------------------------------ */

export var orientation = _.orientation = (function (exports) {
    /* Screen orientation helper.
     *
     * ### on
     *
     * Bind change event.
     *
     * ### off
     *
     * Unbind change event.
     *
     * ### get
     *
     * Get current orientation(landscape or portrait).
     */

    /* example
     * orientation.on('change', function (direction) {
     *     console.log(direction); // -> 'portrait'
     * });
     * orientation.get(); // -> 'landscape'
     */

    /* typescript
     * export declare namespace orientation {
     *     interface IOrientation extends Emitter {
     *         get(): string;
     *     }
     * }
     * export declare const orientation: orientation.IOrientation;
     */

    /* dependencies
     * Emitter safeGet 
     */

    var screen = window.screen;
    exports = {
        get: function() {
            if (screen) {
                var orientation = safeGet(screen, 'orientation.type');
                if (orientation) return orientation.split('-').shift();
            }

            return window.innerWidth > window.innerHeight
                ? 'landscape'
                : 'portrait';
        }
    };
    Emitter.mixin(exports);
    window.addEventListener(
        'orientationchange',
        function() {
            setTimeout(function() {
                exports.emit('change', exports.get());
            }, 200);
        },
        false
    );

    return exports;
})({});

/* ------------------------------ perfNow ------------------------------ */

export var perfNow = _.perfNow = (function (exports) {
    /* High resolution time up to microsecond precision.
     */

    /* example
     * const start = perfNow();
     *
     * // Do something.
     *
     * console.log(perfNow() - start);
     */

    /* typescript
     * export declare function perfNow(): number;
     */

    /* dependencies
     * now root 
     */

    var performance = root.performance;
    var process = root.process;
    var loadTime;

    if (performance && performance.now) {
        exports = function() {
            return performance.now();
        };
    } else if (process && process.hrtime) {
        var getNanoSeconds = function() {
            var hr = process.hrtime();
            return hr[0] * 1e9 + hr[1];
        };

        loadTime = getNanoSeconds() - process.uptime() * 1e9;

        exports = function() {
            return (getNanoSeconds() - loadTime) / 1e6;
        };
    } else {
        loadTime = now();

        exports = function() {
            return now() - loadTime;
        };
    }

    return exports;
})({});

/* ------------------------------ pick ------------------------------ */

export var pick = _.pick = (function (exports) {
    /* Return a filtered copy of an object.
     *
     * |Name  |Desc           |
     * |------|---------------|
     * |object|Source object  |
     * |filter|Object filter  |
     * |return|Filtered object|
     */

    /* example
     * pick({a: 1, b: 2}, 'a'); // -> {a: 1}
     * pick({a: 1, b: 2, c: 3}, ['b', 'c']) // -> {b: 2, c: 3}
     * pick({a: 1, b: 2, c: 3, d: 4}, function (val, key) {
     *     return val % 2;
     * }); // -> {a: 1, c: 3}
     */

    /* typescript
     * export declare function pick(
     *     object: any,
     *     filter: string | string[] | Function,
     * ): any;
     */

    /* dependencies
     * isStr isArr contain each 
     */

    exports = function(obj, filter, omit) {
        if (isStr(filter)) filter = [filter];

        if (isArr(filter)) {
            var keys = filter;

            filter = function(val, key) {
                return contain(keys, key);
            };
        }

        var ret = {};

        var iteratee = function(val, key) {
            if (filter(val, key)) ret[key] = val;
        };

        if (omit) {
            iteratee = function(val, key) {
                if (!filter(val, key)) ret[key] = val;
            };
        }

        each(obj, iteratee);
        return ret;
    };

    return exports;
})({});

/* ------------------------------ pxToNum ------------------------------ */

export var pxToNum = _.pxToNum = (function (exports) {
    /* Turn string like '0px' to number.
     */

    /* dependencies
     * toNum 
     */

    exports = function (str) {
      return toNum(str.replace('px', ''))
    }

    return exports;
})({});

/* ------------------------------ raf ------------------------------ */

export var raf = _.raf = (function (exports) {
    /* Shortcut for requestAnimationFrame.
     *
     * Use setTimeout if native requestAnimationFrame is not supported.
     */

    /* example
     * const id = raf(function tick() {
     *     // Animation stuff
     *     raf(tick);
     * });
     * raf.cancel(id);
     */

    /* typescript
     * export declare namespace raf {
     *     function cancel(id: number);
     * }
     * export declare function raf(cb: Function): number;
     */

    /* dependencies
     * now isBrowser 
     */

    var raf, cancel;
    var lastTime = 0;

    if (isBrowser) {
        raf = window.requestAnimationFrame;
        cancel = window.cancelAnimationFrame;
        var vendors = ['ms', 'moz', 'webkit', 'o'];

        for (var i = 0, len = vendors.length; i < len && !raf; i++) {
            raf = window[vendors[i] + 'RequestAnimationFrame'];
            cancel =
                window[vendors[i] + 'CancelAnimationFrame'] ||
                window[vendors[i] + 'CancelRequestAnimationFrame'];
        }
    }

    raf =
        raf ||
        function(cb) {
            var curTime = now();
            var timeToCall = Math.max(0, 16 - (curTime - lastTime));
            var id = setTimeout(function() {
                cb(curTime + timeToCall);
            }, timeToCall);
            lastTime = curTime + timeToCall;
            return id;
        };

    cancel =
        cancel ||
        function(id) {
            clearTimeout(id);
        };

    raf.cancel = cancel;
    exports = raf;

    return exports;
})({});

/* ------------------------------ rmCookie ------------------------------ */

export var rmCookie = _.rmCookie = (function (exports) {
    /* Loop through all possible path and domain to remove cookie.
     *
     * |Name|Desc      |
     * |----|----------|
     * |key |Cookie key|
     */

    /* example
     * rmCookie('test');
     */

    /* typescript
     * export declare function rmCookie(key: string): void;
     */

    /* dependencies
     * cookie 
     */

    exports = function(key) {
        var location = window.location;
        var hostname = location.hostname;
        var pathname = location.pathname;
        var hostNames = hostname.split('.');
        var pathNames = pathname.split('/');
        var domain = '';
        var pathLen = pathNames.length;
        var path;
        if (del()) return;

        for (var i = hostNames.length - 1; i >= 0; i--) {
            var hostName = hostNames[i];
            if (hostName === '') continue;
            domain = domain === '' ? hostName : hostName + '.' + domain;
            path = '/';
            if (
                del({
                    domain: domain,
                    path: path
                }) ||
                del({
                    domain: domain
                })
            )
                return;

            for (var j = 0; j < pathLen; j++) {
                var pathName = pathNames[j];
                if (pathName === '') continue;
                path += pathName;
                if (
                    del({
                        domain: domain,
                        path: path
                    }) ||
                    del({
                        path: path
                    })
                )
                    return;
                path += '/';
                if (
                    del({
                        domain: domain,
                        path: path
                    }) ||
                    del({
                        path: path
                    })
                )
                    return;
            }
        }

        function del(options) {
            options = options || {};
            cookie.remove(key, options);
            return !cookie.get(key);
        }
    };

    return exports;
})({});

/* ------------------------------ rtrim ------------------------------ */

export var rtrim = _.rtrim = (function (exports) {
    /* Remove chars or white-spaces from end of string.
     *
     * |Name  |Desc              |
     * |------|------------------|
     * |str   |String to trim    |
     * |chars |Characters to trim|
     * |return|Trimmed string    |
     */

    /* example
     * rtrim(' abc  '); // -> ' abc'
     * rtrim('_abc_', '_'); // -> '_abc'
     * rtrim('_abc_', ['c', '_']); // -> '_ab'
     */

    /* typescript
     * export declare function rtrim(str: string, chars?: string | string[]): string;
     */
    var regSpace = /\s+$/;

    exports = function(str, chars) {
        if (chars == null) return str.replace(regSpace, '');
        var end = str.length - 1;
        var charLen = chars.length;
        var found = true;
        var i;
        var c;

        while (found && end >= 0) {
            found = false;
            i = -1;
            c = str.charAt(end);

            while (++i < charLen) {
                if (c === chars[i]) {
                    found = true;
                    end--;
                    break;
                }
            }
        }

        return end >= 0 ? str.substring(0, end + 1) : '';
    };

    return exports;
})({});

/* ------------------------------ trim ------------------------------ */

export var trim = _.trim = (function (exports) {
    /* Remove chars or white-spaces from beginning end of string.
     *
     * |Name  |Desc              |
     * |------|------------------|
     * |str   |String to trim    |
     * |chars |Characters to trim|
     * |return|Trimmed string    |
     */

    /* example
     * trim(' abc  '); // -> 'abc'
     * trim('_abc_', '_'); // -> 'abc'
     * trim('_abc_', ['a', 'c', '_']); // -> 'b'
     */

    /* typescript
     * export declare function trim(str: string, chars?: string | string[]): string;
     */

    /* dependencies
     * ltrim rtrim 
     */

    var regSpace = /^\s+|\s+$/g;

    exports = function(str, chars) {
        if (chars == null) return str.replace(regSpace, '');
        return ltrim(rtrim(str, chars), chars);
    };

    return exports;
})({});

/* ------------------------------ extractUrls ------------------------------ */

export var extractUrls = _.extractUrls = (function (exports) {
    /* Extract urls from plain text.
     *
     * |Name  |Desc           |
     * |------|---------------|
     * |str   |Text to extract|
     * |return|Url list       |
     */

    /* example
     * const str = '[Official site: http://eustia.liriliri.io](http://eustia.liriliri.io)';
     * extractUrls(str); // -> ['http://eustia.liriliri.io']
     */

    /* typescript
     * export declare function extractUrls(str: string): string[];
     */

    /* dependencies
     * unique trim map toArr 
     */

    exports = function(str) {
        var urlList = toArr(str.match(regUrl));
        return unique(
            map(urlList, function(url) {
                return trim(url);
            })
        );
    };

    var regUrl = /((https?)|(ftp)):\/\/[\w.]+[^ \f\n\r\t\v"\\<>[\]\u2100-\uFFFF(),]*/gi;

    return exports;
})({});

/* ------------------------------ linkify ------------------------------ */

export var linkify = _.linkify = (function (exports) {
    /* Hyperlink urls in a string.
     *
     * |Name     |Desc                     |
     * |---------|-------------------------|
     * |str      |String to hyperlink      |
     * |hyperlink|Function to hyperlink url|
     * |return   |Result string            |
     */

    /* example
     * const str = 'Official site: http://eustia.liriliri.io'
     * linkify(str); // -> 'Official site: <a href="http://eustia.liriliri.io">http://eustia.liriliri.io</a>'
     * linkify(str, function (url) {
     *     return '<a href="' + url + '" target="_blank">' + url + '</a>';
     * });
     */

    /* typescript
     * export declare function linkify(str: string, hyperlink?: Function): string;
     */

    /* dependencies
     * extractUrls each escapeRegExp 
     */

    exports = function(str, hyperlink) {
        hyperlink = hyperlink || defHyperlink;
        var urlList = extractUrls(str);
        each(urlList, function(url) {
            str = str.replace(new RegExp(escapeRegExp(url), 'g'), hyperlink);
        });
        return str;
    };

    function defHyperlink(url) {
        return '<a href="' + url + '">' + url + '</a>';
    }

    return exports;
})({});

/* ------------------------------ query ------------------------------ */

export var query = _.query = (function (exports) {
    /* Parse and stringify url query strings.
     *
     * ### parse
     *
     * Parse a query string into an object.
     *
     * |Name  |Desc        |
     * |------|------------|
     * |str   |Query string|
     * |return|Query object|
     *
     * ### stringify
     *
     * Stringify an object into a query string.
     *
     * |Name  |Desc        |
     * |------|------------|
     * |obj   |Query object|
     * |return|Query string|
     */

    /* example
     * query.parse('foo=bar&eruda=true'); // -> {foo: 'bar', eruda: 'true'}
     * query.stringify({foo: 'bar', eruda: 'true'}); // -> 'foo=bar&eruda=true'
     * query.parse('name=eruda&name=eustia'); // -> {name: ['eruda', 'eustia']}
     */

    /* typescript
     * export declare const query: {
     *     parse(str: string): any;
     *     stringify(object: any): string;
     * };
     */

    /* dependencies
     * trim each isUndef isArr map isEmpty filter isObj 
     */

    exports = {
        parse: function(str) {
            var ret = {};
            str = trim(str).replace(regIllegalChars, '');
            each(str.split('&'), function(param) {
                var parts = param.split('=');
                var key = parts.shift(),
                    val = parts.length > 0 ? parts.join('=') : null;
                key = decodeURIComponent(key);
                val = decodeURIComponent(val);

                if (isUndef(ret[key])) {
                    ret[key] = val;
                } else if (isArr(ret[key])) {
                    ret[key].push(val);
                } else {
                    ret[key] = [ret[key], val];
                }
            });
            return ret;
        },
        stringify: function(obj, arrKey) {
            return filter(
                map(obj, function(val, key) {
                    if (isObj(val) && isEmpty(val)) return '';
                    if (isArr(val)) return exports.stringify(val, key);
                    return (
                        (arrKey
                            ? encodeURIComponent(arrKey)
                            : encodeURIComponent(key)) +
                        '=' +
                        encodeURIComponent(val)
                    );
                }),
                function(str) {
                    return str.length > 0;
                }
            ).join('&');
        }
    };
    var regIllegalChars = /^(\?|#|&)/g;

    return exports;
})({});

/* ------------------------------ Url ------------------------------ */

export var Url = _.Url = (function (exports) {
    /* Simple url manipulator.
     *
     * ### constructor
     *
     * |Name        |Desc      |
     * |------------|----------|
     * |url=location|Url string|
     *
     * ### setQuery
     *
     * Set query value.
     *
     * |Name  |Desc       |
     * |------|-----------|
     * |name  |Query name |
     * |val   |Query value|
     * |return|this       |
     *
     * |Name  |Desc        |
     * |------|------------|
     * |query |query object|
     * |return|this        |
     *
     * ### rmQuery
     *
     * Remove query value.
     *
     * |Name  |Desc      |
     * |------|----------|
     * |name  |Query name|
     * |return|this      |
     *
     * ### parse
     *
     * [static] Parse url into an object.
     *
     * |Name  |Desc      |
     * |------|----------|
     * |url   |Url string|
     * |return|Url object|
     *
     * ### stringify
     *
     * [static] Stringify url object into a string.
     *
     * |Name  |Desc      |
     * |------|----------|
     * |url   |Url object|
     * |return|Url string|
     *
     * An url object contains the following properties:
     *
     * |Name    |Desc                                                                                  |
     * |--------|--------------------------------------------------------------------------------------|
     * |protocol|The protocol scheme of the URL (e.g. http:)                                           |
     * |slashes |A boolean which indicates whether the protocol is followed by two forward slashes (//)|
     * |auth    |Authentication information portion (e.g. username:password)                           |
     * |hostname|Host name without port number                                                         |
     * |port    |Optional port number                                                                  |
     * |pathname|URL path                                                                              |
     * |query   |Parsed object containing query string                                                 |
     * |hash    |The "fragment" portion of the URL including the pound-sign (#)                        |
     */

    /* example
     * const url = new Url('http://example.com:8080?eruda=true');
     * console.log(url.port); // -> '8080'
     * url.query.foo = 'bar';
     * url.rmQuery('eruda');
     * url.toString(); // -> 'http://example.com:8080/?foo=bar'
     */

    /* typescript
     * export declare namespace Url {
     *     interface IUrl {
     *         protocol: string;
     *         auth: string;
     *         hostname: string;
     *         hash: string;
     *         query: any;
     *         port: string;
     *         pathname: string;
     *         slashes: boolean;
     *     }
     * }
     * export declare class Url {
     *     protocol: string;
     *     auth: string;
     *     hostname: string;
     *     hash: string;
     *     query: any;
     *     port: string;
     *     pathname: string;
     *     slashes: boolean;
     *     constructor(url?: string);
     *     setQuery(name: string, val: string): Url;
     *     setQuery(query: { [name: string]: string }): Url;
     *     rmQuery(name: string | string[]): Url;
     *     toString(): string;
     *     static parse(url: string): Url.IUrl;
     *     static stringify(object: Url.IUrl): string;
     * }
     */

    /* dependencies
     * Class extend trim query isEmpty each isArr toArr isBrowser isObj 
     */

    exports = Class(
        {
            className: 'Url',
            initialize: function(url) {
                if (!url && isBrowser) url = window.location.href;
                extend(this, exports.parse(url || ''));
            },
            setQuery: function(name, val) {
                var query = this.query;

                if (isObj(name)) {
                    each(name, function(val, key) {
                        query[key] = val;
                    });
                } else {
                    query[name] = val;
                }

                return this;
            },
            rmQuery: function(name) {
                var query = this.query;
                if (!isArr(name)) name = toArr(name);
                each(name, function(key) {
                    delete query[key];
                });
                return this;
            },
            toString: function() {
                return exports.stringify(this);
            }
        },
        {
            parse: function(url) {
                var ret = {
                    protocol: '',
                    auth: '',
                    hostname: '',
                    hash: '',
                    query: {},
                    port: '',
                    pathname: '',
                    slashes: false
                };
                var rest = trim(url);
                var slashes = false;
                var proto = rest.match(regProto);

                if (proto) {
                    proto = proto[0];
                    ret.protocol = proto.toLowerCase();
                    rest = rest.substr(proto.length);
                }

                if (proto) {
                    slashes = rest.substr(0, 2) === '//';

                    if (slashes) {
                        rest = rest.slice(2);
                        ret.slashes = true;
                    }
                }

                if (slashes) {
                    var host = rest;
                    var hostEnd = -1;

                    for (var i = 0, len = hostEndingChars.length; i < len; i++) {
                        var pos = rest.indexOf(hostEndingChars[i]);
                        if (pos !== -1 && (hostEnd === -1 || pos < hostEnd))
                            hostEnd = pos;
                    }

                    if (hostEnd > -1) {
                        host = rest.slice(0, hostEnd);
                        rest = rest.slice(hostEnd);
                    }

                    var atSign = host.lastIndexOf('@');

                    if (atSign !== -1) {
                        ret.auth = decodeURIComponent(host.slice(0, atSign));
                        host = host.slice(atSign + 1);
                    }

                    ret.hostname = host;
                    var port = host.match(regPort);

                    if (port) {
                        port = port[0];
                        if (port !== ':') ret.port = port.substr(1);
                        ret.hostname = host.substr(0, host.length - port.length);
                    }
                }

                var hash = rest.indexOf('#');

                if (hash !== -1) {
                    ret.hash = rest.substr(hash);
                    rest = rest.slice(0, hash);
                }

                var queryMark = rest.indexOf('?');

                if (queryMark !== -1) {
                    ret.query = query.parse(rest.substr(queryMark + 1));
                    rest = rest.slice(0, queryMark);
                }

                ret.pathname = rest || '/';
                return ret;
            },
            stringify: function(obj) {
                var ret =
                    obj.protocol +
                    (obj.slashes ? '//' : '') +
                    (obj.auth ? encodeURIComponent(obj.auth) + '@' : '') +
                    obj.hostname +
                    (obj.port ? ':' + obj.port : '') +
                    obj.pathname;
                if (!isEmpty(obj.query)) ret += '?' + query.stringify(obj.query);
                if (obj.hash) ret += obj.hash;
                return ret;
            }
        }
    );
    var regProto = /^([a-z0-9.+-]+:)/i;
    var regPort = /:[0-9]*$/;
    var hostEndingChars = ['/', '?', '#'];

    return exports;
})({});

/* ------------------------------ getFileName ------------------------------ */

export var getFileName = _.getFileName = (function (exports) {
    /* Extract file name from url.
     */

    /* dependencies
     * last trim Url 
     */

    exports = function (url) {
      let ret = last(url.split('/'))

      if (ret.indexOf('?') > -1) ret = trim(ret.split('?')[0])

      if (ret === '') {
        url = new Url(url)
        ret = url.hostname
      }

      return ret
    }

    return exports;
})({});

/* ------------------------------ ajax ------------------------------ */

export var ajax = _.ajax = (function (exports) {
    /* Perform an asynchronous HTTP request.
     *
     * |Name   |Desc        |
     * |-------|------------|
     * |options|Ajax options|
     *
     * Available options:
     *
     * |Name                                         |Desc                       |
     * |---------------------------------------------|---------------------------|
     * |type=get                                     |Request type               |
     * |url                                          |Request url                |
     * |data                                         |Request data               |
     * |dataType=json                                |Response type(json, xml)   |
     * |contentType=application/x-www-form-urlencoded|Request header Content-Type|
     * |success                                      |Success callback           |
     * |error                                        |Error callback             |
     * |complete                                     |Callback after request     |
     * |timeout                                      |Request timeout            |
     *
     * ### get
     *
     * Shortcut for type = GET;
     *
     * ### post
     *
     * Shortcut for type = POST;
     *
     * |Name    |Desc            |
     * |--------|----------------|
     * |url     |Request url     |
     * |data    |Request data    |
     * |success |Success callback|
     * |dataType|Response type   |
     */

    /* example
     * ajax({
     *     url: 'http://example.com',
     *     data: {test: 'true'},
     *     error() {},
     *     success(data) {
     *         // ...
     *     },
     *     dataType: 'json'
     * });
     *
     * ajax.get('http://example.com', {}, function (data) {
     *     // ...
     * });
     */

    /* typescript
     * export declare namespace ajax {
     *     function get(
     *         url: string,
     *         data: string | {},
     *         success: Function,
     *         dataType?: string
     *     ): XMLHttpRequest;
     *     function get(url: string, success: Function, dataType?: string): XMLHttpRequest;
     *     function post(
     *         url: string,
     *         data: string | {},
     *         success: Function,
     *         dataType?: string
     *     ): XMLHttpRequest;
     *     function post(url: string, success: Function, dataType?: string): XMLHttpRequest;
     * }
     * export declare function ajax(options: {
     *     type?: string;
     *     url: string;
     *     data?: string | {};
     *     dataType?: string;
     *     contentType?: string;
     *     success?: Function;
     *     error?: Function;
     *     complete?: Function;
     *     timeout?: number;
     * }): XMLHttpRequest;
     */

    /* dependencies
     * isFn noop defaults isObj query 
     */

    exports = function(options) {
        defaults(options, exports.setting);
        var type = options.type;
        var url = options.url;
        var data = options.data;
        var dataType = options.dataType;
        var success = options.success;
        var error = options.error;
        var timeout = options.timeout;
        var complete = options.complete;
        var xhr = options.xhr();
        var abortTimeout;

        xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4) return;
            clearTimeout(abortTimeout);
            var result;
            var status = xhr.status;

            if ((status >= 200 && status < 300) || status === 304) {
                result = xhr.responseText;
                if (dataType === 'xml') result = xhr.responseXML;

                try {
                    if (dataType === 'json') result = JSON.parse(result);
                    /* eslint-disable no-empty */
                } catch (e) {}

                success(result, xhr);
            } else {
                error(xhr);
            }

            complete(xhr);
        };

        if (type === 'GET') {
            data = query.stringify(data);
            url += url.indexOf('?') > -1 ? '&' + data : '?' + data;
        } else if (options.contentType === 'application/x-www-form-urlencoded') {
            if (isObj(data)) data = query.stringify(data);
        } else if (options.contentType === 'application/json') {
            if (isObj(data)) data = JSON.stringify(data);
        }

        xhr.open(type, url, true);
        xhr.setRequestHeader('Content-Type', options.contentType);

        if (timeout > 0) {
            abortTimeout = setTimeout(function() {
                xhr.onreadystatechange = noop;
                xhr.abort();
                error(xhr, 'timeout');
                complete(xhr);
            }, timeout);
        }

        xhr.send(type === 'GET' ? null : data);
        return xhr;
    };

    exports.setting = {
        type: 'GET',
        success: noop,
        error: noop,
        complete: noop,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        data: {},
        xhr: function() {
            return new XMLHttpRequest();
        },
        timeout: 0
    };

    exports.get = function() {
        return exports(parseArgs.apply(null, arguments));
    };

    exports.post = function() {
        var options = parseArgs.apply(null, arguments);
        options.type = 'POST';
        return exports(options);
    };

    function parseArgs(url, data, success, dataType) {
        if (isFn(data)) {
            dataType = success;
            success = data;
            data = {};
        }

        return {
            url: url,
            data: data,
            success: success,
            dataType: dataType
        };
    }

    return exports;
})({});

/* ------------------------------ sortKeys ------------------------------ */

export var sortKeys = _.sortKeys = (function (exports) {
    /* Sort keys of an object.
     *
     * |Name   |Desc                   |
     * |-------|-----------------------|
     * |obj    |Object to sort         |
     * |options|Sort options           |
     * |return |Object with sorted keys|
     *
     * Available options:
     *
     * |Name      |Desc                 |
     * |----------|---------------------|
     * |deep=false|Sort keys recursively|
     * |comparator|Comparator           |
     */

    /* example
     * sortKeys({b: {d: 2, c: 1}, a: 0}, {
     *     deep: true
     * }); // -> {a: 0, b: {c: 1, d: 2}}
     */

    /* typescript
     * export declare function sortKeys(
     *     obj: object,
     *     options?: {
     *         deep?: boolean,
     *         comparator?: Function
     *     }
     * ): object;
     */

    /* dependencies
     * isSorted defaults keys isArr isObj 
     */

    exports = function(obj) {
        var options =
            arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        defaults(options, defOpts);
        var deep = options.deep,
            comparator = options.comparator;
        var visited = [];
        var visitedResult = [];

        function sort(obj) {
            var idx = visited.indexOf(obj);

            if (idx > -1) {
                return visitedResult[idx];
            }

            var result;

            if (isArr(obj)) {
                result = [];
                visited.push(obj);
                visitedResult.push(result);

                for (var i = 0, len = obj.length; i < len; i++) {
                    var value = obj[i];

                    if (deep && isObj(value)) {
                        result[i] = sort(value);
                    } else {
                        result[i] = value;
                    }
                }
            } else {
                result = {};
                visited.push(obj);
                visitedResult.push(result);

                var _keys = keys(obj).sort(comparator);

                for (var _i = 0, _len = _keys.length; _i < _len; _i++) {
                    var key = _keys[_i];
                    var _value = obj[key];

                    if (deep && isObj(_value)) {
                        result[key] = sort(_value);
                    } else {
                        result[key] = _value;
                    }
                }
            }

            return result;
        }

        return sort(obj);
    };

    var defOpts = {
        deep: false,
        comparator: isSorted.defComparator
    };

    return exports;
})({});

/* ------------------------------ type ------------------------------ */

export var type = _.type = (function (exports) {
    /* Determine the internal JavaScript [[Class]] of an object.
     *
     * |Name          |Desc             |
     * |--------------|-----------------|
     * |val           |Value to get type|
     * |lowerCase=true|LowerCase result |
     * |return        |Type of object   |
     */

    /* example
     * type(5); // -> 'number'
     * type({}); // -> 'object'
     * type(function () {}); // -> 'function'
     * type([]); // -> 'array'
     * type([], false); // -> 'Array'
     * type(async function () {}, false); // -> 'AsyncFunction'
     */

    /* typescript
     * export declare function type(val: any, lowerCase?: boolean): string;
     */

    /* dependencies
     * objToStr isNaN 
     */

    exports = function(val) {
        var lowerCase =
            arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : true;
        if (val === null) return lowerCase ? 'null' : 'Null';
        if (val === undefined) return lowerCase ? 'undefined' : 'Undefined';
        if (isNaN(val)) return lowerCase ? 'nan' : 'NaN';
        var ret = objToStr(val).match(regObj);
        if (!ret) return '';
        return lowerCase ? ret[1].toLowerCase() : ret[1];
    };

    var regObj = /^\[object\s+(.*?)]$/;

    return exports;
})({});

/* ------------------------------ stringify ------------------------------ */

export var stringify = _.stringify = (function (exports) {
    /* JSON stringify with support for circular object, function etc.
     *
     * Undefined is treated as null value.
     *
     * |Name  |Desc               |
     * |------|-------------------|
     * |obj   |Object to stringify|
     * |spaces|Indent spaces      |
     * |return|Stringified object |
     */

    /* example
     * stringify({a: function () {}}); // -> '{"a":"[Function function () {}]"}'
     * const obj = {a: 1, b: {}};
     * obj.b = obj;
     * stringify(obj); // -> '{"a":1,"b":"[Circular ~]"}'
     */

    /* typescript
     * export declare function stringify(obj: any, spaces?: number): string;
     */

    /* dependencies
     * type upperFirst toStr isUndef isFn isRegExp 
     */

    exports = function(obj, spaces) {
        return JSON.stringify(obj, serializer(), spaces);
    };

    function serializer() {
        var stack = [];
        var keys = [];
        return function(key, val) {
            if (stack.length > 0) {
                var pos = stack.indexOf(this);

                if (pos > -1) {
                    stack.splice(pos + 1);
                    keys.splice(pos, Infinity, key);
                } else {
                    stack.push(this);
                    keys.push(key);
                }

                var valPos = stack.indexOf(val);

                if (valPos > -1) {
                    if (stack[0] === val) {
                        val = '[Circular ~]';
                    } else {
                        val =
                            '[Circular ~.' + keys.slice(0, valPos).join('.') + ']';
                    }
                }
            } else {
                stack.push(val);
            }

            if (isRegExp(val) || isFn(val)) {
                val = '[' + upperFirst(type(val)) + ' ' + toStr(val) + ']';
            } else if (isUndef(val)) {
                val = null;
            }

            return val;
        };
    }

    return exports;
})({});

/* ------------------------------ LocalStore ------------------------------ */

export var LocalStore = _.LocalStore = (function (exports) {
    /* LocalStorage wrapper.
     *
     * Extend from Store.
     *
     * ### constructor
     *
     * |Name|Desc                  |
     * |----|----------------------|
     * |name|LocalStorage item name|
     * |data|Default data          |
     */

    /* example
     * const store = new LocalStore('licia');
     * store.set('name', 'licia');
     */

    /* typescript
     * export declare class LocalStore extends Store {
     *     constructor(name: string, data?: {});
     * }
     */

    /* dependencies
     * Store safeStorage isEmpty stringify defaults isObj 
     */

    var localStorage = safeStorage('local');
    exports = Store.extend({
        initialize: function LocalStore(name, data) {
            this._name = name;
            data = data || {};
            var localData = localStorage.getItem(name);

            try {
                localData = JSON.parse(localData);
            } catch (e) {
                localData = {};
            }

            if (!isObj(localData)) localData = {};
            data = defaults(localData, data);
            this.callSuper(Store, 'initialize', [data]);
        },
        save: function(data) {
            if (isEmpty(data)) return localStorage.removeItem(this._name);
            localStorage.setItem(this._name, stringify(data));
        }
    });

    return exports;
})({});

/* ------------------------------ stringifyAll ------------------------------ */

export var stringifyAll = _.stringifyAll = (function (exports) {
    /* Stringify object into json with types.
     *
     * |Name   |Desc               |
     * |-------|-------------------|
     * |obj    |Object to stringify|
     * |options|Stringify options  |
     * |return |Stringified object |
     *
     * Available options:
     *
     * |Name              |Desc                     |
     * |------------------|-------------------------|
     * |unenumerable=false|Include unenumerable keys|
     * |symbol=false      |Include symbol keys      |
     * |accessGetter=false|Access getter value      |
     * |timeout=0         |Timeout of stringify     |
     * |depth=0           |Max depth of recursion   |
     * |ignore            |Values to ignore         |
     *
     * When time is out, all remaining values will all be "Timeout".
     */

    /* example
     * stringifyAll(function test() {}); // -> '{"value":"function test() {}","type":"Function",...}'
     */

    /* typescript
     * export declare function stringifyAll(
     *     obj: any,
     *     options?: {
     *         unenumerable?: boolean;
     *         symbol?: boolean;
     *         accessGetter?: boolean;
     *         timeout?: number;
     *         depth?: number;
     *         ignore?: any[];
     *     }
     * ): string;
     */

    /* dependencies
     * escapeJsStr type toStr endWith toSrc keys each Class getProto difference extend isPromise filter now allKeys contain 
     */

    exports = function(obj) {
        var _ref =
                arguments.length > 1 && arguments[1] !== undefined
                    ? arguments[1]
                    : {},
            self = _ref.self,
            _ref$startTime = _ref.startTime,
            startTime = _ref$startTime === void 0 ? now() : _ref$startTime,
            _ref$timeout = _ref.timeout,
            timeout = _ref$timeout === void 0 ? 0 : _ref$timeout,
            _ref$depth = _ref.depth,
            depth = _ref$depth === void 0 ? 0 : _ref$depth,
            _ref$curDepth = _ref.curDepth,
            curDepth = _ref$curDepth === void 0 ? 1 : _ref$curDepth,
            _ref$visitor = _ref.visitor,
            visitor = _ref$visitor === void 0 ? new Visitor() : _ref$visitor,
            _ref$unenumerable = _ref.unenumerable,
            unenumerable = _ref$unenumerable === void 0 ? false : _ref$unenumerable,
            _ref$symbol = _ref.symbol,
            symbol = _ref$symbol === void 0 ? false : _ref$symbol,
            _ref$accessGetter = _ref.accessGetter,
            accessGetter = _ref$accessGetter === void 0 ? false : _ref$accessGetter,
            _ref$ignore = _ref.ignore,
            ignore = _ref$ignore === void 0 ? [] : _ref$ignore;

        var json = '';
        var options = {
            visitor: visitor,
            unenumerable: unenumerable,
            symbol: symbol,
            accessGetter: accessGetter,
            depth: depth,
            curDepth: curDepth + 1,
            timeout: timeout,
            startTime: startTime,
            ignore: ignore
        };
        var t = type(obj, false);

        if (t === 'String') {
            json = wrapStr(obj);
        } else if (t === 'Number') {
            json = toStr(obj);

            if (endWith(json, 'Infinity')) {
                json = '{"value":"'.concat(json, '","type":"Number"}');
            }
        } else if (t === 'NaN') {
            json = '{"value":"NaN","type":"Number"}';
        } else if (t === 'Boolean') {
            json = obj ? 'true' : 'false';
        } else if (t === 'Null') {
            json = 'null';
        } else if (t === 'Undefined') {
            json = '{"type":"Undefined"}';
        } else if (t === 'Symbol') {
            var val = 'Symbol';

            try {
                val = toStr(obj);
                /* eslint-disable no-empty */
            } catch (e) {}

            json = '{"value":'.concat(wrapStr(val), ',"type":"Symbol"}');
        } else {
            if (timeout && now() - startTime > timeout) {
                return wrapStr('Timeout');
            }

            if (depth && curDepth > depth) {
                return wrapStr('{...}');
            }

            json = '{';
            var parts = [];
            var visitedObj = visitor.get(obj);
            var id;

            if (visitedObj) {
                id = visitedObj.id;
                parts.push('"reference":'.concat(id));
            } else {
                id = visitor.set(obj);
                parts.push('"id":'.concat(id));
            }

            parts.push('"type":"'.concat(t, '"'));

            if (endWith(t, 'Function')) {
                parts.push('"value":'.concat(wrapStr(toSrc(obj))));
            } else if (t === 'RegExp') {
                parts.push('"value":'.concat(wrapStr(obj)));
            }

            if (!visitedObj) {
                var enumerableKeys = keys(obj);

                if (enumerableKeys.length) {
                    parts.push(
                        iterateObj(
                            'enumerable',
                            enumerableKeys,
                            self || obj,
                            options
                        )
                    );
                }

                if (unenumerable) {
                    var unenumerableKeys = difference(
                        allKeys(obj, {
                            prototype: false,
                            unenumerable: true
                        }),
                        enumerableKeys
                    );

                    if (unenumerableKeys.length) {
                        parts.push(
                            iterateObj(
                                'unenumerable',
                                unenumerableKeys,
                                self || obj,
                                options
                            )
                        );
                    }
                }

                if (symbol) {
                    var symbolKeys = filter(
                        allKeys(obj, {
                            prototype: false,
                            symbol: true
                        }),
                        function(key) {
                            return typeof key === 'symbol';
                        }
                    );

                    if (symbolKeys.length) {
                        parts.push(
                            iterateObj('symbol', symbolKeys, self || obj, options)
                        );
                    }
                }

                var prototype = getProto(obj);

                if (prototype && !contain(ignore, prototype)) {
                    var proto = '"proto":'.concat(
                        exports(
                            prototype,
                            extend(options, {
                                self: self || obj
                            })
                        )
                    );
                    parts.push(proto);
                }
            }

            json += parts.join(',') + '}';
        }

        return json;
    };

    function iterateObj(name, keys, obj, options) {
        var parts = [];
        each(keys, function(key) {
            var val;
            var descriptor = Object.getOwnPropertyDescriptor(obj, key);
            var hasGetter = descriptor && descriptor.get;
            var hasSetter = descriptor && descriptor.set;

            if (!options.accessGetter && hasGetter) {
                val = '(...)';
            } else {
                try {
                    val = obj[key];

                    if (contain(options.ignore, val)) {
                        return;
                    }

                    if (isPromise(val)) {
                        val.catch(function() {});
                    }
                } catch (e) {
                    val = e.message;
                }
            }

            parts.push(''.concat(wrapKey(key), ':').concat(exports(val, options)));

            if (hasGetter) {
                parts.push(
                    ''
                        .concat(wrapKey('get ' + toStr(key)), ':')
                        .concat(exports(descriptor.get, options))
                );
            }

            if (hasSetter) {
                parts.push(
                    ''
                        .concat(wrapKey('set ' + toStr(key)), ':')
                        .concat(exports(descriptor.set, options))
                );
            }
        });
        return '"'.concat(name, '":{') + parts.join(',') + '}';
    }

    function wrapKey(key) {
        return '"'.concat(escapeJsonStr(key), '"');
    }

    function wrapStr(str) {
        return '"'.concat(escapeJsonStr(toStr(str)), '"');
    }

    function escapeJsonStr(str) {
        return escapeJsStr(str)
            .replace(/\\'/g, "'")
            .replace(/\t/g, '\\t');
    }

    var Visitor = Class({
        initialize: function() {
            this.id = 0;
            this.visited = [];
        },
        set: function(val) {
            var visited = this.visited,
                id = this.id;
            var obj = {
                id: id,
                val: val
            };
            visited.push(obj);
            this.id++;
            return id;
        },
        get: function(val) {
            var visited = this.visited;

            for (var i = 0, len = visited.length; i < len; i++) {
                var obj = visited[i];
                if (val === obj.val) return obj;
            }

            return false;
        }
    });

    return exports;
})({});

/* ------------------------------ throttle ------------------------------ */

export var throttle = _.throttle = (function (exports) {
    /* Return a new throttled version of the passed function.
     *
     * |Name  |Desc                           |
     * |------|-------------------------------|
     * |fn    |Function to throttle           |
     * |wait  |Number of milliseconds to delay|
     * |return|New throttled function         |
     */

    /* example
     * const updatePos = throttle(function () {}, 100);
     * // $(window).scroll(updatePos);
     */

    /* typescript
     * export declare function throttle(fn: Function, wait: number): Function;
     */

    /* dependencies
     * debounce 
     */

    exports = function(fn, wait) {
        return debounce(fn, wait, true);
    };

    return exports;
})({});

/* ------------------------------ uncaught ------------------------------ */

export var uncaught = _.uncaught = (function (exports) {
    /* Handle global uncaught errors and promise rejections.
     *
     * ### start
     *
     * Start handling of errors.
     *
     * ### stop
     *
     * Stop handling.
     *
     * ### addListener
     *
     * Add listener for handling errors.
     *
     * |Name|Desc          |
     * |----|--------------|
     * |fn  |Error listener|
     *
     * ### rmListener
     *
     * Remove listener.
     *
     * ### rmAllListeners
     *
     * Remove all listeners.
     */

    /* example
     * uncaught.start();
     * uncaught.addListener(err => {
     *     // Do something.
     * });
     */

    /* typescript
     * export declare const uncaught: {
     *     start(): void;
     *     stop(): void;
     *     addListener(fn: (err: Error) => void): void;
     *     rmListener(fn: (err: Error) => void): void;
     *     rmAllListeners(): void;
     * };
     */

    /* dependencies
     * isBrowser 
     */

    var listeners = [];
    var isOn = false;
    exports = {
        start: function() {
            isOn = true;
        },
        stop: function() {
            isOn = false;
        },
        addListener: function(fn) {
            listeners.push(fn);
        },
        rmListener: function(fn) {
            var idx = listeners.indexOf(fn);

            if (idx > -1) {
                listeners.splice(idx, 1);
            }
        },
        rmAllListeners: function() {
            listeners = [];
        }
    };

    if (isBrowser) {
        window.addEventListener('error', function(event) {
            callListeners(event.error);
        });
        window.addEventListener('unhandledrejection', function(e) {
            callListeners(e.reason);
        });
    } else {
        process.on('uncaughtException', callListeners);
        process.on('unhandledRejection', callListeners);
    }

    function callListeners(err) {
        if (!isOn) return;

        for (var i = 0, len = listeners.length; i < len; i++) {
            listeners[i](err);
        }
    }

    return exports;
})({});

/* ------------------------------ uniqId ------------------------------ */

export var uniqId = _.uniqId = (function (exports) {
    /* Generate a globally-unique id.
     *
     * |Name  |Desc              |
     * |------|------------------|
     * |prefix|Id prefix         |
     * |return|Globally-unique id|
     */

    /* example
     * uniqId('eusita_'); // -> 'eustia_xxx'
     */

    /* typescript
     * export declare function uniqId(prefix?: string): string;
     */
    var idCounter = 0;

    exports = function(prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
    };

    return exports;
})({});

/* ------------------------------ viewportScale ------------------------------ */

export var viewportScale = _.viewportScale = (function (exports) {
    /* Get viewport scale.
     */

    /* example
     * viewportScale(); // -> 3
     */

    /* typescript
     * export declare function viewportScale(): number;
     */

    /* dependencies
     * meta clamp trim each map isNaN 
     */

    exports = function() {
        var viewport = meta('viewport');
        if (!viewport) return 1;
        viewport = map(viewport.split(','), function(val) {
            return trim(val);
        });
        var minScale = 0.25,
            maxScale = 5,
            initialScale = 1;
        each(viewport, function(val) {
            val = val.split('=');
            var key = val[0];
            val = val[1];
            if (key === 'initial-scale') initialScale = +val;
            if (key === 'maximum-scale') maxScale = +val;
            if (key === 'minimum-scale') minScale = +val;
        });
        var ret = clamp(initialScale, minScale, maxScale); // Some will use ';' to be the separator, need to avoid the wrong result.

        if (isNaN(ret)) return 1;
        return ret;
    };

    return exports;
})({});

/* ------------------------------ wrap ------------------------------ */

export var wrap = _.wrap = (function (exports) {
    /* Wrap the function inside a wrapper function, passing it as the first argument.
     *
     * |Name   |Desc            |
     * |-------|----------------|
     * |fn     |Function to wrap|
     * |wrapper|Wrapper function|
     * |return |New function    |
     */

    /* example
     * const p = wrap(escape, function(fn, text) {
     *     return '<p>' + fn(text) + '</p>';
     * });
     * p('You & Me'); // -> '<p>You &amp; Me</p>'
     */

    /* typescript
     * export declare function wrap(fn: Function, wrapper: Function): Function;
     */

    /* dependencies
     * partial 
     */

    exports = function(fn, wrapper) {
        return partial(wrapper, fn);
    };

    return exports;
})({});

/* ------------------------------ xpath ------------------------------ */

export var xpath = _.xpath = (function (exports) {
    /* Select elements using xpath, IE is not supported.
     *
     * |Name  |Desc           |
     * |------|---------------|
     * |xpath |Xpath          |
     * |return|Target elements|
     */

    /* example
     * xpath('//html/body'); // -> [body]
     */

    /* typescript
     * export declare function xpath(xpath: string): HTMLElement[];
     */
    exports = function(xpath) {
        var ret = [];
        var nodesSnapshot = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
            ret.push(nodesSnapshot.snapshotItem(i));
        }

        return ret;
    };

    return exports;
})({});

export default _;
