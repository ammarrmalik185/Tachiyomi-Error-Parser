const readline = require('readline');
const fs = require('fs');

function getFilePath(prompt){
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((res, rej) =>{
        rl.question(prompt, path => {
            res(path);
            rl.close();
        });
    })
}

function readFileContents(path){
    return new Promise((res, rej) => {
        fs.readFile(path, {encoding:'utf8', flag:'r'}, function(err, data) {
            if(err) rej(err);
            res(data);
        });
    })
}

function parseData(data){
    let lines = data.split("\n")
    let lastError = "unknown";
    let lastSource = "unknown";
    let parsedData = {};

    for (let line of lines){
        let trimedLine = line.trim();
        let id = trimedLine.charAt(0);
        let lineContent = trimedLine.replace(`${id} `, "");
        switch (id){
            case('!'):
                lastError = lineContent;
                break;
            case('#'):
                lastSource = lineContent;
                break;
            case('-'):
                if (!parsedData[lastError]) parsedData[lastError] = {}
                if (!parsedData[lastError][lastSource]) parsedData[lastError][lastSource] = []
                parsedData[lastError][lastSource].push(lineContent)

        }
    }
    return parsedData;
}

function rearrangeData(data){
    let newData = {}
    for (let error in data){
        for (let source in data[error]){
            for (let manga of data[error][source]){
                if (!newData[source]) newData[source] = {}
                if (!newData[source][manga]) newData[source][manga] = {}
                if (!newData[source][manga][error]) newData[source][manga][error] = {}
                newData[source][manga][error] = {
                    count : 1,
                    lastOccurance : Date.now()
                }
            }
        }
    }
    return newData;
}

function getCache(path){
    return new Promise((res, rej) => {
        readFileContents(path).then(data => {
            try{
                res(JSON.parse(data));
            }catch(e){
                res({});
            }
        }).catch(e => {
            res({});
        });
    })
}

function appendData(oldData, newData){
    if (!oldData) oldData = {};
    for (let source in newData){
        for (let manga in newData[source]){
            for (let error in newData[source][manga]){
                if (oldData[source] && oldData[source][manga] && oldData[source][manga][error]){
                    oldData[source][manga][error].count += 1;
                    oldData[source][manga][error].lastOccurance = Date.now();
                    console.log("Found duplicate");
                }else{
                    if (!oldData[source]) oldData[source] = {}
                    if (!oldData[source][manga]) oldData[source][manga] = {}
                    oldData[source][manga][error] = {
                        count : 1,
                        lastOccurrence : Date.now()
                    }
                }
            }
        }
    }
    return oldData;
}

function saveFileContents(path, data){
    return new Promise((res, rej) => {
        fs.writeFile(path, JSON.stringify(data), function(err) {
            if(err) rej(err);
            res();
        });
    })
}

function beautifyDisplayJSON(data){
    return JSON.stringify(data, null, 2);
}

function getWriteData(cache, arrangedData){
    let newData = appendData({...cache.data}, arrangedData);

    let previousData = cache.previousData;
    if (!previousData) previousData = [];
    if (cache.data) previousData.push(cache.data);

    return {
        data: newData,
        previousData: previousData,
        runCount: cache.runCount ? cache.runCount + 1 : 1,
        lastRun: Date.now(),
        firstRun: cache.firstRun ? cache.firstRun : Date.now()
    };
}

module.exports = {
    getFilePath,
    readFileContents,
    parseData,
    rearrangeData,
    getCache,
    saveFileContents,
    beautifyDisplayJSON,
    getWriteData
}
