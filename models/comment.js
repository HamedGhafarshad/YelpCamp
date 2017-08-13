var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
	text: String,
	author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" //model is User
        },
        username: String  //its easier to get username directly rather than by referring from id
    }
});


module.exports = mongoose.model("Comment", commentSchema);
