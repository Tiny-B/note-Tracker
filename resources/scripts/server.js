const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(cors()); // enable CORS for front‑end
app.use(express.json());

const dataFilePath = path.join(__dirname, '../data/data.json');
console.info('dataFilePath:', dataFilePath);

const password = 'ranga';
if (password === '<add your MySQL password here>') {
	console.error('Please update MySQL password in server.js');
	process.exit(1);
}

// Setup Sequelize with MySQL database
const sequelize = new Sequelize('notes_db', 'wolfie', password, {
	host: '127.0.0.1',
	dialect: 'mysql',
	port: 3306,
});

// Define Post model
const Note = sequelize.define(
	'Note',
	{
		id: {
			type: DataTypes.TEXT,
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

// Sync database
sequelize
	.sync()
	.then(() => console.log('Database & tables created!'))
	.catch(err => console.error('Database sync error:', err));

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
// app.all('*', (req, res) => {
// 	res.status(404).send('Route not found');
// });

app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`);
});

// mysql -u wolfie -p -h 127.0.0.1