const { MongoClient } = require("mongodb");

const url = "mongodb://10.255.255.254:27017";
const client = new MongoClient(url);

const dbName = "unify_labs";
const collectionName = "products";

async function main() {
  try {
    await client.connect();
    console.log("Database connected successfully");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const products = await collection.find({}).toArray();
    console.log("Products:", products);

  } catch (error) {
    console.error("Error connecting to database:", error.message);
  } finally {
    await client.close();
  }
}

main().catch(console.error);