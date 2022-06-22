[DEMO](https://godicheol.github.io/image-loader/)

```
var object = {
    blob: file,
    element: document.getElementId("img")
}

var query = {
    $and: [{
        index: {
            $gt: 3,
            $lte: 6
        }
    }, {
        id: "abcd"
    }],
}

var img = new Img(object) // create Img instance
img.set(object) // set field value
img.unset(object) // remove field 
img.match(query)
img.load(function(err, res) {}) 
img.fetch(url, function(err, res) {}) // get blob from URL
img.remove() // remove Img instance
img.move(index) // move index
img.copy() // remove reference


Img.getOne(query);
Img.getMany(query);
Img.removeOne(query);
Img.removeMany(query);
Img.updateOne(query, object);
Img.updateMany(query, object);

```