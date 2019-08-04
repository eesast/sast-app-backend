import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import * as mongoose from "mongoose";
import "mocha";
import variables from "./variables";
import User from "../src/models/user";

dotenv.config();

before("Set up the database for testing", function(done) {
  this.timeout(15000);

  mongoose.connect(`mongodb://localhost:27017/sast-api-test?authSource=admin`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS
  });

  const db = mongoose.connection;
  db.once("open", async () => {
    await db.dropDatabase();
    done();
  });
});

before("Create admin user", async function() {
  this.timeout(5000);

  const admin = new User({
    id: 0,
    username: variables.admin.username,
    password: await bcrypt.hash(variables.admin.password, variables.saltRounds),
    email: "admin@eesast.com",
    name: "admin",
    phone: 0,
    department: "电子系",
    class: "无00",
    group: "admin",
    role: "root"
  });

  return Promise.resolve(admin.save());
});
