const { Firestore } = require("@google-cloud/firestore");

const db = new Firestore({
  databaseId: "my-database",
});
const storeData = (id, data) => {
  const predictCollection = db.collection("prediction");
  return predictCollection.doc(id).set(data);
};

module.exports = storeData;
