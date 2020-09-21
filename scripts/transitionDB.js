import { db } from "./openDB.js";

let dbInventor = {
	clearAllStorages(stores){
		let tx = db.transaction(stores, 'readwrite')
		stores.forEach( (storeName) => {
			tx.objectStore(storeName).clear()
		});

		return new Promise((resolve, reject) => {
			tx.oncomplete = resolve
			tx.onerror = reject
		})
	},
	putItem(nameDB, item, id = undefined){
		let tx = db.transaction(nameDB, 'readwrite')
		let store = tx.objectStore(nameDB)

		return store.put(item, id)
	},
	addItem(nameDB, item) {
		let tx = db.transaction(nameDB, 'readwrite');

		return tx.objectStore(nameDB).add(item);
	},
	getItem(nameDB, itemId) {
		let transaction = db.transaction(nameDB, 'readonly');
		let tempStore = transaction.objectStore(nameDB);

		let request = tempStore.get(itemId);

		return request;
	},
	deleteItem(nameDB, id){
		let tx = db.transaction(nameDB, 'readwrite')
		let store = tx.objectStore(nameDB)
		return store.delete(id)
	},
	getAllItems(nameDB){
		let tx = db.transaction(nameDB, 'readonly')
		let store = tx.objectStore(nameDB)
		return store.getAll()
	},
	getAllWithKey(nameDB){
		let tx = db.transaction(nameDB, 'readonly')
		let objectStore = tx.objectStore(nameDB)
		let cursor = objectStore.openCursor()
		let itemsArr = []

		return new Promise((resolve, reject) => {
			cursor.onsuccess = () => {
				let cursorResult = cursor.result
	
				if(cursorResult){
					itemsArr[itemsArr.length] = {
						key: cursorResult.primaryKey,
						item: cursorResult.value
					}
					cursorResult.continue()
				}else{
					resolve(itemsArr)
				}
			}

			cursor.onerror = () => {
				reject(cursor.error)
			}
		})
	}
};

export { dbInventor };

















