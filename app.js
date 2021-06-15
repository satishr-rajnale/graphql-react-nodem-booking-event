const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const graphiqlSchema = require("./graphql/schema/index");
const graphiqlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphiqlSchema,
    rootValue: graphiqlResolvers,
    graphiql: true,
  })
);

// const password = encodeURIComponent(process.env.MONGO_PASSWORD)
// const dbUrl = `mongodb+srv://graphql_user:BduFp7lL2Qlwa8qB
// @assignmentdb.pbkyo.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
mongoose
  .connect(
    "mongodb+srv://graphql_user:BduFp7lL2Qlwa8qB@assignmentdb.pbkyo.mongodb.net/graphqlDB?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("environment started");
    app.listen(8000);
  })
  .catch((err) => {
    console.log(dbUrl);
    console.log(err);
  });
