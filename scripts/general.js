import { db, readyDB } from "./openDB.js";
import { dbInventor } from "./transitionDB.js";
import Task from '../classes/Task.js'
import View from '../classes/View.js'
import Controller from '../classes/Controller.js'
import ToDO from '../classes/ToDo.js'

window.addEventListener('load', (ev) => {
	const section = document.querySelector(".mainContent");
	const taskPanel = section.querySelector('.contentTask__tasks');
	const solutionPanel = section.querySelector('.contentTask__solutions');
	const descList = document.querySelector('#descList')
	const descText = document.getElementById('descText')
	// const colorIndicator = ['green', 'orange', 'red'];
	
	void async function () {
		try {
			let dbReturned = await readyDB
			console.log('DB Connected!');
	
			const todo = new ToDO()
			const view = new View(section, taskPanel, solutionPanel, descList, descText)
			const controller = new Controller(todo, view)
		} catch (err) {
			console.log(err);
		}
	}();
})




























// *************** LEGACY *********************

// let tempRequestTransition = null;
// let tempGForem = null;

// let currentTask = null;
// let currntSolution = null;

// let taskList = new Map();
// let solutionList = new Map();

// Функции


// function generateGForm(formHTML) {
// 	section.insertAdjacentHTML("beforeend", formHTML);
// 	section.insertAdjacentHTML("beforeend", '<div class="modalBlock"></div>');

// 	section.querySelector(".form__close").addEventListener('click', function (event) { //Закрытие
// 		section.querySelector('.gForm').remove();
// 		section.querySelector(".modalBlock").remove();
// 	});

// 	section.querySelector(".modalBlock").addEventListener('click', function (event) { //Закрытие по нажатию на модальный блок
// 		section.querySelector('.gForm').remove();
// 		section.querySelector(".modalBlock").remove();
// 	});
// }

// function renderTask() {
// 	let tx = db.transaction("task");
// 	let tempStore = tx.objectStore("task");
// 	let requestGet = tempStore.getAll();
// 	taskPanel.querySelectorAll('.contentTask__task').forEach((elem) => { elem.remove() });
// 	requestGet.onsuccess = function () {
// 		requestGet.result.forEach(function (elem) {
// 			let tempTask = document.createElement('div');
// 			tempTask.classList.add('contentTask__task');
// 			tempTask.textContent = elem.value;
// 			let elemIndicator = document.createElement('div');
// 			elemIndicator.style.background = colorIndicator[elem.important - 1];
// 			elemIndicator.classList.add('taskIndicator');
// 			tempTask.append(elemIndicator);
// 			taskPanel.append(tempTask);

// 			//добавление в массив ссылок на объект
// 			taskList.set(tempTask, elem.id);
// 		});
// 	}
// }

// function renderSolution() {

// }

// / Функции ////////////////////////////////////////////


// Выбор задачи ////////////////////////////////////////////
// taskPanel.addEventListener('click', function (event) {
// 	let currentTarget = event.target.closest('.contentTask__task');
// 	if (currentTarget) {
// 		if (currentTask) {
// 			currentTask.classList.remove('target');
// 		}
// 		currentTask = currentTarget;
// 		currentTask.classList.add('target');
// 	}
// });


// /Выбор задачи ////////////////////////////////////////////

// Выбор решения ////////////////////////////////////////////

// /Выбор решения ////////////////////////////////////////////







// document.querySelector("#tAdd").addEventListener('click', function (event) {   //Task add //////////////////////////////////////////////////////

// 	generateGForm('<div class="task__add gForm"><div class="form__close">x</div><label for="Name" class="description">Создание цели</label><input type="text" name="Name"><div class="description">Степень важности цели</div><label for="r1" class="descriptionRadio">Неважно</label><input type="radio" id="r1" class="GForm__radio" value="1" name="important"><label for="r2" class="descriptionRadio">Нужно сделать</label><input type="radio" id="r2" class="GForm__radio" value="2" name="important"><label for="r3" class="descriptionRadio">Очень важно</label><input type="radio" id="r3" class="GForm__radio" value="3" name="important"><div class="compleate">Добавить!</div></div>');

// 	section.querySelector(".compleate").addEventListener('click', function (event) { //Работа с базой данных
// 		let elemArr = section.querySelectorAll('input');
// 		let noticeArr = section.querySelectorAll('.notacion');
// 		let noticeCount = 0;
// 		let imortantCount = 1;
// 		noticeArr.forEach(function (elem) {
// 			elem.remove();
// 		});

