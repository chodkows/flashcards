import * as R from 'ramda';

const MSGS = {
	ADD_FLASHCARD: 'ADD_FLASHCARD',
	SHOW_ANSWER: 'SHOW_ANSWER',
	SHOW_FORM: 'SHOW_FORM',
	SAVE_CARD: 'SAVE_CARD',
	QUESTION_MSG: 'QUESTION_MSG',
	ANSWER_MSG: 'ANSWER_MSG',
	ANSWER_BUTTON_MSG: 'ANSWER_BUTTON_MSG',
	REMOVE_CARD: 'REMOVE_CARD',
}

export const addNewCard = {
	type: MSGS.ADD_FLASHCARD,
}

export function showAnswer(cardId){
	return {
		type: MSGS.SHOW_ANSWER,
		cardId,
	}
}

export function showForm(cardId) {
	return {
		type: MSGS.SHOW_FORM,
		cardId,
	}
}

export function saveCardMsg(cardId) {
	return {
		type: MSGS.SAVE_CARD,
		cardId,
	}
}

export function questionInputMsg(value) {
	return {
		type: MSGS.QUESTION_MSG,
		value,
	}
}

export function answerInputMsg(value) {
	return {
		type: MSGS.ANSWER_MSG,
		value,
	}
}

export function answerButtonClick(value, cardId) {
	return {
		type: MSGS.ANSWER_BUTTON_MSG,
		value,
		cardId,
	}
}

export function removeCard(cardId) {
	return {
		type: MSGS.REMOVE_CARD,
		cardId,
	}
}

function update(msg, model) {
	switch (msg.type) {

		case MSGS.ADD_FLASHCARD: {
			const { nextId } = model;
			const card = { question:'emtpy question', answer: 'empty answer', id: nextId, rank: 0 };
			const cards = [...model.cards, card];
			return { ...model, cards, showForm: true, nextId: nextId + 1 }
		}

		case MSGS.SHOW_ANSWER: {
			const cards = R.map(card => {
				if(card.id === msg.cardId){
					return { ...card, showAnswer: true }
				}
				return card;
			}, model.cards);
			return { ...model, cards};
		}

		case MSGS.SHOW_FORM: {
			const cards = R.map(card => {
				if(card.id === msg.cardId) {
					return { ...card, showForm: true }
				}
				else return { ...card, showForm: false }
				return card;
			}, model.cards);
			const card = R.find(R.propEq('id', msg.cardId))(cards);
			const { question, answer } = card;
			return { ...model, cards, question, answer };
		}

		case MSGS.SAVE_CARD: {
			const cards = R.map(card =>{
				if(card.id === msg.cardId) {
					const { question, answer } = model;
					return {...card, showForm: false, question, answer }
				}
				return card;
			}, model.cards);

			return { ...model, cards, question: '', answer: '' }
		}

		case MSGS.QUESTION_MSG: {
			const question = msg.value;
			return { ...model, question };
		}

		case MSGS.ANSWER_MSG: {
			const answer = msg.value;
			return { ...model, answer };
		}

		case MSGS.ANSWER_BUTTON_MSG: {
			const rank = msg.value;
			const id = msg.cardId;
			const cards = R.sort((a,b) => a.rank - b.rank, setRank(id, rank, model.cards));
			return { ...model, cards}
		}

		case MSGS.REMOVE_CARD: {
			const id = msg.cardId;
			const cards = R.filter(card => card.id !== id, model.cards);
			return { ...model, cards };
		}
	}
	return model;
}

function setRank(id, rank, cards){
	return R.map(
		card => {
			if(card.id === id) {
				return { ...card, rank, showAnswer: false }
			}
			else return { ...card}
		}, cards
	);
	return { ...model, cards};
}

export default update;
