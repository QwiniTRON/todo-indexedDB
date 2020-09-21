import Task from "./Task.js";
import { db } from '../scripts/openDB.js'
import { dbInventor } from '../scripts/transitionDB.js'
import Desc from "./Desc.js"
import UI from '../scripts/UI.js'

export default class Controller {
    constructor(todo, view) {
        this.section = document.querySelector(".mainContent");
        this.taskPanel = this.section.querySelector('.contentTask__tasks');
        this.solutionPanel = this.section.querySelector('.contentTask__solutions');
        this.descList = document.querySelector('#descList')
        this.descText = document.getElementById('descText')
        this.authorBtn = document.getElementById('authorBtn')
        this.clearBtn = document.getElementById('clearAll')

        this.todo = todo
        this.view = view

        this.init()
    }

    init() {
        this.view.manageBtn('tEdit', true)
        this.view.manageBtn('tDelete', true)
        this.view.manageBtn('sAdd', true)
        this.view.manageBtn('sEdit', true)
        this.view.manageBtn('sDelete', true)

        UI.toast.show('Hi! All fine!', 2000, UI.toast.colors.green)

        // menu handlers
        this.authorBtn.addEventListener('click', (event) => {
            this.view.generateGForm(`
            <div class="content__delete gForm">
                <div class="form__close">x</div>
                <div class="delete__title">QwiniTRON</div>
            </div>`);
        })
        this.clearBtn.addEventListener('click', (event) => {
            this.view.generateGForm(`
            <div class="content__delete gForm">
                <div class="form__close">x</div>
                <div class="delete__title">Вы уверены что хотите удалить?</div>
                <div class="delte__buttons">
                    <div class="done">Да</div>
                    <div class="nope">Нет</div>
                </div>
		    </div>`);

            this.section.querySelector('.done').addEventListener('click', (event) => { //Логика удаления из базы данных
                dbInventor.clearAllStorages(['task', 'solution']).then(() => {
                    UI.toast.show('All cleared. All fine!', 3000, UI.toast.colors.green)
                    this.todo.rest()
                    this.update()
                    this.view.clearModalForm()
                }).catch((err) => {
                    UI.toast.show('Some Error! Sorry.', 3000, UI.toast.colors.red)
                })
            });

            this.section.querySelector('.nope').addEventListener('click', (event) => {
                this.view.clearModalForm()
            });
        })


        // Markers clear and other ui logick
        document.addEventListener('click', (event) => {
            let item = event.target.closest('.contentTask__tasks') || event.target.closest('.contentTask__solutions')
            if (!item && !event.isGModalClick && !this.view.isModal) {
                this.view.clearMarkedTask()
                this.todo.currentTaskItem = null

                this.view.manageBtn('tEdit', true)
                this.view.manageBtn('tDelete', true)
                this.view.manageBtn('sAdd', true)
                this.view.manageBtn('sEdit', true)
                this.view.manageBtn('sDelete', true)

                this.view.displayText('')
                this.clearDescs()
            }

            if (event.target.dataset.menuToggler) {
                event.target.closest('div[data-menu]').classList.toggle('open')
            }
        })

        // Solution Pick
        this.solutionPanel.addEventListener('click', (event) => {
            let descItem = event.target.closest('.contentTask__solution')

            if (descItem) {
                this.todo.currentDescItem = descItem
                this.view.markDesc(descItem)

                this.view.manageBtn('sEdit', false)
                this.view.manageBtn('sDelete', false)

                let currentTargetDesc = this.todo.relatedDescs.get(this.todo.currentDescItem)
                this.view.displayText(currentTargetDesc.text)
            }
        })

        // Task Pick 
        this.taskPanel.addEventListener('click', (event) => {
            let item = event.target.closest('.contentTask__task')

            if (item) {
                if (this.todo.currentTaskItem != item) {
                    this.view.markTask(item)
                    this.todo.currentTaskItem = item

                    this.updateCurrentDescs()
                }

                this.view.manageBtn('tEdit', false)
                this.view.manageBtn('tDelete', false)
                this.view.manageBtn('sAdd', false)
            }
        })

        //? BUTTONS HANDLERS
        document.querySelector("#tAdd").addEventListener('click', (event) => {   //Task add //////////////////////////////////////////////////////
            this.view.generateGForm(`<div class="task__add gForm">
            <div class="form__close">x</div>
            <label for="Name" class="description">Создание цели</label>
            <input type="text" name="Name">
            <div class="description">Степень важности цели</div>
                <label for="r1" class="descriptionRadio">Неважно</label><input type="radio" id="r1" class="GForm__radio"
                    value="1" name="important"><label for="r2" class="descriptionRadio">Нужно сделать</label><input type="radio"
                    id="r2" class="GForm__radio" value="2" name="important"><label for="r3" class="descriptionRadio">Очень
                    важно</label><input type="radio" id="r3" class="GForm__radio" value="3" name="important">
                <div class="compleate">Добавить!</div>
            </div>`);


            this.section.querySelector(".compleate").addEventListener('click', (event) => {
                let elemArr = document.querySelectorAll('.task__add input')
                let noticeCount = 0;
                let noticeText = ''
                let elemForNotice

                if (elemArr[0].value.trim().length < 6) {
                    noticeText = 'Введите задачу!'
                    elemForNotice = elemArr[0]
                    noticeCount++;
                } else if (!elemArr[1].checked && !elemArr[2].checked && !elemArr[3].checked) {
                    noticeText = 'Укажите важность!'
                    elemForNotice = elemArr[0]
                    noticeCount++;
                }

                if (noticeCount === 0) {
                    console.log('Add');
                    let task = new Task(elemArr[0].value, this.section.querySelector('input:checked').value)
                    this.todo.tasks.push(task)
                    this.view.clearModalForm()
                    task.save().then(this.update(), console.log)
                } else {
                    let prevNotice = this.section.querySelector('.notacion')
                    if (prevNotice) prevNotice.remove();
                    elemForNotice.insertAdjacentHTML('beforebegin', `<div class="notacion">${noticeText}</div>`);
                }
            })
        })

        document.querySelector("#tEdit").addEventListener('click', (event) => { //Task edit /////////////////////////////////////////
            let targetTask = this.todo.relatedTasks.get(this.todo.currentTaskItem)

            this.view.generateGForm(`
            <div class="task__edit gForm">
                <div class="form__close">x</div><label for="Name" class="description">Изменение цели</label>
                <input value="${targetTask.value}" type="text" name="Name">
				<div class="description">Степень важности цели</div><label for="r1"
					class="descriptionRadio">Неважно</label><input type="radio" id="r1" class="GForm__radio" value="1"
					name="important"><label for="r2" class="descriptionRadio">Нужно сделать</label><input type="radio"
					id="r2" class="GForm__radio" value="2" name="important"><label for="r3"
					class="descriptionRadio">Очень важно</label><input type="radio" id="r3" class="GForm__radio"
					value="3" name="important">
            <div class="compleate">Изменить!</div>`);

            this.section.querySelector(`input[type="radio"][value="${targetTask.important}"]`).checked = true


            this.section.querySelector(".compleate").addEventListener('click', (event) => { //Работа с базой данных
                let elemArr = document.querySelectorAll('.task__edit input')
                let noticeCount = 0;
                let noticeText = ''
                let elemForNotice

                if (elemArr[0].value.trim().length < 6) {
                    noticeText = 'Введите задачу!'
                    elemForNotice = elemArr[0]
                    noticeCount++;
                } else if (!elemArr[1].checked && !elemArr[2].checked && !elemArr[3].checked) {
                    noticeText = 'Укажите важность!'
                    elemForNotice = elemArr[0]
                    noticeCount++;
                }

                if (noticeCount === 0) {
                    let value = elemArr[0].value.trim()
                    let important = this.section.querySelector('input:checked').value

                    targetTask.value = value
                    targetTask.important = important
                    targetTask.save().then(() => {
                        this.update()
                    }, console.log)
                    this.view.clearModalForm()
                } else {
                    let prevNotice = this.section.querySelector('.notacion')
                    if (prevNotice) prevNotice.remove();
                    elemForNotice.insertAdjacentHTML('beforebegin', `<div class="notacion">${noticeText}</div>`);
                }
            });
        });

        document.querySelector("#tDelete").addEventListener('click', (event) => { //Task delete /////////////////////////////////////////
            this.view.generateGForm(`
            <div class="content__delete gForm">
                <div class="form__close">x</div>
                <div class="delete__title">Вы уверены что хотите удалить?</div>
                <div class="delte__buttons">
                    <div class="done">Да</div>
                    <div class="nope">Нет</div>
                </div>
		    </div>`);

            this.section.querySelector('.done').addEventListener('click', (event) => { //Логика удаления из базы данных
                let targetTask = this.todo.relatedTasks.get(this.todo.currentTaskItem)
                let taskIndex = this.todo.tasks.indexOf(targetTask)

                if (targetTask.id) {
                    let deleteReq = dbInventor.deleteItem('task', targetTask.id)
                    deleteReq.onsuccess = () => {
                        this.todo.tasks.splice(taskIndex, 1)
                        this.update()
                        this.view.clearModalForm()
                    }
                    deleteReq.onerror = () => {
                        UI.toast.show(deleteReq.error.toString(), 1500, UI.toast.colors.red)
                    }
                } else {
                    UI.toast.show('Some Error!!!', 1500, UI.toast.colors.green)
                }
            });

            this.section.querySelector('.nope').addEventListener('click', (event) => {
                this.view.clearModalForm()
            });
        });

        document.querySelector("#sAdd").addEventListener('click', (event) => { //solution add /////////////////////////////////////////
            this.view.generateGForm(`
            <div class="solution__add gForm">
                <div class="form__close">x</div><label for="Name" class="description">Введите Решение</label>
                <textarea name="Name"></textarea>
                <div class="compleate">Добавить!</div>
            </div>
            `);


            this.section.querySelector(".compleate").addEventListener('click', (event) => { //Работа с базой данных
                let elemArr = document.querySelectorAll('.solution__add textarea')
                let noticeCount = 0;
                let noticeText = ''
                let elemForNotice

                if (elemArr[0].value.trim().length < 12) {
                    noticeText = 'Введите описание действия!'
                    elemForNotice = elemArr[0]
                    noticeCount++;
                }

                if (noticeCount === 0) {
                    let targetTask = this.todo.relatedTasks.get(this.todo.currentTaskItem)
                    let text = elemArr[0].value.trim()
                    let title = text.slice(0, 12) + '... '

                    let desc = new Desc(title, text, targetTask.id)
                    this.todo.descs.push(desc)
                    this.view.clearModalForm()
                    desc.save().then(() => {
                        this.updateCurrentDescs()
                    }, console.log)

                } else {
                    let prevNotice = this.section.querySelector('.notacion')
                    if (prevNotice) prevNotice.remove();
                    elemForNotice.insertAdjacentHTML('beforebegin', `<div class="notacion">${noticeText}</div>`);
                }
            });
        });

        document.querySelector("#sEdit").addEventListener('click', (event) => { //solution edit /////////////////////////////////////////
            const currentTargetDesc = this.todo.relatedDescs.get(this.todo.currentDescItem)

            this.view.generateGForm(`
                <div class="solution__edit gForm">
                    <div class="form__close">x</div><label for="Name" class="description">Изменить решение для этой
                        задачи</label><textarea name="Name"></textarea>
                    <div class="compleate">Изменить!</div>
                </div>
            `);

            const $textArea = document.querySelector('.solution__edit textarea')
            $textArea.value = currentTargetDesc.text

            this.section.querySelector(".compleate").addEventListener('click', (event) => { //Работа с базой данных
                let noticeCount = 0
                let noticeText = ''
                let elemForNotice

                if ($textArea.value.trim().length < 12) {
                    noticeText = 'Введите описание действия, не менее 12 символов!'
                    elemForNotice = $textArea
                    noticeCount++;
                }

                if (noticeCount === 0) {
                    let text = $textArea.value.trim()
                    let title = text.slice(0, 12) + '... '

                    currentTargetDesc.text = textы
                    currentTargetDesc.title = title
                    currentTargetDesc.save().then(() => {
                        this.updateCurrentDescs()
                    }, console.log)

                    this.view.displayText('')
                    this.view.clearModalForm()
                } else {
                    let prevNotice = this.section.querySelector('.notacion')
                    if (prevNotice) prevNotice.remove();
                    elemForNotice.insertAdjacentHTML('beforebegin', `<div class="notacion">${noticeText}</div>`);
                }
            });
        });

        document.querySelector("#sDelete").addEventListener('click', (event) => { //solution delete /////////////////////////////////////////
            this.view.generateGForm('<div class="content__delete gForm"><div class="form__close">x</div><div class="delete__title">Вы уверены что хотите удалить?</div><div class="delte__buttons"><div class="done">Да</div><div class="nope">Нет</div></div></div>');
            this.section.querySelector('.done').addEventListener('click', (event) => { //Логика удаления из базы данных
                const currentTargetDesc = this.todo.relatedDescs.get(this.todo.currentDescItem)
                const descIndexCurrentList = this.todo.currentDescs.indexOf(currentTargetDesc)
                const descIndexDescsList = this.todo.descs.indexOf(currentTargetDesc)

                if (currentTargetDesc.id) {
                    let deleteReq = dbInventor.deleteItem('solution', currentTargetDesc.id)
                    deleteReq.onsuccess = () => {
                        this.todo.currentDescs.splice(descIndexCurrentList, 1)
                        this.todo.descs.splice(descIndexDescsList, 1)
                        this.updateCurrentDescs()
                        this.view.clearModalForm()
                    }
                    deleteReq.onerror = () => {
                        UI.toast.show(deleteReq.error.toString(), 1500, UI.toast.colors.green)
                    }
                } else {
                    UI.toast.show('Some Error!!!', 1500, UI.toast.colors.green)
                }
            });

            this.section.querySelector('.nope').addEventListener('click', (event) => {
                this.view.clearModalForm()
            });
        });


        // Parse DB for init
        let initPromises = []
        initPromises.push(dbInventor.getAllWithKey('task'))
        initPromises.push(dbInventor.getAllWithKey('solution'))
        Promise.all(initPromises).then(([itemsTaskWithKey, itemsDescWithKey]) => {

            this.todo.tasks = itemsTaskWithKey.map((el) => {
                let task = new Task(el.item.value, el.item.important)
                task.id = el.key
                return task
            })

            this.todo.descs = itemsDescWithKey.map((el) => {
                let desc = new Desc(el.item.title, el.item.text, el.item.refId)
                desc.id = el.key
                return desc
            })

            this.update()
        }).catch((err) => {
            console.log(err);
        })
    }

    update() {
        this.todo.relatedTasks = this.view.renderTasks(this.todo.tasks)
        this.view.clearDescsList()
    }

    clearDescs() {
        this.view.clearDescsList()
        this.todo.relatedDescs = new Map()
        this.todo.currentDescs = null
        this.todo.currentDescItem = null
    }

    updateCurrentDescs() {
        let targetTaskId = this.todo.relatedTasks.get(this.todo.currentTaskItem).id
        this.view.clearDescsList()

        this.todo.currentDescs = this.todo.descs.filter((desc) => {
            return desc.refId == targetTaskId
        })

        this.todo.relatedDescs = this.view.renderDescs(this.todo.currentDescs)
    }
}