const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();

// middle wares
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Running Successfully");
});
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1rqmivg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const programsCollection = client.db("HeartToServe").collection("programs");
    const eventsCollection = client.db("HeartToServe").collection("events");
    const donorsCollection = client.db("HeartToServe").collection("donors");
    const counselingCollection = client.db("HeartToServe").collection("counseling");

    // all programs
    app.get("/programs", async (req, res) => {
      const query = {};
      const programs = await programsCollection.find(query).toArray();
      res.send(programs);
    });

    // all donors
    app.get("/donors", async (req, res) => {
      const group = req.query.group;
      const query = { group: group };
      const donors = await donorsCollection.find(query).toArray();
      res.send(donors);
    });
    // counseling
    app.get("/counseling", async (req, res) => {
      const query = {};
      const counseling = await counselingCollection.find(query).toArray();
      res.send(counseling);
    });

    // events
    app.get("/events", async (req, res) => {
      const query = {};
      const events = await eventsCollection.find(query).toArray();
      res.send(events);
    });

    // form post
    app.post("/donors", async (req, res) => {
      const user = req.body;
      const donors = await donorsCollection.insertOne(user);
      res.send(donors);
    });
  } finally {
  }
}

run().catch((err) => console.error(err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
