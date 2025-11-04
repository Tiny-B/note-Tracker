const allNotes = document.getElementsByClassName('all')[0];
const openedNote = document.getElementsByClassName('open')[0];
const notesContainer = document.getElementsByClassName('notes-showcase')[0];

const noteIDLabel = document.getElementById('note-id');
const noteDateLabel = document.getElementById('note-date');
const wordCountLabel = document.getElementById('word-count');

const getNotesData = async () => {
	try {
		const response = await fetch('http://localhost:3001/notes', {
			headers: { method: 'GET', Accept: 'application/json' },
		});

		if (!response.ok) {
			throw new Error(`${response.status} - ${response.statusText}`);
		}

		notes = await response.json();

		return notes;
	} catch (err) {
		console.error(err);
	}
};

const openNote = async id => {
	let notes = [];
	try {
		notes = await getNotesData();
	} catch (err) {
		throw new Error(err);
	}

	const index = notes.findIndex(item => item.id === id);
	const { date, name, content } = notes[index];

	allNotes.style.display = 'none';
	openedNote.style.display = 'block';

	noteIDLabel.textContent = id;
	noteDateLabel.textContent = date;
	wordCountLabel.textContent = content.split(' ').length;
};

const populateNoteCards = async () => {
	let notes = [];
	try {
		notes = await getNotesData();
	} catch (err) {
		throw new Error(err);
	}
	console.log(notes);

	notes.forEach(note => {
		const { id, name, content } = note;

		const card = document.createElement('div');
		card.className = 'note-card flex-container';

		card.onclick = function () {
			openNote(id);
		};

		const cardName = document.createElement('h4');
		cardName.textContent = name;
		card.appendChild(cardName);

		const cardDesc = document.createElement('p');
		text = content.split(' ');
		if (text.length <= 30) {
			cardDesc.textContent = content;
		} else {
			clippedText = text.slice(0, 29);
			joinedText = clippedText.join(' ').concat('...');
			cardDesc.textContent = joinedText;
		}
		card.appendChild(cardDesc);

		notesContainer.appendChild(card);
	});
};

populateNoteCards();
