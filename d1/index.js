const express = require('express');
// Mongoose is a package that allows creation of Schemas to model our data structures
// Also has access to a number of methods for manipulating our database
const mongoose = require('mongoose');
const app = express();
const port = 3001;

// MongoDB Atlas
// Connect to the database by passing in your connection string, remember to replace <password> and database name (myFirstDatabase) with actual values.
mongoose.connect("mongodb+srv://admin:admin@zuitt-bootcamp.brw90.mongodb.net/batch127_to-do?retryWrites=true&w=majority", 
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
);
// Connecting to Robo 3T locally
/*
mongoose.connect("mongodb://localhost:27017/<databasename>", {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
*/
// set notification for connection success or failure
// Connection to the database, allows us to handle errors when the inital connection is established
let db = mongoose.connection;
// If a connection error occured, output in the console
// console.error.bind(console) = allows us to print error in the browser console and in the terminal
db.on("error", console.error.bind(console, "connection error"));
// if the connection is successful, output in the console
db.once("open", ()=> console.log("We're connected to the cloud database"))

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

// Mongoose Schemas

// Schemas determine the structure of the documents to be written in the database.
// Schemas act as blueprints to our data
// Use the Schema() constructor of the Mongoose module to create a new Schema object
// The "new" keyword create a new Schema
const taskSchema = new mongoose.Schema({
	// Define the fields with the corresponding data type
	// for task, it needs a "task name" and "task status"
	name: String,
	status: {
		type: String,
		// Default values are the predefined values for a field if we don't put any value
		default: "pending"
	} //__v: 0 this is the version key number. it indicates how many revisions has occured
});
// Task is capitalized following the MVC approach for naming convention
// Model-View-Controller
const Task = mongoose.model("Task", taskSchema)
// The first parameter of the Mongoose model method indicates the collection in where to store the data
// The second parameter is used to specify the Schema/blueprint of the documents that will be stored in the MongoDB collection
// Models use Schemas and they act as the middleman from the server (JS Code) to our database
// Server > Schema (blueprint) > Database > Collection


// Create a new task
/*
Business Logic
1. Add a functionality to check if there are duplicate tasks
	-if the task already exists in the database, we return an error
	-if the task doesn't exist in the database, we add it in the database
2. The task will be coming from the request's body
3. Create a new Task object with a "name" field/property
4. The "status" property does not need to be provided because our schema default is to "pending" upon creation of an object
*/
app.post('/task', (req, res) => {
	// check if there are duplicate tasks
	// findOne is a mongoose method that acts similar to "find" of mongoDB
	// find(One) returns the first document that matches the search critera"
 	Task.findOne( { name: req.body.name }, (err, result) => {	// thank you po
 		// if a document was found and the document's name matches the information sent via the client/postman
 		if (result !== null && result.name == req.body.name) {
 			// return a message to the client
 			return res.send("Duplicate task found")
 		}
 		else {
 			// if no document was found, create a new task and save it to our database
 			let newTask = new Task({
 				name: req.body.name
 			})

 			// The "save" method will restore the information to the database
 			// Since the "newTask" was created from the mongoose Schema it will gain access to this method to save to the database
 			// The "save" method will accept a callback function which stores any errors found in the 
 			newTask.save((saveErr, saveTask) => {
 				if (saveErr) {
 					return console.error(saveErr)
 				}
 				else {
 					return res.status(201).send("New task created")
 				}
 			})
 		}
 	})
})

// Getting all the tasks

/*
Business logic
1. We will retrieve all the documents using the GET method
2. If an error is encountered, print the error.
3. If no errors are found, send a success status back to the client/Postman and return an array of document
*/

app.get('/tasks', (req, res) => {
	// "find" is a mongoose method is similar to MongoDB "find". empty string {} means it returns ALL the documents and stores them in the result parameter of the callback function
	Task.find( {} , (err, result) => {
		// if an error occured
		if (err) {
			return console.log(err)
		}
		else {
			// if no errors are found
			// status 200 means that everything is OK in terms of processing
			// the "json" method allows to send a JSON format for the response
			// The returned response is purposefully returned as an object with the "data" property to mirror real world complex data structures
			return res.status(200).json({
				data: result
			})
		}
	})
});


// #1. Create a User schema.
// #2. Create a User model.
const userSchema = new mongoose.Schema(
	{
		username: String,
		password: String
	}
);
const User = mongoose.model("User", userSchema)


// 3. Create a POST route that will access the "/signup" route that will create a user.
// 4. Process a POST request at the "/signup" route using postman to register a user.
/*
Business Logic for POST /signup
1. Add a functionality to check if there are duplicate tasks
	-If the user already exists in the database, we return an error
	-If the user doesn't exist in the database, we add it in the database
2. The user data will be coming from the request's body
3. Create a new user object with a "username" and "password" fields/properties
*/
app.post('/signup', (req, res) => {
 	User.findOne( { username: req.body.username }, (err, result) => {
 		if (result !== null && result.username == req.body.username) {
 			return res.send("Duplicate user found")
 		}
 		else {
 			let newUser = new User({
 				username: req.body.username,
 				password: req.body.password
 			})
 			newUser.save((saveErr, saveTask) => {
 				if (saveErr) {
 					return console.error(saveErr)
 				}
 				else {
 					return res.status(201).send("New user registered")
 				}
 			})
 		}
 	})
});


// 5. Create a GET route that will return all users.
// 6. Process a GET request at the "/users" route using postman.
/*
Business Logic for GET /users
1. We will retrieve all the documents using the GET method
2. If an error is encountered, print the error.
3. If no errors are found, send a success status back to the client/Postman and return an array of document
*/
app.get('/users', (req, res) => {
	User.find( {} , (err, result) => {
		if (err) {
			return console.log(err)
		}
		else {
			return res.status(200).json({
				data: result
			})
		}
	})
});



/*	ERROR OCCURED IN POSTMAN AND GIT CLI DUE TO UNKNOWN ARRAY NAME AS EXPECTED. NO MOCK DATABASE HAS BEEN SET THEREFORE NO DECLARED NAME OF ARRAY WHERE USER FROM /signup IS STORED. ASK HOW TO FIND OUT ABOUT IT


Business Logic for DELETE /delete-user		//verify if business logic is sound and optimized. if yes, verify if all steps were satisfied. if not, make it more logical
1. Verify if user exists
	-if user does not exist, error message indicate no user found
	-if user exists, remove user from database
2. User data comes from request's body
3. Delete user data from database
*/
app.delete('/delete-user', (req, res) => {			// creates a delete route
	User.findOne( { username: req.body.username }, (err, result) => {		// finds the user inside the database
		// verify if (result == null condition is sufficient as parameter for checking user's existence, used OR (||) operator so that either condition can be met, thus, allowing leniency)
		if (result == null || result.username !== req.body.username) {		// checks if user exists in the database
 			return res.send(`User ${req.body.username} does not exist.`)	// error message shown when if statement is satisfied
 		}
 		else {		// user verified to exist
 			for (let i = 0; i < data.length; i++) {		// loops to check which index the req.body.user is located in the data array
 				if (req.body.username == data[i].username) {	// checks if user is equal to data array user
 					data.splice(i, 1);		// removes user from the array
 					res.send(`User ${req.body.username} has been deleted.`)	// message shown when user is deleted successfully
 					break;		// stops further lines from being executed
 				}
 			}
 		}
	})
});


app.listen(port, () => console.log(`Server is running at port ${port}`));