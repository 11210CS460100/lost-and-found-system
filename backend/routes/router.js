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
}))

router.get('/callpy', asyncHandler(async (req, res) => {
	
    console.log('func')

    try {
		let process = child_process.spawn('python', ["./routes/testpy.py"])
        process.stdout.on('data', (data) => {
            const text = data.toString('utf8')
            console.log(text)
            res.status(201).json({a: text})
        })
	} catch (error) {
		res.status(500).send(error)
	}
   
}))

module.exports = router