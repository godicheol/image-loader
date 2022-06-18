(function() {
    'use strict'

    var __exports = {};
    var __methods = {};
    var __instances = [];
    var __events = {};
    var __queues = [];

    var __schema = {
        id: "string",
        index: "number",
        name: "string",
        size: "number",
        type: "string",
        width: "number",
        height: "number",
        naturalWidth: "number",
        naturalHeight: "number",
        element: "element",
        blob: "blob",
        url: "string",
        match: "function",
        find: "function",
        set: "function",
        check: "function",
        load: "function",
        copy: "function",
        remove: "function",
        prevSibling: "img",
        nextSibling: "img",
        createdAt: "number",
        loadedAt: "number",
    }

    function Img(arg) {
        var generateUID = __methods.generateUID;
        var checkType = __methods.checkType;
        var isUndefined = __methods.isUndefined;
        var isNull = __methods.isNull;
        var isString = __methods.isString;
        var isNumber = __methods.isNumber;
        var isNumeric = __methods.isNumeric;
        var isObject = __methods.isObject;
        var isArray = __methods.isArray;
        var isBlob = __methods.isBlob;
        var isNode = __methods.isNode;
        var isElement = __methods.isElement;
        var isFunction = __methods.isFunction;
        var isDate = __methods.isDate;
        var isImg = __methods.isImg;
        var isOperator = __methods.isOperator;
        var calcQuery = __methods.calcQuery;
        var createURL = URL.createObjectURL;
        var revokeURL = URL.revokeObjectURL;

        // check argument
        if (!isObject(arg)) {
            arg = {};
        }

        // set value
        this.index = __instances.length;
        this.id = generateUID();
        this.element = arg.element;
        this.blob = arg.blob;
        this.prevSibling = __instances[this.index - 1];
        this.nextSibling = __instances[this.index + 1];
        this.createdAt = new Date().getTime();
        if (this.blob) {
            this.name = this.blob.name;
            this.size = this.blob.size;
            this.type = this.blob.type;
        }

        // set methods
        this.match = function(query) {
            if (!isObject(query)) {
                query = {};
            }
            return calcQuery(this, query);
        }
        this.set = function(arg) {
            if (!isObject(arg)) {
                throw new Error("Img.set() argument must be Object");
            }
            var schema = __schema;
            var keys = Object.keys(schema);
            var argKeys = Object.keys(arg);
            var argLen = argKeys.length;
            var i, k;
            for (i = 0; i < argLen; i++) {
                k = argKeys[i];
                if (keys.indexOf(k) > -1) {
                    this[k] = arg[k];
                }
            }
            this.check();
        }
        this.check = function() {
            var schema = __schema;
            var k = Object.keys(this);
            var len = k.length;
            var i;
            for (i = 0; i < len; i++) {
                if (!checkType(this[k[i]], schema[k[i]])) {
                    delete this[k[i]];
                }
            }
            return true;
        }
        this.load = function(cb) {
            var img = this;
            var element = this.element;
            
            if (isUndefined(this.element)) {
                if (isFunction(cb)) {
                    return cb(new Error("Img.element not found"));
                }
            }
            if (isUndefined(this.url)) {
                if (isFunction(cb)) {
                    return cb(new Error("Img.url not found"));
                }
            }
            if (!isUndefined(this.loadedAt)) {
                if (isFunction(cb)) {
                    return cb(new Error("Img was already loaded"));
                }
            }

            element.onload = function() {
                img.loadedAt = new Date().getTime();
                img.width = element.width;
                img.height = element.height;
                img.naturalWidth = element.naturalWidth;
                img.naturalHeight = element.naturalHeight;
                if (isFunction(cb)) {
                    return cb(null, {
                        complete: element.complete,
                        src: element.src,
                        alt: element.alt,
                        srcset: element.srcset,
                        x: element.x,
                        y: element.y,
                        width: element.width,
                        height: element.height,
                        naturalWidth: element.naturalWidth,
                        naturalHeight: element.naturalHeight,
                    });
                }
            }
            element.onerror = function() {
                if (isFunction(cb)) {
                    return cb(new Error("Img failed to load"));
                }
            }
            element.src = img.url;
        }
        this.remove = function() {
            var id = this.id;
            var index = this.index;
            var nextSibling = this.nextSibling;
            var prevSibling = this.prevSibling;

            // set siblings
            if (!isUndefined(nextSibling) && !isUndefined(prevSibling)) {
                nextSibling.prevSibling = prevSibling;
                prevSibling.nextSibling = nextSibling;
            } else if (isUndefined(nextSibling) && !isUndefined(prevSibling) && isUndefined(nextSibling.prevSibling)) {
                delete nextSibling.prevSibling;
            } else if (!isUndefined(nextSibling) && isUndefined(prevSibling) && isUndefined(prevSibling.nextSibling)) {
                delete prevSibling.nextSibling;
            }

            // set index

            // 

            delete this;
        }
        this.copy = function() {
            var schema = __schema;
            var keys = Object.keys(schema);
            var len = keys.length;
            var i;
            var output = {};
            for (i = 0; i < len; i++) {
                if (this.hasOwnProperty(keys[i]) && schema[keys[i]] !== "function") {
                    output[keys[i]] = this[keys[i]];
                }
            }
            return output;
        }

        // check values type
        this.check();

        // convert blob to url
        if (!isUndefined(this.blob) && isUndefined(this.url)) {
            this.url = createURL(this.blob);
        }

        // set sibling
        if (isImg(this.prevSibling)) {
            this.prevSibling.nextSibling = this;
        }
        if (isImg(this.nextSibling)) {
            this.nextSibling.prevSibling = this;
        }

        // insert to array
        __instances.push(this);
    }

    __methods.generateUID = function() {
        return ("0000" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36)).slice(-4);
    }

    __methods.isUndefined = function(arg) {
        return typeof(arg) === "undefined";
    }

    __methods.isNull = function(arg) {
        return arg === null;
    }

    __methods.isBoolean = function(arg) {
        return (arg === true || arg === false);
    }

    __methods.isString = function(arg) {
        return typeof(arg) === "string";
    }

    __methods.isNumber = function(arg) {
        return typeof(arg) === "number";
    }

    __methods.isNumeric = function(arg) {
        return (typeof(arg) === "string") && !isNaN(parseFloat(arg)) && isFinite(arg);
    }

    __methods.isObject = function(arg) {
        return (typeof(arg) === "object" && arg !== null);
    }

    __methods.isFunction = function(arg) {
        return typeof(arg) === "function";
    }

    __methods.isBlob = function(arg) {
        return (arg instanceof Blob);
    }

    __methods.isNode = function(arg) {
        return (typeof(Node) === "object" ? (arg instanceof Node) : typeof(arg) === "object" && arg !== null && typeof(arg.nodeType) === "number" && typeof(arg.nodeName) === "string");
    }
      
    __methods.isElement = function(arg) {
        return (typeof(HTMLElement === "object") ? (arg instanceof HTMLElement) : typeof(arg) === "object" && arg !== null  && arg.nodeType === 1 && typeof(arg.nodeName) === "string");
    }

    __methods.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    }

    __methods.isDate = function(arg) {
        return (arg instanceof Date) && !isNaN(arg.valueOf())
    }

    __methods.isImg = function(arg) {
        return (arg instanceof Img);
    }

    __methods.isOperator = function(arg) {
        return /^\$+(in|or|and|eq|ne|lte|gte|lt|gt)$/.test(arg);
    }

    __methods.isField = function(arg) {
        return /^(id|index|url|createdAt|loadedAt)$/.test(arg);
    }

    __methods.calcQuery = function(a, b) {
        var isNumber = __methods.isNumber;
        var isNumeric = __methods.isNumeric;
        var isArray = __methods.isArray;
        var isObject = __methods.isObject;
        var isField = __methods.isField;
        var isOperator = __methods.isOperator;
        var pars, calc;

        if (!isObject(a) || !isObject(b)) {
            return false;
        }

        // parse query
        pars = function(obj, query) {
            var i;
            var keys;
            var field;
            var value;
            var len;
            var count = 0;
            var res;
            
            keys = Object.keys(query);
            len = keys.length;
            for (i = 0; i < len; i++) {
                field = keys[i];
                value = query[field];
                res = calc(obj, field, value);
                if (res) {
                    count++;
                } else {
                    return false;
                }
            }
            return count === len;
        }

        // calc operator
        calc = function(obj, field, value) {
            var i;
            var keys;
            var key;
            var len;
            var count = 0;
            var res;
            var x = obj[field];
            var y;

            if (isOperator(field) && isArray(value)) {
                if (field === "$or") {
                    len = value.length;
                    for (i = 0; i < len; i++) {
                        res = pars(obj, value[i]);
                        if (res) {
                            count++;
                            break;
                        }
                    }
                    return count > 0;
                } else if (field === "$and") {
                    len = value.length;
                    for (i = 0; i < len; i++) {
                        res = pars(obj, value[i]);
                        if (res) {
                            count++;
                        } else {
                            break;
                        }
                    }
                    return count === len;
                } else {
                    return false;
                }
            } else if (isObject(value)) {
                keys = Object.keys(value);
                len = keys.length;
                for (i = 0; i < len; i++) {
                    key = keys[i];
                    y = value[key];
                    if (isNumber(x) && isNumeric(y)) {
                        y = parseInt(y, 10);
                    }
                    if (isOperator(key)) {
                        if (
                            (key === "$eq") &&
                            (x === y)
                        ) {
                            count++;
                        } else if (
                            (key === "$ne") &&
                            (x !== y)
                        ) {
                            count++;
                        } else if (
                            (key === "$in") &&
                            isArray(y) &&
                            (y.indexOf(x) > -1)
                        ) {
                            count++;
                        } else if (
                            (key === "$gt") &&
                            (x > y)
                        ) {
                            count++;
                        } else if (
                            (key === "$gte") &&
                            (x >= y)
                        ) {
                            count++;
                        } else if (
                            (key === "$lt") &&
                            (x < y)
                        ) {
                            count++;
                        } else if (
                            (key === "$lte") &&
                            (x <= y)
                        ) {
                            count++;
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                return count === len;
            } else if (isField(field)) {
                y = value;
                if (isNumber(x) && isNumeric(y)) {
                    y = parseInt(y, 10);
                }
                return x === y;
            } else {
                return false;
            }
        }
        return pars(a, b);
    }

    __methods.checkType = function(value, type) {
        var isUndefined = __methods.isUndefined;
        var isNull = __methods.isNull;
        var isString = __methods.isString;
        var isNumber = __methods.isNumber;
        var isNumeric = __methods.isNumeric;
        var isObject = __methods.isObject;
        var isArray = __methods.isArray;
        var isBlob = __methods.isBlob;
        var isNode = __methods.isNode;
        var isElement = __methods.isElement;
        var isFunction = __methods.isFunction;
        var isDate = __methods.isDate;
        var isImg = __methods.isImg;

        switch(type) {
            case "undefined": return isUndefined(value);
            case "null": return isNull(value);
            case "boolean": return isBoolean(value);
            case "string": return isString(value);
            case "number": return isNumber(value);
            case "numeric": return isNumeric(value);
            case "object": return isObject(value);
            case "array": return isArray(value);
            case "blob": return isBlob(value);
            case "node": case "element": return isNode(value) && isElement(value);
            case "function": return isFunction(value);
            case "date": return isDate(value);
            case "img": return isImg(value);
            default: return false;
        }
    }

    __methods.copyObject = function(obj) {
        var output = {};
        var keys = Object.keys(obj);
        var len = keys.length;
        var i;
        for (i = 0; i < len; i++) {
            if (obj.hasOwnProperty(keys[i])) {
                output[keys[i]] = obj[keys[i]];
            }
        }
        return output;
    }

    // 
    // exports
    // 

    __exports.getOne = function(query) {
        var instances = __instances;
        var len = instances.length;
        var i;
        var output;
        for (i = 0; i < len; i++) {
            if (instances[i].match(query)) {
                output = instances[i];
            }
        }
        return output;
    }

    __exports.getMany = function(query) {
        var instances = __instances;
        var len = instances.length;
        var i;
        var output = [];
        for (i = 0; i < len; i++) {
            if (instances[i].match(query)) {
                output.push(instances[i]);
            }
        }
        return output;
    }

    if (typeof(window.Img) === "undefined") {
        window.Img = Img;
    }
    if (typeof(window.imageLoader) === "undefined") {
        window.imageLoader = __exports;
    }
})();