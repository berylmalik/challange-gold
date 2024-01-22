const express = require("express");
const morgan = require("morgan");
const { allRouter } = require("./router/allRouter.js");
const session = require("express-session");

const FileStore = require("session-file-store")(session);
const app = express();
const PORT = 3000;
app.use(express.json());

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(
    session({
        name: "Cookie",
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({ logFn: function () {} }),
        cookie: {
            maxAge: 300 * 60 * 60,
        },
    })
);

app.use("", allRouter);

app.listen(PORT, () => console.log("Server running on port:", PORT));
