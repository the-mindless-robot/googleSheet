class GoogleSheet {
    constructor(id) {
        this.id = id;
    }
    async load(callback = false, options = false) {
        const sheet = {};
        let moreData;
        let sheetNumber = options && options.hasOwnProperty('start') ? options.start : 1;
        const sheetNumberEnd = options && options.hasOwnProperty('end') ? options.end : false;
        const APIkey = 'xxxx';

        do {
            moreData = false;
            const v4 = 'https://sheets.googleapis.com/v4/spreadsheets/' + this.id + '/values/Sheet' + sheetNumber + '?key='+ APIkey;

            const response = await fetch(v4);
            // console.log('response', response);

            const data = response.status == 200 ? await response.json() : false;

            if(data) {

                const rows = buildRowsV4(data);
                sheet[`sheet${sheetNumber}`] = rows;

                if(!sheetNumberEnd || sheetNumber != sheetNumberEnd) {
                    sheetNumber++;
                    moreData = true;
                }
            }
        }
        while (moreData);

        if(callback && typeof callback == 'function') {
           return callback(sheet);
        }
        return sheet;
    }
}

function buildRowsV4(data) {
    const rows = [];

    if(data.values) {

        const labels = data.values[0];

        for(let row=1; row < data.values.length; row++) {
            const rowObj = {};

            const rowValues = data.values[row];

            for(let i=0; i < labels.length; i++) {
                const label = removeSpaces(labels[i].trim().toLowerCase());
                const value = rowValues[i].trim() ?? '';

//                 console.debug(`${label} : ${value}`);
                rowObj[label] = value;
//                 console.debug('rowObj', rowObj);
            }
            rows.push(rowObj)
        }
    }

    return rows;
}

function removeSpaces(string) {
	return string.replace(/\s+/g, '')
}