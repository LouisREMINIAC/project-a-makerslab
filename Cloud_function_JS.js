const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(); 
 
 exports.rewardUsers2 = functions.firestore
  .document("users/{usersID}")
  .onCreate(async (doc, context) => {
    const dateTimeNow = Date.now();
    const user = doc.data();

    const godfather_code = user["godfather_code"] ?? "";
    const currentUserUID = user["uid"] ?? "";

    if (godfather_code !== "") {
      const referredUserSnapshot = await firestoreDatabase
        .collection("users")
        .where("referral_code", "==", godfather_code)
        .get();
      const referredUser = referredUserSnapshot.docs[0].data();
      const referredUserUID = referredUser["uid"] ?? "";

      let batch = firestoreDatabase.batch();

      batch.update(firestoreDatabase.collection("users").doc(referredUserUID), {
        reward: admin.firestore.FieldValue.increment(100),
      });

      batch.set(
        firestoreDatabase
          .collection("users")
          .doc(referredUserUID)
          .collection("referrers")
          .doc(currentUserUID),
        {
          createdAt: dateTimeNow,
          uid: currentUserUID,
        }
      );

      await batch.commit();
    }
  }); 
