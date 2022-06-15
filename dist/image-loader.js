(function() {
    'use strict';

    var __exports = {};
    var __privates = {};
    var __images = [];
    var __queues = [];

    __privates.isBlob = function(blob) {
        return blob instanceof Blob;
    }

    __privates.isNode = function(element) {
        return (typeof(Node) === "object" ? (element instanceof Node) : typeof(element) === "object" && element !== null && typeof(element.nodeType) === "number" && typeof(element.nodeName) === "string");
    }
      
    __privates.isElement = function(element) {
        return (typeof(HTMLElement === "object") ? (element instanceof HTMLElement) : typeof(element) === "object" && element !== null  && element.nodeType === 1 && typeof(element.nodeName) === "string");
    }

    __privates.getImage = function(query, ref) {
        if (typeof(query) === "undefined") {
            query = {};
        }
        var copyObject = __privates.copyObject;
        var len = __images.length;
        var keys = Object.keys(query);
        var keyLen = keys.length;
        var output;
        var x;
        var k;  
        var i;
        var j;
        var c;
        for (i = 0; i < len; i++) {
            x = __images[i];
            c = 0;
            for (j = 0; j < keyLen; j++) {
                k = keys[j];
                if (x[k] === query[k]) {
                    c++;
                }
            }
            if (c === keyLen) {
                if (ref) {
                    output = x;
                } else {
                    output = copyObject(x);
                }
                break;
            }
        }
        return output;
    }

    __privates.getImages = function(query, ref) {
        if (typeof(query) === "undefined") {
            query = {};
        }
        var copyObject = __privates.copyObject;
        var len = __images.length;
        var keys = Object.keys(query);
        var keyLen = keys.length;
        var output = [];
        var x;
        var k;  
        var i;
        var j;
        var c;
        for (i = 0; i < len; i++) {
            x = __images[i];
            c = 0;
            for (j = 0; j < keyLen; j++) {
                k = keys[j];
                if (x[k] === query[k]) {
                    c++;
                }
            }
            if (c === keyLen) {
                if (ref) {
                    output.push(x);
                } else {
                    output.push(copyObject(x));
                }
            }
        }
        return output;
    }

    __privates.copyObject = function(obj) {
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

    __privates.generateUID = function() {
        var getImage = __privates.getImage;
        var mx = 128;
        var i = 0;
        var getUID = function() {
            var id = ("0000" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36)).slice(-4);
            var image = getImage({id: id}, true);
            if (typeof(image) === "undefined") {
                return id;
            } else if (i < mx) {
                i++;
                return getUID();
            } else {
                return undefined;
            }
        }
        return getUID();
    }

    __privates.setSiblings = function(image) {
        var nextImage = __images[image.index + 1];
        var prevImage = __images[image.index - 1];
        if (typeof(nextImage) === "undefined") {
            nextImage = null;
        } else {
            nextImage.prevSibling = image;
        }
        if (typeof(prevImage) === "undefined") {
            prevImage = null;
        } else {
            prevImage.nextSibling = image;
        }
        image.nextSibling = nextImage;
        image.prevSibling = prevImage;
        return true;
    }

    __privates.setMethods = function(image) {
        image.remove = function() {
            return __exports.removeOne({id: this.id});
        }
        image.load = function(cb) {
            return __exports.loadOne({id: this.id}, cb);
        }
        image.set = function(element) {
            return __exports.setOne({id: this.id}, element);
        }
    }

    __privates.removeMethods = function(image) {
        image.remove = null;
        image.load = null;
        image.set = null;
        return true;
    }

    __exports.addOne = function(blob) {
        var createObjectURL = URL.createObjectURL;
        var setSiblings = __privates.setSiblings;
        var setMethods = __privates.setMethods;
        var generateUID = __privates.generateUID;
        var copyObject = __privates.copyObject;
        var isBlob = __privates.isBlob;
        var output;
        var newImage = {};

        if (!isBlob(blob)) {
            throw new Error("Parameter must be Blob");
        }

        newImage.id = generateUID();
        newImage.index = __images.length;
        newImage.elements = [];
        newImage.url = createObjectURL(blob);
        newImage.nextSibling = null;
        newImage.prevSibling = null;
        newImage.createdAt = new Date().getTime();
        setSiblings(newImage);
        setMethods(newImage);
        __images.push(newImage);
        output = copyObject(newImage);
        return output;
    }

    __exports.addMany = function(blobs) {
        var createObjectURL = URL.createObjectURL;
        var setSiblings = __privates.setSiblings;
        var setMethods = __privates.setMethods;
        var generateUID = __privates.generateUID;
        var copyObject = __privates.copyObject;
        var isBlob = __privates.isBlob;
        var len = blobs.length;
        var hasError = false;
        var output = [];
        var i;

        for (i = 0; i < len; i++) {
            if (!isBlob(blobs[i])) {
                hasError = true;
                break;
            }
        }
        if (hasError) {
            return false;
        }
        for (i = 0; i < len; i++) {
            var newImage = {};
            newImage.id = generateUID();
            newImage.index = __images.length;
            newImage.elements = [];
            newImage.url = createObjectURL(blobs[i]);
            newImage.nextSibling = null;
            newImage.prevSibling = null;
            newImage.createdAt = new Date().getTime();
            setSiblings(newImage);
            setMethods(newImage);
            __images.push(newImage);
            output.push(copyObject(newImage));
        }
        return output;
    }

    __exports.getOne = function(query) {
        if (typeof(query) === "undefined") {
            query = {};
        }
        var getImage = __privates.getImage;
        var image = getImage(query);
        return image;
    }

    __exports.getMany = function(query) {
        if (typeof(query) === "undefined") {
            query = {};
        }
        var getImages = __privates.getImages;
        var images = getImages(query);
        return images;
    }

    __exports.setOne = function(query, element) {
        if (typeof(query) === "undefined") {
            query = {};
        }
        var isElement = __privates.isElement;
        var isNode = __privates.isNode;
        var getImage = __privates.getImage;
        var image = getImage(query, true);
        var hasError = false;
        var len;
        var i;

        if ((typeof(image) === "undefined") || !isElement(element) || !isNode(element)) {
            return false;
        }
        len = image.elements.length;
        for (i = 0; i < len; i++) {
            if (image.elements[i].isSameNode(element)) {
                hasError = true;
                break;
            }
        }
        if (hasError) {
            return false;
        }
        image.elements.push(element);
        return true;
    }

    __exports.setMany = function(query, element) {
        if (typeof(query) === "undefined") {
            query = {};
        }
        var isElement = __privates.isElement;
        var isNode = __privates.isNode;
        var getImages = __privates.getImages;
        var images = getImages(query, true);
        var len = images.length;
        var elemLen;
        var hasError = false;
        var i;
        var j;
        
        if (!isElement(element) || !isNode(element)) {
            return false;
        }
        for (i = 0; i < len; i++) {
            elemLen = images[i].elements.length;
            for (j = 0; j < elemLen; j++) {
                if (images[i].elements[j].isSameNode(element)) {
                    hasError = true;
                    break;
                }
            }
            if (hasError) {
                break;
            }
        }
        if (hasError) {
            return false;
        }
        for (i = 0; i < len; i++) {
            images[i].elements.push(element);
        }
        return true;
    }

    __exports.removeOne = function(query) {
        if (typeof(query) === "undefined") {
            query = {};
        }
        var revokeObjectURL = URL.revokeObjectURL;
        var getImage = __privates.getImage;
        var setSiblings = __privates.setSiblings;

        var image = getImage(query, true);
        var nextImage;
        var idx;
        var url;

        if (typeof(image) === "undefined") {
            return false;
        }

        idx = image.index;
        nextImage = image.nextSibling;
        url = image.url;
        __images.splice(idx, 1); // remove
        revokeObjectURL(url);

        while(!!nextImage) {
            nextImage.index = idx;
            setSiblings(nextImage);
            nextImage = nextImage.nextSibling;
            idx++;
        }

        return true;
    }

    __exports.loadOne = function(query, cb) {
        if (typeof(query) === "undefined") {
            query = {};
        }
        var copyObject = __privates.copyObject;
        var getImage = __privates.getImage;
        var image = getImage(query, true);
        var output;

        if (typeof(image) === "undefined") {
            return cb(new Error("Image not found"));
        }

        if (image.status === 0) {
            var img = new Image();
            img.onload = function() {
                image.status = 1;
                output = copyObject(image);
                return cb(null, output);
            }
            img.onerror = function() {
                image.status = 9;
                return cb(new Error("Load error"));
            }
            img.src = image.url;
            return cb(null, image);
        } else if (image.status === 1) {
            output = copyObject(image);
            return cb(null, output);
        } else if (image.stutus === 2) {
            output = copyObject(image);
            return cb(null, output);
        }
    }

    __exports.loadMany = function(query, cb) {
        if (typeof(query) === "undefined") {
            query = {};
        }
        var copyObject = __privates.copyObject;
        var getImages = __privates.getImages;
        var images = getImages(query, true);
        var output = [];
        var l = images.length;
        var c = 0;
        var x;

        var fn = function() {
            if (c < l) {
                x = images[c];
                var img = new Image();
                img.onload = function() {
                    x.status = 1;
                    output.push(copyObject(x));
                    c++;
                    fn();
                }
                img.onerror = function() {
                    x.status = 9;
                    c++;
                    fn();
                }
                if (x.status === 0) {
                    img.src = x.url;
                } else {
                    c++;
                    fn();
                }
            } else {
                return cb(null, output);
            }
        }

        fn();
    }

    if (typeof(window.imageLoader) === "undefined") {
        window.imageLoader = __exports;
    }
})();