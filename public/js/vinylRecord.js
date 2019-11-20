let mongoose = require("mongoose");

var vinylRecordSchema = new mongoose.Schema ({
    album: String,
    artist: String,
    publishYear: Number,
    publishCountry: String
})

var VinylRecord = new mongoose.model('VinylRecord', vinylRecordSchema);
module.exports = VinylRecord;