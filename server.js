const express = require('express');
const cors = require('cors');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors()); // enable CORS for front‑end
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Setup Sequelize with MySQL database
const sequelize = process.env.DB_URL
	? new Sequelize(process.env.DB_URL)
	: new Sequelize(
			process.env.DB_NAME,
			process.env.DB_USER,
			process.env.DB_PASS,
			{
				host: process.env.DB_HOST,
				dialect: process.env.DB_DIALECT,
				dialectOptions: {
					ssl: {
						ca: `
            -----BEGIN CERTIFICATE-----
MIIEUDCCArigAwIBAgIUXHL47aMallJsaplL3BuEdJ6A0rAwDQYJKoZIhvcNAQEM
BQAwQDE+MDwGA1UEAww1NDVhZDFkZWMtY2Y2YS00MTAzLTliZWItNzBiYmZkN2Q2
YWJmIEdFTiAxIFByb2plY3QgQ0EwHhcNMjUxMTE4MTgzMTM3WhcNMzUxMTE2MTgz
MTM3WjBAMT4wPAYDVQQDDDU0NWFkMWRlYy1jZjZhLTQxMDMtOWJlYi03MGJiZmQ3
ZDZhYmYgR0VOIDEgUHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCC
AYoCggGBANjTUHnv6yzyFmBnrSRyMYxpjbZP79vW0R85F9kqxHp5EQeFqXdCzKSf
3L5MUbgQuq/KObaWzN0KzGat2pHnT3yFpGWxg2KpTV83xqul5SHMgZc9nUH8U/r8
AQc7jsVHC5u9l5BKj6hLwfxn2oCrydR3rMVUJTslPAFMd2JKeRcYpw2X6WX+52H9
OACqXxDqXdFuA5UIpinfR+3ew1Jo3x6jEkvGfGdRCHJeMFMCk2ushVmvOtIk2W5Z
F1zc8QJtUb1a0SaFIyCreaet+iKHDUO9o4a7mZmlOJQt2SbOsFJPlxofMtidIcRc
I3U0/lx1d62f3wRAIE40cfY7cNuMsSWPKfDvWFtmWYvmqVW8gb3Kg9yx7rhy5t1H
MKHODeAOCoOHCGcxvn1jivUopiAgXY0TlvkTMUoohnGzVDlXYJgP47O3yDj/XppO
hS1uikfEKJasANMEAwlJDn/bGwJLlMXz/CFVL/8q620PtJpZcacWXFTMAzYYHcHy
FcTjeAoYywIDAQABo0IwQDAdBgNVHQ4EFgQU/kF7zePcyYicJ35sKDxPGiu8+wYw
EgYDVR0TAQH/BAgwBgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQAD
ggGBAE/1Umh7bwDkepEYVNOPBZQcAEO9jAwtJptwpNcMU6MzD7IJKBq/zvk5vIMo
WtyQAHs62DCob41CHtAAh4QKvKwVtGp+MGYMkvvayrurYdoKpeDa30/9V29r9fdP
q3DsBI6RmeEIY7XrUHUjYyiZRhhXCQSQKjmRZEflp33Z8v3Dh/gZHWk8psgAFGrX
6b+S/R4nUMYDkYWnTfItuG8vKfPmQuI15vkQIMGZX3cxP9NDFEIC1vd+w7hrELY4
kgmWeUOW56DxGFOqiqYK3FahbkX0y0XbqbZ+t26iInJK/qlVu88vZRzzS5wcOxCA
QMgBKgSvB4gBHc4UmWED4SIIFCVMNNe88aFK14TbxpQQ42IprHL15D+VTP71lrwu
+hg/nlbRmZoa41CjWwkQfD7R0oVQjTV4Y3VcYQmCZ1hn00u70/pJjXYXyZex+RIy
1WRuF2h3Sy/p8BBaxQBWG48qKUUtdxg5HSkcXyIGLNja3Ey3RdN03PwhrHtXNJX+
zbwC3A==
-----END CERTIFICATE-----

            `,
						rejectUnauthorized: true,
					},
				},
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

app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`);
});

// sudo mysql -u <username> -p -h <host>
