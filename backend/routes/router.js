const express = require('express')
const router = express.Router()
const child_process = require('child_process')
// handle the timeout 
const asyncHandler = require('express-async-handler');
const schemas = require('../models/schemas')
// directly install node-fetch will cause error, please install node-fetch@2
// https://stackoverflow.com/questions/69087292/requirenode-fetch-gives-err-require-esm
var fetch = require('node-fetch');
const mongoose = require('mongoose');

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

router.get('/finding/:q', async(req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(500).send('Database not connected');
    }
    const query = String(req.params.q)
    //use the query to compare with all the other 
    let allItems = await schemas.Items.find({},{description: 1})
    
    // the way to extract value from json document
    let desArray = []
    let idArray = []
    for (var i =0; i< allItems.length ;i++) {
        desArray.push(allItems[i].description);
        idArray.push(allItems[i]._id)
    }
    //description in the database to find the closest one
/*--TODO: call python--*/
    console.log(desArray)
    console.log(idArray)
    console.log('func')

    try {
        let param1 = desArray
        let param2 = idArray
        let param3 = query
        let process = child_process.spawn('python', ["./routes/testpy.py", param1, param2, param3]) //create a child process
        process.stdout.on('data', (data) => { //collect output form child process. Remember to do sys.stdout.flush() in .py
            const text = data.toString('utf8')
            console.log(text)
            res.status(201).json({a: text}) //response to client
        })
    } catch (error) {
        //console.log('error')
        res.status(500).send(error)
    }
    //get the return index or id?

    //let item = await schemas.Items.findById("6597a9a589cf0b7926862d09")    
    /*
    await schemas.Items.findOne({_id: new mongoose.Types.ObjectId("6597a9a589cf0b7926862d09")},
                                                        {description: 1, picture:1})   
                .then(doc => {
                    res.status(200).json(doc)
                })
                .catch(err => {
                    res.status(500).json({error: 'Could not find the document'})
                })*/
})


// other api functions

// insert table item
router.post('/addItem', asyncHandler(async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(500).send('Database not connected');
    }
    // Example data to be saved
    /*const itemData = {
        description: "Black leather wallet",
        picture: "https://example.com/images/wallet.jpg",
        dateLost: new Date(),
        locationFound: "Main Street Park",
        status: "Unclaimed",
        finder: {
            "name": "Test Test",
            "contact": "0912345678"
        }
    };*/
    // example of body 

    // Create an instance of the Items model
    const item = new schemas.Items(req.body);

    console.log(item)
	try {
		await item.save()
        .then(res.send("successfully insert"))
        .catch(error => console.error('Error saving item:', error));
	} catch (error) {
		res.status(500).send(error)
	}
    res.end();
}));

module.exports = router