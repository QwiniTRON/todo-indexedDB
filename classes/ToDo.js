import {db} from '../scripts/openDB.js'

export default class ToDo{
    constructor(tasks = [], relatedTasks = new Map(), descs = [], relatedDescs = new Map()){
        this.tasks = tasks
        this.relatedTasks = relatedTasks
        this.currentTaskItem = null

        this.descs = descs
        this.currentDescs = null
        this.relatedDescs = relatedDescs
        this.currentDescItem = null
    }

    rest(){
        this.tasks = []
        this.relatedTasks = new Map()
        this.currentTaskItem = null

        this.descs = []
        this.currentDescs = null
        this.relatedDescs = new Map()
        this.currentDescItem = null
    }
}