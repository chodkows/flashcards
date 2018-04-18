import { h } from 'virtual-dom';
import hh from 'hyperscript-helpers';
import * as R from 'ramda';
import {
	addNewCard,
	showAnswer,
	showForm,
	saveCardMsg,
	questionInputMsg,
	answerInputMsg,
	answerButtonClick,
	removeCard,
} from './Update';

const { div, h1, pre, button, h3, p, label, form, input, i } = hh(h);

function addFlashcardButton(dispatch) {
	return button({
		className: 'pa2 white bg-green bn pointer ',
		onclick: () => dispatch(addNewCard),
	}, 'Add Flashcard')
}

function setForm(dispatch, model, card) {
	return form(
		{
			className: 'w-100 mv2',
			onsubmit: e => {
				e.preventDefault();
				dispatch(saveCardMsg(card.id));
			}
		},
		[
			setInputUnit('Question', model.question, e => dispatch(questionInputMsg(e.target.value))),
			setInputUnit('Answer', model.answer, e => dispatch(answerInputMsg(e.target.value))),
			button({
				className: 'bg-green bn white',
				type: 'submit,'
			}, 'SAVE'),
		],
	);
}

function setInputUnit(labelText, value, oninput) {
	return div({className: ''}, [
		label({ className: ''}, labelText),
		input({
			className: '',
			value,
			type: 'text',
			oninput
		})
	])
}

function setQuestionUnit(labelText, card, dispatch, showForm, removeCard) {
	return div({className: ''}, [
		label({ className: ''}, labelText),
		i({
			className: 'fa fa-times fr gray pointer',
			onclick: () => dispatch(removeCard(card.id)),
		}),
		p({
			className: 'dim pointer mh1',
			onclick: () => dispatch(showForm(card.id)),
		}, card.question)
	])
}

function buttons(dispatch, messageMethod, card) {
	return div('',[
		button({
			className: 'white bg-red bn ma2',
			onclick: () => dispatch(messageMethod(0, card.id))
		}, 'Bad'),
		button({
			className: 'white bg-blue bn ma2',
			onclick: () => dispatch(messageMethod(1, card.id))
		}, 'Good'),
		button({
			className: 'white bg-green bn ma2',
			onclick: () => dispatch(messageMethod(2, card.id))
		}, 'Excellent'),
	])
}

function setAnswerUnit(labelText, card, dispatch, showAnswer) {
	if(card.showAnswer) {
		return div({className: ''}, [
			label(labelText),
			p({
				className: '',
			}, card.answer),
			buttons(dispatch, answerButtonClick, card),
		])
	}
	return div({className: ''}, [
		label({
			 className: 'dim pointer',
			 onclick: (e) => dispatch(showAnswer(card.id)),
		}, labelText)
	])
}

function addFlashcard(dispatch, model, card) {
	if(card.showForm) {
		return div({className: 'bg-yellow ba b--black w-25 '}, [
			setForm(dispatch, model, card),
		]);

	} else {
		return div({className: 'bg-yellow ba b--black w-25 pa2 mv2 mr4 '}, [
			setQuestionUnit('Question', card, dispatch, showForm, removeCard),
			setAnswerUnit('Answer', card, dispatch, showAnswer),
		]);
	}
}

function flashcardsView(dispatch, model) {
	if(model.cards.length === 0) {
		return h3({ className: 'i'}, 'No elements to display...')
	}
	const flashCards = R.map(
		R.partial(addFlashcard, [dispatch, model]),
		model.cards
	);
	return flashCards;
}

function view(dispatch, model) {
	return div({ className: 'mw8 center'}, [
		h1({className: ''}, 'Flashcard Study'),
		addFlashcardButton(dispatch),
		div({className: 'flex flex-wrap'},
			flashcardsView(dispatch, model),
		)

		// pre(JSON.stringify(model, null, 2)),
	])
}
export default view;
