let mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/game");

const Player = mongoose.model("Player", {
  username: String,
  password: String,
  stars: [Number]
});

let guest = new Player({
  username: "guest",
  password: "guest",
  stars: [3, 0]
});

guest.save().then(() => console.log(guest));
