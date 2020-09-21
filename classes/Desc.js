import {db} from '../scripts/openDB.js'
import {dbInventor} from '../scripts/transitionDB.js'

export default class Desc{
    id = undefined

    constructor(title, text, refId){
        this.title = title
        this.text = text
        this.refId = refId
    }

    save(){
        let putRequest = dbInventor.putItem('solution', this, this.id)

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