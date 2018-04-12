const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/QuizzBizz', (err, client) => {
	if (err) {
		return console.log("Unable to connect to MongoDB server");
	}
	console.log('Connected to MongoDB server');
	const db = client.db('Users');

	db.collection('Users').insertOne({

	}, (err, result) => {
		if (err) {
			return console.log("Unable to insert user", err);
		}
		console.log(JSON.stringify(result.ops, undefined, 2));
	})

	client.close();
});
