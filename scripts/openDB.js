let openRequest = indexedDB.open("toDo", 1);

/**@type {IDBDatabase} */
let db

let readyDB = new Promise((resolve, reject) => {
	openRequest.addEventListener('success', function (event) {
		db = openRequest.result;
		resolve(db)

		db.onversionchange = function (event) {               //Создание хранилищ в иной вкладке
			db.close();
			location.reload()
		}
	});
})

openRequest.onerror = function (event) {
	alert(openRequest.error);
}

openRequest.onupgradeneeded = function (event) { //Создание хранилища
	db = openRequest.result;

	switch (event.oldVersion) {
		case 0:
			db.createObjectStore("task", { autoIncrement: true });
			db.createObjectStore("solution", { autoIncrement: true });
			break;
	}
}

openRequest.onblocked = function () {
	alert("Неожиданная ошибка");
	location.reload();
};

export { db, readyDB };





