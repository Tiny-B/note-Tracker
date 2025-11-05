const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors()); // enable CORS for front‑end
app.use(express.json());

// Setup Sequelize with MySQL database
const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASS,
	{
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIALECT,
		port: process.env.DB_PORT,
	}
);

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

app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, '../stylesheets/style.css')));

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

// sudo mysql -u <username> -p -h <host>
