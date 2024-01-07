const express = require('express')
const child_process = require('child_process')
const router = express.Router()
// handle the timeout 
const asyncHandler = require('express-async-handler');
const schemas = require('../models/schemas')
// directly install node-fetch will cause error, please install node-fetch@2
// https://stackoverflow.com/questions/69087292/requirenode-fetch-gives-err-require-esm
var fetch = require('node-fetch');
const mongoose = require('mongoose');
const { json, text } = require('body-parser');

// GET all items



// image and description handling
async function query(imageUrl) {
    // Fetch the image data from the URL
    const imageResponse = await fetch(imageUrl);
    const imageData = await imageResponse.buffer();
    // Call the image captioning API
    const apiResponse = await fetch(
        "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large",
        {
            headers: { Authorization: "Bearer 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" },
            method: "POST",
            body: imageData,
        }
    );
    const result = await apiResponse.json();
    return result;
}


router.get('/description/:a', async(req, res) => {
	const name = String(req.params.a);
	const prefix_url = "https://i.imgur.com/";
	const suffix_url = ".jpg";
	const url = prefix_url + name + suffix_url;
	try {
        const response = await query(url);
        res.json(response);
    } catch (error) {
        console.error("Error fetching image description:", error);
        res.status(500).send("Error fetching image description");
    }
	res.end();
})

// search 

router.post('/finding/description', async(req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(500).send('Database not connected');
    }
    const query = String(req.body)
    console.log(query)
    //use the query to compare with all the other 
    let allItems = await schemas.Items.find({},{vector: 1})
    
    // the way to extract value from json document
    let vecArray = []
    let idArray = []
    for (var i =0; i< allItems.length ;i++) {
        vecArray.push(allItems[i].vector);
        idArray.push(allItems[i]._id)
    }
    //description in the database to find the closest one
    console.log(vecArray)
    console.log(idArray)
    console.log('func')
    var text
    try {
        let param1 = JSON.stringify(vecArray) //[3,5,-1.1]
        let param2 = idArray
        let param3 = query

        console.log(query)
        await findpy(param1,param2,param3).then((result)=>{text = result})
        console.log(text)
        const texts = text.split(' ')
        console.log(texts)
        texts[1] = texts[1].replace(/[\r\n]/gm, '');
        await schemas.Items.find({
            '_id': { $in: [
                new mongoose.Types.ObjectId(texts[0]),
                new mongoose.Types.ObjectId(texts[1])
            ]}
        },{description: 1, picture:1})   
        
            .then(doc => {
                res.status(200).json(doc)
            })
            .catch(err => {
                res.status(500).json({error: 'Could not find the document',err})
            })
    } catch (error) {
        console.log(error)
        //res.status(500).send(error)
    }
    //get the return id
    //let item = await schemas.Items.findById(text)    
    
    
})


// other api functions

// delete a data
router.get('/delete/:id', asyncHandler(async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(500).send('Database not connected');
    }
    /*
    {
        "_id": {
            "$oid": "6597a762179c12b9eb7d3d51"
        },
        "description": "Black leather wallet",
        "picture": "https://example.com/images/wallet.jpg",
        "dateLost": {
            "$date": {
                "$numberLong": "1704240000000"
            }
        },
        "locationFound": "Main Street Park",
        "status": "Unclaimed",
        "finder": {
            "name": "Test Test",
            "contact": "0912345678",
            "_id": {
                "$oid": "6597a762179c12b9eb7d3d52"
            }
        }
    }
    */
    // url will be http://127.0.0.1:4000/delete/6597a762179c12b9eb7d3d51
    const id = req.params.id;
    console.log(id)
    try {
        await schemas.Items.findByIdAndDelete(id)
        .then(res.send("successfully delete"))
        .catch(error => console.error('Error deleting item:', error));
    } catch (error) {
        res.status(500).send(error)
    }
}))

// insert table item
router.post('/addItem', asyncHandler(async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(500).send('Database not connected');
    }
    // Example data to be saved
    /*const itemData = {
        "description": "Mikufuwa",
        "picture": "https://example.com/images/wallet.jpg",
        "dateLost": new Date(),
        "locationFound": "Main Street Park",
        "status": "Unclaimed",
        "finder": {
            "name": "Test Test",
            "contact": "0912345678"
        },
        "vector": [].shape() =384
    };*/
    // example of body 
    //generate vector for item
    //console.log(req.body)
    let obj = JSON.parse(JSON.stringify(req.body))
    //let obj = JSON.parse(JSON.stringify(itemData))
    //console.log('hi there')
    let param = obj.description
    //let param = "aa"
    console.log('hi there')
    try {
        //let process = child_process.exec('python')
        await postpy(param).then(result => {obj.vector = result})
        const item = new schemas.Items(obj)
        await item.save()
            .then(res.status(201).send("successfully insert"))
            .catch(error => console.error('Error saving item:', error));
        
        res.end();
    } catch (error) {
        res.status(500).send(error)
    }
    // Create an instance of the Items model
}))

router.get('/callpy', asyncHandler(async (req, res) => {
	
    console.log('func')

    try {
        let param1 = req.query.param1
        let param2 = req.query.param2
		let process = child_process.spawn('python', ["./routes/findpy.py", param1, param2]) //create a child process
        process.stdout.on('data', (data) => { //collect output form child process. Remember to do sys.stdout.flush() in .py
            const text = data.toString('utf8')
            console.log(text)
            res.status(200).json({a: text}) //response to client
        })
	} catch (error) {
		res.status(500).send(error)
	}
   
}))

function postpy(param){ //Promise python wrapper
    let process = child_process.spawn('python', ["./routes/postpy.py", param]) //create a child process
    return new Promise((resolve)=>{
        process.stdout.on('data', (data) => { //collect output form child process. Remember to do sys.stdout.flush() in .py
            const text = data.toString('utf8')
            vector = JSON.parse(text) //python return JSON string, parse it!
            resolve(vector)
        })
    })
}

function findpy(param1, param2, param3){ //Promise python wrapper
    let process = child_process.spawn('python', ["./routes/findpy.py", param1, param2, param3]) //create a child process
    console.log('child process spawned')
    return new Promise((resolve, reject)=>{
        try{
            process.stdout.on('data', (data) => { //collect output form child process. Remember to do sys.stdout.flush() in .py
                const text = data.toString('utf8') //TODO: what is the return val. of findpy?
                resolve(text)
            })
        }catch(err){
            console.log(err)
            reject(err)
        }
    })
   
}

module.exports = router