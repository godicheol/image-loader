[DEMO](https://godicheol.github.io/image-loader/)

```
var img = new Img({
    blob: file,
    element: document.getElementId("img")
}); // create Img instance

img.set(object) // set field value
img.unset(object) // remove field 
img.match(query)
img.load(function(err, res) {}) 
img.unload() // revoke object url 
img.fetch(url, function(err, res) {}) // get blob from URL
img.remove(), img.delete() // remove Img instance
img.copy(), img.lean() // remove reference
img.split(rowsArray, colsArray) // create new files
img.resize() // remove reference

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

// $and: array
// $or: array
// $in: array
// $eq: string, number
// $ne: string, number,
// $gt, $gte, $lt, $lte: number

Img.exist(query); // return Boolean
Img.count(query); // return Number
Img.getOne(query); // return Img
Img.getMany(query); // return Object
Img.removeOne(query); // return Img
Img.removeMany(query); // return Object
Img.updateOne(query, object); // return Img
Img.updateMany(query, object); // return Object

```