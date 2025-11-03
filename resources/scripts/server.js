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

// gets all notes
app.get('/notes', (req, res) => {
	const data = readData();
	res.json(data);
});

// gets specific note
app.get('/notes/:id', (req, res) => {
	const data = readData();
	const index = data.findIndex(item => item.id === req.params.id);
	if (index == -1) {
		return res.status(404).json({ message: 'Data not found' });
	}
	res.json(data[index]);
});

// Handle POST request to save new data with a unique ID
app.post('/notes', (req, res) => {
  const date = new Date().toUTCString();
	const newNote = { id: uuidv4(), date: date, ...req.body };
	const currentData = readData();
	currentData.push(newNote);
	writeData(currentData);
	res.json({ message: 'Note saved successfully', note: newNote });
});

// Edit note
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

// delete note
app.delete('/notes/:id', (req, res) => {
  const data = readData();
	const index = data.findIndex(item => item.id === req.params.id);
	if (index == -1) {
		return res.status(404).json({ message: 'Data not found' });
	}
  res.json({ message: 'Data deleted', data: data[index] });
  data.splice(index, 1);
  writeData(data);
})

// // catch routes not coded
// app.all('*', (req, res) => {
// 	res.status(404).send('Route not found');
// });

app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`);
});
