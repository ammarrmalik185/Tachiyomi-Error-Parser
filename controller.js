const tachiyomi = require("./tachiyomiErrorParser");

function main(){
	tachiyomi.getFilePath("Enter the path to the error log: ").then(path => {
		tachiyomi.readFileContents(path).then(data => {
			let parsedData = tachiyomi.parseData(data);
			let rearrangedData = tachiyomi.rearrangeData(parsedData);
			tachiyomi.getCache("cache.json").then(cache => {
				let writeData = tachiyomi.getWriteData(cache, rearrangedData);

				tachiyomi.beautifyDisplayJSON(writeData);

				tachiyomi.saveFileContents("cache.json", writeData).then(() => {
					console.log("Done");
				}).catch(e => {
					console.log(e);
				})
			}).catch(e => {
				console.log(e);
			})
		}).catch(e => {
			console.log(e);
		})
	}).catch(e => {
		console.log(e);
	})
}

function addDataArrangedJSON(req, res){
	tachiyomi.getCache(process.env.CACHE_PATH).then(cache => {
		let writeData = tachiyomi.getWriteData(cache, req.body);
		tachiyomi.saveFileContents(process.env.CACHE_PATH, writeData).then(() => {
			res.status(200).send(writeData);
		})
	})
}

function addDataUnArrangedJSON(req, res){
	let data = req.body;
	req.body = tachiyomi.rearrangeData(data);
	addDataArrangedJSON(req, res);
}

function addDataString(req, res){
	let data = req.body;
	console.log(data);
	req.body = tachiyomi.parseData(data);
	addDataUnArrangedJSON(req, res);
}

function getCacheData(req, res){
	tachiyomi.getCache(process.env.CACHE_PATH).then(data => {
		res.status(200).send(data);
	})
}

module.exports = {
	 main, addDataArrangedJSON, addDataUnArrangedJSON, addDataString, getCacheData
}
