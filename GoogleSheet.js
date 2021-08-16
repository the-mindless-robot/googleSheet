class GoogleSheet {
    constructor(id) {
        this.id = id;
    }
    async load(callback = false, options = false) {
        const sheet = {};
        let moreData;
        let sheetNumber = options && options.hasOwnProperty('start') ? options.start : 1;
        const sheetNumberEnd = options && options.hasOwnProperty('end') ? options.end : false;
        const APIkey = 'api-key-goes-here';

        do {
            moreData = false;
            const v4 = 'https://sheets.googleapis.com/v4/spreadsheets/' + this.id + '/values/Sheet' + sheetNumber + '?key='+ APIkey;
            console.debug('url', v4);
            const response = await fetch(v4);
            // console.log('response', response);
            console.log(`sheet${sheetNumber} ${response.status}`);
            const data = response.status == 200 ? await response.json() : false;

            if(data) {
                console.debug('data', data);
                const rows = buildRowsV4(data);
                
                console.debug('rows', rows);
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
            console.debug('labels', labels);
            console.debug('row', data.values[row]);
            
            const rowValues = data.values[row];

            for(let i=0; i < labels.length; i++) {
                const label = labels[i];
                const value = rowValues[i];

                console.debug(`${label} : ${value}`);
                rowObj[label] = value;
                console.debug('rowObj', rowObj);
            }
            rows.push(rowObj)
        }
    }

    return rows;
}

function buildRows(data) {

    const rows = [];

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
        console.warn('No data in sheet');
        return "No data found";
    }

    return rows;
}

function getSheetName(data) {
    return  data.feed.title.$t.toLowerCase().trim();
}
