const express = require('express')
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

// insert table item
router.post('/insert', asyncHandler(async (req, res) => {
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