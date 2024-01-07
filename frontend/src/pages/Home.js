import { useState, useEffect } from "react"
import axios from "axios"

import ItemBlock from "../components/ItemBlock";
import SearchBar from "../components/SearchBar";
import AddItem from "./AddItem";

// now replace the content https://imgur.com/a/GbM6sKT with the image ../assets/images/eat-sleep-code-repeat.jpg
// now replace the content https://imgur.com/a/y7a2zwZ with the image ../assets/images/good-day-to-code.jpg


// TODO
// 1. currently, the image can't shown properly, this problem may be caused by
// https://stackoverflow.com/questions/40489569/images-from-imgur-com-is-not-displaying-on-website
// for the implementation for the backend, we will only give the url for the image. Which I think
// will be the imgur url if expected.


// 2. Each item will have an id, which will be used to identify the item (For the example below, it will be 143 and 486)


// Backend team will create the schema for the item, which will be used to store the information for the item
// The schema will be like the following:
/*
const itemSchema = new Schema({
    description: { type: String, required: true },
    picture: { type: String, required: true }, // the url for the image
    dateLost: { type: Date }, // This can be optional
    locationFound: { type: String },
    status: { type: String, default: 'Unclaimed' }, // e.g., 'Claimed', 'Unclaimed'
    finder_name: { type: String, default: 'Anonymous' }
});
*/

// Also, the backend team will create the APIs for the frontend team to use, which will be released later on

export default function Home() {
    const [items, setItems] = useState([])

    const searchBarChange = (e) => {
        let str = e.target.value;
        let isMessageEmpty = str === ""

        if(!isMessageEmpty)
        {
            let keywords = str.split(',')
            keywords = keywords.map((word) => word.trim()).filter(str => str)
            // console.log("keywords = " + keywords)
            // console.log("items = " + items)
            getItemsFromBackend(keywords)
            // setItems(() => [e.target.value, ...items])  // add item to the front to prevent scrolling
        }
    }

    const [isWaiting, setIsWaiting] = useState(false)
    const waitTest = async () => {
        let isDone = false

        await axios.get('http://127.0.0.1:4000/keywordsResult')
        .then(res => {
            console.log(res.data)
            isDone = res.data === ""
        })

        return isDone
    }

    useEffect((e) =>{
        const f = async () => {
            
            if(isWaiting)
            {
                console.log("prev")

                let isDone = false
                while(!isDone)
                {
                    isDone = await waitTest()
                }
                setIsWaiting(false)
                console.log("after")
            }
        }
        f()
    }, [isWaiting])

    const getItemsFromBackend = async (keywords) => {
        await axios.post('http://127.0.0.1:4000/keywords', {
            method: "post",
            body: JSON.stringify(keywords),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            let filteredItems = res.data
            console.log(res)
            setIsWaiting(true)
            // setItems(filteredItems)
        })
        .catch(err => console.log(err))

    }



    return (

        <div>
            <SearchBar searchBarChangedCallback={searchBarChange} />
            <br/>
            <ItemBlock items={items}> </ItemBlock>
        </div>
    )
}