const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'workflows', 'faceDatabase', 'data.json')

function loadData(){
    try{
        const rawData = fs.readFileSync(dataFilePath);
        return JSON.parse(rawData);
    }
    catch{
        return {};
    }
}

function saveData(data){
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

module.exports = {
    loadData, saveData
}