(function() {
    'use strict'

    var __images = [];
    var __events = [];
    var __methods = {};

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
        src: "string",
        blob: "blob",
        match: "function",
        find: "function",
        set: "function",
        unset: "function",
        check: "function",
        load: "function",
        fetch: "function",
        copy: "function",
        move: "function",
        remove: "function",
        split: "function",
        prevSibling: "img",
        nextSibling: "img",
        createdAt: "date",
        loadedAt: "date",
    }

    // test
    function Evt(arg) {
        var events = __events;
        var isFunction = __methods.isFunction;

        if (!isFunction(arg)) {
            throw new Error("Parament must be Function");
        }
        
        this.function = arg;

        this.exec = function() {
            try {
                // execute first event
                this.function();
            } catch(err) {
                console.error(err);
            }
            // remove first event
            events.splice(0, 1);

            if (events.length > 0) {
                events[0].exec();
            }
        }
    }

    function Img(arg) {
        var images = __images;
        var schema = __schema;
        var events = __events;
        var generateUID = __methods.generateUID;
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
        var isError = __methods.isError;
        var isFunction = __methods.isFunction;
        var isDate = __methods.isDate;
        var isUrl = __methods.isUrl;
        var isImg = __methods.isImg;
        var isField = __methods.isField;
        var isOperator = __methods.isOperator;
        var checkType = __methods.checkType;
        var checkValue = __methods.checkValue;
        var checkImg = __methods.checkImg;
        var createURL = URL.createObjectURL;
        var revokeURL = URL.revokeObjectURL;

        // check argument
        if (!isObject(arg)) {
            arg = {};
        }

        // set methods
        this.match = function(obj) {
            if (!isObject(obj)) {
                obj = {};
            }
            var pars;
            var calc;

            // parse query
            pars = function(img, query) {
                var i;
                var keys;
                var field;
                var value;
                var len;
                var res;
                var count = 0;
                
                keys = Object.keys(query);
                len = keys.length;
                for (i = 0; i < len; i++) {
                    field = keys[i];
                    value = query[field];
                    res = calc(img, field, value);
                    if (res) {
                        count++;
                    } else {
                        return false;
                    }
                }
                return count === len;
            }

            // calc operator
            calc = function(img, field, value) {
                var i;
                var keys;
                var key;
                var len;
                var count = 0;
                var res;
                var x = img[field];
                var y;

                if (isOperator(field) && isArray(value)) {
                    if (field === "$or") {
                        len = value.length;
                        for (i = 0; i < len; i++) {
                            res = pars(img, value[i]);
                            if (res) {
                                count++;
                                break;
                            }
                        }
                        return count > 0;
                    } else if (field === "$and") {
                        len = value.length;
                        for (i = 0; i < len; i++) {
                            res = pars(img, value[i]);
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
                        if (isDate(x)) {
                            x = x.getTime();
                        }
                        if (isDate(y)) {
                            y = y.getTime();
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
                    if (isDate(x)) {
                        x = x.getTime();
                    }
                    if (isDate(y)) {
                        y = y.getTime();
                    }
                    return x === y;
                } else {
                    return false;
                }
            }
            return pars(this, obj);
        }
        this.set = function(obj) {
            if (!isObject(obj)) {
                throw new Error("Img.set() argument must be Object");
            }
            var keys = Object.keys(obj);
            var len = keys.length;
            var i;
            var field;
            var value;
            var res;

            // check field, value
            for (i = 0; i < len; i++) {
                field = keys[i];
                value = obj[field];
                if (!schema.hasOwnProperty(field)) {
                    throw new Error("`"+field+"` is not valid");
                }
                if (schema[field] === "function") {
                    throw new Error("`"+field+"` is uneditable fiend");
                }
                if (!checkValue(field, value)) {
                    throw new Error("`"+field+"` is not valid type");
                }
                if (field === "id") {
                    throw new Error("`"+field+"` is undefined field");
                }
                if (field === "blob" && !isUndefined(this.loadedAt) ) {
                    throw new Error("Img.blob can\'t edit after has been loaded");
                }
                if (field === "src" && !isUndefined(this.loadedAt) ) {
                    throw new Error("Img.src can\'t edit after has been loaded");
                }
            }

            // set value
            for (i = 0; i < len; i++) {
                field = keys[i];
                value = obj[field];
                if (field === "blob") {
                    try {
                        this.blob = value;
                        this.src = createURL(value);
                        this.name = value.name;
                        this.type = value.type;
                        this.size = value.size;
                    } catch(err) {
                        console.error(err);
                        delete this.blob;
                        delete this.src;
                        delete this.name;
                        delete this.type;
                        delete this.size;
                    }
                } else if (field === "index") {
                    this.move(value);
                } else {
                    this[field] = value;
                }
            }
            return true;
        }
        this.unset = function(obj) {
            if (!isObject(obj)) {
                throw new Error("Img.unset() argument must be Object");
            }
            var keys = Object.keys(obj);
            var len = keys.length;
            var i, field;

            // check field, value
            for (i = 0; i < len; i++) {
                field = keys[i];
                if (!schema.hasOwnProperty(field)) {
                    throw new Error("`"+field+"` is not valid");
                }
                if (schema[field] === "function") {
                    throw new Error("`"+field+"` is uneditable");
                }
                if (field === "blob" && !isUndefined(this.loadedAt) ) {
                    throw new Error("Img.blob can\'t edit after has been loaded");
                }
                if (field === "src" && !isUndefined(this.loadedAt) ) {
                    throw new Error("Img.src can\'t edit after has been loaded");
                }
            }

            // unset value
            for (i = 0; i < len; i++) {
                field = keys[i];
                if (obj[field]) {
                    delete this[field];
                }
            }
            return true;
        }
        this.load = function(cb) {
            try {
                var img = this;
                var element = this.element;
                var blob = this.blob;
                var loadedAt = this.loadedAt;
                
                if (isUndefined(element)) {
                    throw new Error("Img.element not found");
                }
                if (!isUndefined(loadedAt)) {
                    throw new Error("Img was already loaded");
                }
                if (isUndefined(blob)) {
                    throw new Error("Img.blob not found");
                }
                element.onload = function() {
                    img.set({
                        width: element.width,
                        height: element.height,
                        naturalWidth: element.naturalWidth,
                        naturalHeight: element.naturalHeight,
                        loadedAt: new Date(),
                    });
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
                    throw new Error("Img failed to load");
                }
                element.src = img.src;
                return false;
            } catch(err) {
                if (isFunction(cb)) {
                    return cb(err);
                }
            }
        }
        this.fetch = function(url, cb) {
            var img = this;
            fetch(url)
                .then(function(res) {
                    if (!res.ok) {
                        throw new Error("Fetch error");
                    }
                    return res.blob();
                })
                .then(function(blob) {
                    img.set({
                        blob: blob
                    });
                    return cb(null, true);
                })
                .catch(function(err) {
                    return cb(err);
                });
        }
        this.remove = function() {
            var index = this.index;
            var src = this.src;
            var nextSibling = this.nextSibling;
            var prevSibling = this.prevSibling;
            var n, i;

            // remove from array
            images.splice(index, 1);

            // set siblings
            if (!isUndefined(nextSibling) && !isUndefined(prevSibling)) {
                nextSibling.prevSibling = prevSibling;
                prevSibling.nextSibling = nextSibling;
            } else if (!isUndefined(nextSibling) && isUndefined(prevSibling) && !isUndefined(nextSibling.prevSibling)) {
                delete nextSibling.prevSibling;
            } else if (isUndefined(nextSibling) && !isUndefined(prevSibling) && !isUndefined(prevSibling.nextSibling)) {
                delete prevSibling.nextSibling;
            }

            // set index
            n = nextSibling;
            i = index;
            while(!isUndefined(n)) {
                n.index = i;
                n = n.nextSibling;
                i++;
            }

            // revoke url
            revokeURL(src);

            // ?
            delete this;
            
            return true;
        }
        this.move = function(index) {
            var max = images.length - 1;
            var min = 0;
            var curr = this.index;
            var len = images.length;
            var i;
            var img;

            if (isNumeric(index)) {
                index = parseInt(index, 10);
            } else if (!isNumber(index)) {
                throw new Error("Parameter must be Number");
            }
            if (
                index === curr ||
                index > max ||
                index < min
            ) {
                return false;
            }

            // remove
            images.splice(curr, 1);

            // insert
            images.splice(index, 0, this);

            // set index
            i = Math.min(curr, index);
            for (i; i < len; i++) {
                img = images[i];
                if (!isUndefined(img)) {
                    img.index = i;
                } else {
                    break;
                }
            }
            return true;
        }
        this.copy = function() {
            var keys = Object.keys(schema);
            var len = keys.length;
            var i;
            var k;
            var output = {};
            for (i = 0; i < len; i++) {
                k = keys[i];
                if (
                    this.hasOwnProperty(k) &&
                    !isFunction(schema[k])
                ) {
                    output[k] = this[k];
                }
            }
            return output;
        }

        // set value
        this.index = images.length;
        this.id = generateUID();
        this.prevSibling = images[this.index - 1];
        this.nextSibling = images[this.index + 1];
        this.createdAt = new Date();

        // set value from parameter
        this.set(arg);

        // check values type
        checkImg(this);

        // set siblings
        if (isImg(this.prevSibling)) {
            this.prevSibling.nextSibling = this;
        }
        if (isImg(this.nextSibling)) {
            this.nextSibling.prevSibling = this;
        }

        // insert to array
        __images.push(this);
    }
    
    // 
    // methods
    // 

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
        return typeof(arg) === "boolean";
    }
    __methods.isString = function(arg) {
        return typeof(arg) === "string";
    }
    __methods.isNumber = function(arg) {
        return typeof(arg) === "number" && !Number.isNaN(arg);
    }
    __methods.isNumeric = function(arg) {
        return (typeof(arg) === "string") && !Number.isNaN(parseFloat(arg)) && isFinite(arg);
    }
    __methods.isObject = function(arg) {
        return (typeof(arg) === "object" && arg !== null);
    }
    __methods.isFunction = function(arg) {
        return typeof(arg) === "function";
    }
    __methods.isFile = function(arg) {
        return (arg instanceof File);
    }
    __methods.isBlob = function(arg) {
        return (arg instanceof Blob);
    }
    __methods.isError = function(arg) {
        return (arg instanceof Error);
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
        return (arg instanceof Date) && !Number.isNaN(arg.valueOf())
    }
    __methods.isUrl = function(arg) {
        if (typeof(URL) !== "undefined") {
            try {
                return /^(https:|http:|file:)$/i.test(new URL(arg).protocol);
            } catch(err) {
                return false;
            }
        } else {
            var re = new RegExp('^(https?:\\/\\/)?'+ // Protocal
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ 
                '((\\d{1,3}\\.){3}\\d{1,3}))'+ // domain name or ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
            return re.test(arg);
        }
    }
    __methods.isImg = function(arg) {
        return (arg instanceof Img);
    }
    __methods.isOperator = function(arg) {
        return /^\$+(in|or|and|eq|ne|lte|gte|lt|gt)$/.test(arg);
    }
    __methods.isField = function(arg) {
        return /^(id|index|src|name|size|type|width|height|naturalWidth|naturalHeight|createdAt|loadedAt)$/.test(arg);
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
        var isFile = __methods.isFile;
        var isNode = __methods.isNode;
        var isElement = __methods.isElement;
        var isError = __methods.isError;
        var isFunction = __methods.isFunction;
        var isDate = __methods.isDate;
        var isImg = __methods.isImg;
        var isUrl = __methods.isUrl;

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
            case "file": return isFile(value);
            case "node": return isNode(value);
            case "element": return isElement(value);
            case "function": return isFunction(value);
            case "date": return isDate(value);
            case "img": return isImg(value);
            case "url": return isUrl(value);
            case "error": return isError(value);
            default: return false;
        }
    }
    __methods.checkValue = function(field, value) {
        var checkType = __methods.checkType;
        var schema = __schema;
        return checkType(value, schema[field]);
    }
    __methods.checkImg = function(img) {
        var checkType = __methods.checkType;
        var schema = __schema;
        var keys = Object.keys(img);
        var len = keys.length;
        var i, field;
        for (i = 0; i < len; i++) {
            field = keys[i];
            if (!checkType(img[field], schema[field])) {
                delete img[field];
            }
        }
        return true;
    }

    // 
    // statics
    // 

    Img.getOne = function(query) {
        var images = __images;
        var len = images.length;
        var img;
        var i;
        var output;
        for (i = 0; i < len; i++) {
            img = images[i];
            if (img.match(query)) {
                output = img;
                break;
            }
        }
        return output;
    }
    Img.getMany = function(query) {
        var images = __images;
        var len = images.length;
        var img;
        var i;
        var output = [];
        for (i = 0; i < len; i++) {
            img = images[i];
            if (img.match(query)) {
                output.push(img);
            }
        }
        return output;
    }
    Img.removeOne = function(query) {
        var images = __images;
        var len = images.length;
        var i;
        var img;
        var res;
        var output = {
            matchedCount: 0,
            removedCount: 0,
        }
        for (i = 0; i < len; i++) {
            img = images[i];
            if (img.match(query)) {
                output.matchedCount++;
                res = img.remove();
                if (res) {
                    output.removedCount++;
                }
                break;
            }
        }
        return output;
    }
    Img.removeMany = function(query) {
        var images = __images;
        var len = images.length;
        var i;
        var res;
        var img;
        var output = {
            matchedCount: 0,
            removedCount: 0,
        }
        for (i = 0; i < len; i++) {
            img = images[i];
            if (img.match(query)) {
                output.matchedCount++;
                res = img.remove();
                if (res) {
                    output.removedCount++;
                }
            }
        }
        return output;
    }
    Img.updateOne = function(query, arg) {}
    Img.updateMany = function(query, arg) {}

    if (typeof(window.Img) === "undefined") {
        window.Img = Img;
    }
})();