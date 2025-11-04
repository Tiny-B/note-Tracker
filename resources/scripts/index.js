const allNotes = document.getElementsByClassName('all')[0];
const openedNote = document.getElementsByClassName('open')[0];
const backBtn = document.getElementById('back-btn');
const notesContainer = document.getElementsByClassName('notes-showcase')[0];
const noteViewerElements = document.getElementsByClassName(
	'note-view-container'
)[0].children;
const createNoteContainer = document.getElementsByClassName('create')[0];
const mainContainer = document.getElementsByClassName('main-container')[0];

const noteIDLabel = document.getElementById('note-id');
const noteDateLabel = document.getElementById('note-date');
const wordCountLabel = document.getElementById('word-count');

const newNoteBtn = document.getElementsByClassName('new-note-btn')[0];
const cancelBtn = document.getElementById('cancel-btn');
const confirmBtn = document.getElementById('confirm-btn');

let notes = [];

const getNotesData = async () => {
	try {
		const response = await fetch('http://localhost:3001/notes', {
			headers: { method: 'GET', Accept: 'application/json' },
		});

		if (!response.ok) {
			throw new Error(`${response.status} - ${response.statusText}`);
		}

		return await response.json();
	} catch (err) {
		console.error(err);
	}
};

const createNote = () => {
	mainContainer.style.display = 'none';
	createNoteContainer.style.display = 'block';
};

const cancelCreation = () => {
	mainContainer.style.display = 'block';
	createNoteContainer.style.display = 'none';
};

const openNote = id => {
	const index = notes.findIndex(item => item.id === id);
	const { date, name, content } = notes[index];

	allNotes.style.display = 'none';
	openedNote.style.display = 'flex';

	noteIDLabel.textContent = id;
	noteDateLabel.textContent = date;
	wordCountLabel.textContent = content.split(' ').length;

	noteViewerElements[1].textContent = name;
	noteViewerElements[2].textContent = content;
};

const populateNoteCards = async () => {
	try {
		notes = await getNotesData();
	} catch (err) {
		throw new Error(err);
	}
	console.info(notes);

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
		const more = document.createElement('p');
		more.textContent = 'Click for more.';
		card.appendChild(more);

		notesContainer.appendChild(card);
	});
};

backBtn.onclick = function () {
	allNotes.style.display = 'block';
	openedNote.style.display = 'none';
};

newNoteBtn.onclick = createNote;
cancelBtn.onclick = cancelCreation;

populateNoteCards();
