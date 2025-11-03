const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

app.use(cors()); // enable CORS for front‑end
app.use(express.json());

const dataFilePath = path.join(__dirname, '../data/data.json');
console.info('dataFilePath:', dataFilePath);

// Function to read data from the JSON file
const readData = () => {
	if (!fs.existsSync(dataFilePath)) {
		console.error("File doesn't exist");
		return [];
	}
	const data = fs.readFileSync(dataFilePath);
	return JSON.parse(data);
};

// Function to write data to the JSON file
const writeData = data => {
	fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

app.get('/notes', (req, res) => {
	const data = readData();
	res.json(data);
});

// Handle POST request to save new data with a unique ID
app.post('/notes', (req, res) => {
	const newNote = { id: uuidv4(), ...req.body };
	const currentData = readData();
	currentData.push(newNote);
	writeData(currentData);
	res.json({ message: 'Note saved successfully', note: newNote });
});

// Edit data
app.put('/notes/:id', (req, res) => {
	const data = readData();
	const index = data.findIndex(item => item.id === req.params.id);
	if (index == -1) {
		return res.status(404).json({ message: 'Data not found' });
	}
	data[index] = { id: req.params.id, ...req.body };
	res.json({ message: 'Data saved', data: data[index] });
	writeData(data);
});

// app.all('*', (req, res) => {
// 	res.status(404).send('Route not found');
// });

app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`);
});
