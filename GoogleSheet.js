// 19h9Wsj01KZbQmdWC4QhJ-zRTOlvyFHRwFQmAJWF1F4Q

class GoogleSheet {
    constructor(id, sheetNumber = 1) {
        this.id = id;
        this.sheet = sheetNumber;
        this.url = 'https://spreadsheets.google.com/feeds/list/' + this.id + '/' + this.sheet + '/public/values?alt=json';
    }
    async load(callback = false) {
        let response = await fetch(this.url);
        let data = await response.json();

        let sheet = {};
        let sheetName = data.feed.title.$t;
        let rows = [];

        if (data.feed.entry) {
            data.feed.entry.forEach(row => {
                // console.log('row => ', row);
                let rowObj = {};
                for (let field in row) {
                    if (field.substring(0, 3) == 'gsx') {
                        rowObj[field.split('$')[1]] = row[field].$t;
                    }
                }
                rows.push(rowObj);
            });
        } else {
            console.error('No data in sheet');
        }

        console.log('cleanRows =>', rows);
        sheet[sheetName] = rows;

        if(callback && typeof callback == 'function') {
            callback(sheet);
            return;
        }
        return sheet;
    }
}



// function init(sheetNumber) {
// 	console.log('app loaded');
// 	loadJSON(sheetNumber);
// }
// function format(value) {
// 	return value;
// }
// function loadJSON(sheetNumber) {
// 	const id = '1mSjbAORDq8HxoWT10a220onnIJYiVEGNK5j2PZnEVYE';
// 	const sheetNum = Number(sheetNumber);
// 	console.log('SHEET:', sheetNum);
// 	const url = 'https://spreadsheets.google.com/feeds/list/' + id + '/' + sheetNum + '/public/values?alt=json';

// 	new Promise(function(resolve, reject){
// 		return fetch(url)
// 			.then(response => response.json())
// 			.then(data => {
// 			// console.log('data =>', data);
// 			let sheet = {};
// 			let sheetName = data.feed.title.$t;
// 			let rows = [];

// 			if(data.feed.entry) {
// 				data.feed.entry.forEach(row => {
// 					// console.log('row => ', row);
// 					let rowObj = {};
// 					for (let field in row) {
// 						if (field.substring(0, 3) == 'gsx') {
// 							rowObj[field.split('$')[1]] = format(row[field].$t);
// 						}
// 					}
// 					rows.push(rowObj);
// 				});
// 			} else {
// 				let rowObj = {};
// 				rowObj.subject = 'TBD';
// 				rows.push(rowObj);
// 			}

// 			console.log('cleanRows =>', rows);
// 			sheet[sheetName] = rows;
// 			resolve(sheet);
// 		})
// 	}).then(sheet => {
// 		console.log('sheet =>', sheet);
// 		//loadOutput(sheet);
// 	})
// }
