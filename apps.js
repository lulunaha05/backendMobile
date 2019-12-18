const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

const query = require("./queries");

app.use(bodyParser.json());
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-control-Allow-Headers",
    "Origin, X-Requested-With",
    next()
  );
});

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// endpoint
app.get("/panti", cors(), query.panti);
app.get("/panti/:id", cors(), query.kategori_panti);
app.post("/login-user", cors(), query.login_user);
app.post("/new-user", cors(), query.new_user);
app.post("/login-owner", cors(), query.login_owner);
app.post("/new-owner", cors(), query.new_owner);
app.get("/detail-panti/:id", cors(), query.detail_panti);
app.post("/edit-profile/:id", cors(), query.edit_profile);
app.post("/search-panti", cors(), query.search_panti);
app.post("/bookmark-panti", cors(), query.bookmark_panti);
app.post("/delete-panti", cors(), query.delete_bookmark);
app.get("/show-bookmark", cors(), query.show_bookmark);
//get dengan parameter
//app.get("/users/:id", query.xx);
//app.post("/users", query.xx);

app.listen(process.env.PORT || 3000, function() {
  console.log(`App running on port ${port}`);
});