// 		if (elemArr[0].value == '' && !section.querySelector('.notacion')) {
// 			//elemArr[0].previousElementSibling.insertAdjacentHTML('beforebegin', '<div class="notacion">Введите данные!</div>');
// 			elemArr[0].insertAdjacentHTML('beforebegin', '<div class="notacion">Введите данные!</div>');
// 			noticeCount++;
// 		}
// 		if (!elemArr[1].checked && !elemArr[2].checked && !elemArr[3].checked) {
// 			noticeCount++;
// 			elemArr[1].previousElementSibling.insertAdjacentHTML('beforebegin', '<div class="notacion">Укажите важность!!!</div>');
// 		}
// 		if (noticeCount == 0) {  //Добавление в базу данных

// 			if (elemArr[2].checked) {
// 				imortantCount = 2;
// 			}
// 			if (elemArr[3].checked) {
// 				imortantCount = 3;
// 			}

// 			let data = {
// 				id: elemArr[0].value,
// 				value: elemArr[0].value,
// 				important: imortantCount,
// 			};

// 			let setRequst = dbInventor.setItem('task', data);
// 			setRequst.onsuccess = function (event) {

// 			};

// 			section.querySelector('.gForm').remove();
// 			section.querySelector(".modalBlock").remove();
// 			renderTask();
// 		}
// 	});
// });

// document.querySelector("#tEdit").addEventListener('click', function (event) { //Task edit /////////////////////////////////////////

// 	generateGForm('<div class="task__edit gForm"><div class="form__close">x</div><label for="Name" class="description">Изменение цели</label><input type="text" name="Name"><div class="description">Степень важности цели</div><label for="r1" class="descriptionRadio">Неважно</label><input type="radio" id="r1" class="GForm__radio" value="1" name="important"><label for="r2" class="descriptionRadio">Нужно сделать</label><input type="radio" id="r2" class="GForm__radio" value="2" name="important"><label for="r3" class="descriptionRadio">Очень важно</label><input type="radio" id="r3" class="GForm__radio" value="3" name="important"><div class="compleate">Изменить!</div>');

// 	section.querySelector(".compleate").addEventListener('click', function (event) { //Работа с базой данных

// 		section.querySelector('.gForm').remove();
// 		section.querySelector(".modalBlock").remove();
// 	});

// });

// document.querySelector("#tDelete").addEventListener('click', function (event) { //Task delete /////////////////////////////////////////

// 	generateGForm('<div class="content__delete gForm"><div class="form__close">x</div><div class="delete__title">Вы уверены что хотите удалить?</div><div class="delte__buttons"><div class="done">Да</div><div class="nope">Нет</div></div></div>');

// 	section.querySelector('.done').addEventListener('click', function (event) { //Логика удаления из базы данных

// 	});

// 	section.querySelector('.nope').addEventListener('click', function (event) {
// 		section.querySelector('.gForm').remove();
// 		section.querySelector(".modalBlock").remove();
// 	});

// });

// document.querySelector("#sAdd").addEventListener('click', function (event) { //solution add /////////////////////////////////////////
// 	generateGForm('<div class="solution__add gForm"><div class="form__close">x</div><label for="Name" class="description">Введите Решение</label><textarea name="Name"></textarea><div class="compleate">Добавить!</div></div>');
// 	section.querySelector(".compleate").addEventListener('click', function (event) { //Работа с базой данных




// 		section.querySelector('.gForm').remove();
// 		section.querySelector(".modalBlock").remove();
// 	});
// });

// document.querySelector("#sEdit").addEventListener('click', function (event) { //solution edit /////////////////////////////////////////
// 	generateGForm('<div class="solution__edit gForm"><div class="form__close">x</div><label for="Name" class="description">Изменить решение для этой задачи</label><textarea name="Name"></textarea><div class="compleate">Изменить!</div></div>');
// 	section.querySelector(".compleate").addEventListener('click', function (event) { //Работа с базой данных




// 		section.querySelector('.gForm').remove();
// 		section.querySelector(".modalBlock").remove();
// 	});
// });

// document.querySelector("#sDelete").addEventListener('click', function (event) { //solution delete /////////////////////////////////////////
// 	generateGForm('<div class="content__delete gForm"><div class="form__close">x</div><div class="delete__title">Вы уверены что хотите удалить?</div><div class="delte__buttons"><div class="done">Да</div><div class="nope">Нет</div></div></div>');

// 	section.querySelector('.done').addEventListener('click', function (event) { //Логика удаления из базы данных

// 	});

// 	section.querySelector('.nope').addEventListener('click', function (event) {
// 		section.querySelector('.gForm').remove();
// 		section.querySelector(".modalBlock").remove();
// 	});
// });



