export default class View {
    static colorIndicator = ['green', 'orange', 'red']

    constructor($section, $taskPanel, $solutionPanel, $descList, $descText) {
        this.section = $section
        this.taskPanel = $taskPanel
        this.solutionPanel = $solutionPanel
        this.descList = $descList
        this.descText = $descText
        
        this.currentTaskMarked = null
        this.currentDescMarked = null

        this.isModal = false
    }

    generateGForm(formHTML) {
        let section = this.section

        section.insertAdjacentHTML("beforeend", formHTML);
        section.insertAdjacentHTML("beforeend", '<div class="modalBlock"></div>');

        section.querySelector(".form__close").addEventListener('click', (event) => { //Закрытие
            this.clearModalForm()
            event.isGModalClick = true
        });

        section.querySelector(".modalBlock").addEventListener('click', (event) => { //Закрытие по нажатию на модальный блок
            this.clearModalForm()
            event.isGModalClick = true
        });

        section.querySelector('.gForm').addEventListener('click', (event) => {
            event.isGModalClick = true
        })

        this.isModal = true
    }

    clearModalForm() {
        this.section.querySelector('.gForm').remove();
        this.section.querySelector(".modalBlock").remove();

        this.isModal = false
    }

    clearTaskPanel() {
        Array.prototype.slice.call(this.taskPanel.children, 1).forEach(($el) => {
            $el.remove()
        })
    }

    clearMarkedTask() {
        if (this.currentTaskMarked) {
            this.currentTaskMarked.classList.remove('target');
            this.currentTaskMarked = null
        }
    }

    markTask($taksItem) {
        if (this.currentTaskMarked && $taksItem !== this.currentTaskMarked) {
            this.currentTaskMarked.classList.remove('target');
        }
        this.currentTaskMarked = $taksItem;
        $taksItem.classList.add('target');
    }

    markDesc($descItem){
        if (this.currentDescMarked && $descItem !== this.currentDescMarked) {
            this.currentDescMarked.classList.remove('target');
        }
        this.currentDescMarked = $descItem;
        $descItem.classList.add('target');
    }

    manageBtn(idElem, disabled = false) {
        this.section.querySelector(`#${idElem}`).disabled = disabled
    }

    renderTasks(tasks) {
        let taskPanel = this.taskPanel
        let relatedTasks = new Map()

        this.clearTaskPanel()
        tasks.forEach(elem => {
            let tempTask = document.createElement('div');
            tempTask.classList.add('contentTask__task');
            tempTask.textContent = elem.value;

            let elemIndicator = document.createElement('div');
            elemIndicator.style.background = View.colorIndicator[elem.important - 1];
            elemIndicator.classList.add('taskIndicator');
            tempTask.append(elemIndicator);
            taskPanel.append(tempTask);

            //добавление в массив ссылок на объект
            relatedTasks.set(tempTask, elem);
        });

        return relatedTasks
    }

    clearDescsList(){
        this.descList.innerHTML = ''
    }

    renderDescs(descs) {
        let relatedDescs = new Map()

        this.clearDescsList()
        descs.forEach(elem => {
            let descItem = document.createElement('div')
            descItem.classList.add('contentTask__solution')
            descItem.textContent = elem.title
            this.descList.append(descItem)

            //добавление в массив ссылок на объект
            relatedDescs.set(descItem, elem);
        });

        return relatedDescs
    }

    displayText(text){
        this.descText.textContent = text
    }
}