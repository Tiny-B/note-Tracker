const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS, DB_URL } = process.env;

// Setup Sequelize with MySQL database
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
	host: DB_HOST,
	dialect: 'postgres',
	dialectOptions: {
		ssl: {
			ca: fs.readFileSync('./certs/aiven-ca.pem', 'utf8'),
			rejectUnauthorized: true,
		},
	},
	port: DB_PORT,
	logging: console.log,
});

// Define Post model
const Note = sequelize.define(
	'Note',
	{
		id: {
			type: DataTypes.NUMBER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		date: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		timestamps: false,
	}
);

// app.listen(() => {
// 	console.log(`Server listening on http://localhost:${PORT}`);
// });

// Sync database
// sequelize
// 	.sync()
// 	.then(() => {
// 		console.log('Database & tables created!');
// 	})
// 	.catch(err => console.error('Database sync error:', err));

(async () => {
	try {
		await sequelize.authenticate();
		console.log('connection established');

		await sequelize.sync();

		const server = app.listen(PORT, () => {
			console.log(`Server is listening at http://localhost:${PORT}`);
		});

		server.on('error', err => {
			console.error('HTTP server error:', err);
			process.exit(1);
		});
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
})();

// gets all notes
app.get('/notes', async (req, res) => {
	try {
		const notes = await Note.findAll();
		res.json(notes);
	} catch (error) {
		res.status(500).json({ error: 'Error retrieving note' });
	}
});

// Handle POST request to save new data with a unique ID
app.post('/notes', async (req, res) => {
	try {
		const { name, content } = req.body;
		date = new Date().toUTCString();
		const note = await Note.create({ date, name, content });
		res.status(201).json(note);
	} catch (error) {
		res.status(500).json({ error: 'Error adding note' });
	}
});

// Edit note
app.put('/notes/:id', async (req, res) => {
	try {
		const { name, content } = req.body;
		const editedNote = await Note.update(
			{ name, content },
			{ where: { id: req.params.id } }
		);
		res.status(201).json(editedNote);
	} catch (error) {
		res.status(500).json({ error: 'Error editing note' });
	}
});

// delete note
app.delete('/notes/:id', async (req, res) => {
	try {
		const deletedNote = await Note.destroy({ where: { id: req.params.id } });
		res.status(201).json(deletedNote);
	} catch (error) {
		res.status(500).json({ error: 'Error editing note' });
	}
});

// // catch routes not coded
// app.all('/*', (req, res) => {
// 	res.status(404).send('Route not found');
// });



// // sudo mysql -u <username> -p -h <host>

// export NODE_EXTRA_CA_CERTS=$(pwd)/certs/aiven-ca.pem
