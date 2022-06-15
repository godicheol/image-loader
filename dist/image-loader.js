(function() {
    'use strict';

    var __exports = {};
    var __privates = {};
    var __images = [];

    var __statusCodes = {
        0: "unloaded",
        1: "onload",
        2: "loaded",
        9: "error",
    }

    __privates.isBlob = function(blob) {
        return blob instanceof Blob;
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
    }

    __privates.removeMethods = function(image) {
        image.remove = null;
        image.load = null;
        return true;
    }

    __exports.getOne = function(query) {
        if (typeof(query) === "undefined") {
            query = {};
        }
        var getImage = __privates.getImage;
        var image = getImage(query, false);
        
        if (typeof(image) === "undefined") {
            return undefined;
        }

        return image;
    }

    __exports.getMany = function(query) {
        if (typeof(query) === "undefined") {
            query = {};
        }
        var getImages = __privates.getImages;
        var images = getImages(query, false);

        return images;
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
        newImage.status = 0; // unloaded
        newImage.url = createObjectURL(blob);
        newImage.nextSibling = null;
        newImage.prevSibling = null;
        newImage.createdAt = new Date().getTime();
        newImage.loadedAt = null;
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
        var output = [];
        var i;

        for (i = 0; i < len; i++) {
            if (isBlob(blobs[i])) {
                var newImage = {};
                newImage.id = generateUID();
                newImage.index = __images.length;
                newImage.status = 0; // unloaded
                newImage.url = createObjectURL(blobs[i]);
                newImage.nextSibling = null;
                newImage.prevSibling = null;
                newImage.createdAt = new Date().getTime();
                newImage.loadedAt = null;
                newImage.error = null;
                setSiblings(newImage);
                setMethods(newImage);
                __images.push(newImage);
                output.push(copyObject(newImage));
            }
        }
        return output;
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
        var getImage = __privates.getImage;
        var image = getImage(query, true);

        if (typeof(image) === "undefined") {
            return cb(new Error("Image not found"));
        }

        var img = new Image();
        img.onload = function() {
            image.status = 1;
            return cb(null, img.src);
        }
        img.onerror = function() {
            image.status = 9;
            return cb(new Error("Load error"));
        }
        img.src = image.url;
    }

    __exports.loadMany = function(query, cb) {
        if (typeof(query) === "undefined") {
            query = {};
        }
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
                    output.push(img.src);
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