const notesContainer = document.getElementsByClassName('notes-showcase')[0];

const getNotesData = async () => {
	try {
		const response = await fetch('http://localhost:3001/notes', {
			headers: { Accept: 'application/json' },
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

const populateNoteCards = async () => {
	let notes = [];
	try {
		notes = await getNotesData();
	} catch (err) {
		throw new Error(err);
	}
	console.log(notes);

	notes.forEach(note => {
		const { name, content } = note;

		const card = document.createElement('div');
		card.className = 'note-card flex-container';

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
