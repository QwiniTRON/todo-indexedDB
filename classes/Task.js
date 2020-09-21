import { db } from '../scripts/openDB.js'
import { dbInventor } from '../scripts/transitionDB.js'

export default class Task {
    id = undefined

    constructor(value, important) {
        this.value = value
        this.important = important
    }

    save() {
        let putRequest = dbInventor.putItem('task', this, this.id)

        return new Promise((resolve, reject) => {
            putRequest.onsuccess = () => {
                if (!this.id) {
                    this.id = putRequest.result
                }
                resolve()
            }
            putRequest.onerror = reject
        })
    }
}