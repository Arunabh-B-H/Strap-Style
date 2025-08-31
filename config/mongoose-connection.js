const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose");
const config = require("config")
mongoose
  .connect(`${config.get("MONGODB_URI")}/styleandstrap`)
  .then(() => {
    dbgr("Connected");
  })
  .catch((err) => {
    console.log(err);
  });
module.exports = mongoose.connection;
