import { useState, useEffect } from "react"
import axios from "axios"
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";

import "react-datepicker/dist/react-datepicker.css";
import Description from "../components/Description";
export default function AddItem({ setShowAddItem }) {
    const [canSubmit, setCanSubmit] = useState(false)
    const [date, setdate] = useState(new Date())
    const [imageLink, setImageLink] = useState("")
    const [description, setDescription] = useState([])
    const [isAnonymous, setIsAnonymouse] = useState(true)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const passDataToBackend = async (jsonData) => {
        await axios.post('http://127.0.0.1:4000/addItem', {
            method: "post",
            body: JSON.stringify(jsonData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            console.log(res)
        })
        .catch(err => console.log(err))
    }

    const onSubmit = async (data) => {
        let lostDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        let locationFound = data.locationFound;
        let finderName = isAnonymous ? "Anonymous" : data.finderName;
        let finderContact = isAnonymous ? "Empty" : data.contact;

        let jsonData = {
            "picture" : imageLink,
            "dateLost" : lostDate,
            "locationFound" : locationFound,
            "description" : description,

            "finder" : {
                "finderName" : finderName,
                "finderContact" : finderContact,
            }
        }

        console.log(jsonData);

        await passDataToBackend(jsonData)
    };

    const uploadPicture = async (image) =>{
        const formData = new FormData()
        formData.append("image", image)

        let returnLink = ''

        await fetch("https://api.imgur.com/3/image/", {
            method: "post",
            headers: {
                Authorization: "Client-ID b27cb50169966c0",
                Accept: "application/json",
            },
            body: formData
        })
        .then(data => data.json())
        .then(data => {
            returnLink = data.data.link
        })
        .catch(err => console.log(err))

        return returnLink
    }

    const getdescription = async (e) => {
        let image = e.target.files[0]
        let link = await uploadPicture(image)

        if(link)
        {
            let imageName = link.split('/').at(-1)
            let imageID = imageName.split('.')[0]
            let url = "http://127.0.0.1:4000/description/" + imageID

            await axios.get(url)
                    .then(data => setDescription([String(data.data[0].generated_text)]))
                    .catch(err => console.log(err))

            console.log(description)
            setImageLink(link)
            setCanSubmit(true)
        }else
        {
            console.log('Invalid image')
        }

    }

    const changeDescription = (isAddOperation) => {
        if(isAddOperation)
        {
            setDescription((prev) => [...prev, ""])
        }else
        {
            if(description.length > 1)
            {
                let newDescription = [...description]
                newDescription.pop()
                setDescription(newDescription)
            }
        }
    }

    return (
        <div className="half-transparent-background" onClick={setShowAddItem.bind(this, false)}>
            <div className="background" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Lost Date */}
                    <div>
                        <label className="lostDate-label" htmlFor="lostDate">Lost Date:</label>
                        <DatePicker showIcon selected={date} onChange={setdate}/>
                    </div>
                    {/* Lost Date */}

                    {/* Location Found */}
                    <div>
                        <label className="locationFound-label" htmlFor="locationFound">Lost Found: </label>
                        <input type="text" name="locationFound" {...register("locationFound")}/>
                    </div>
                    {/* Location Found */}

                    {/* Picture */}
                    <div>
                        <label className="picture-label" htmlFor="picture">Picture: </label>
                        <input type="file" name="picture" onChange={getdescription}/>
                        {
                            // descriptions
                            description.length > 0
                            ?   <div>
                                    <label className="descrpition-label" htmlFor="description">Description: </label>
                                    <button className="add-descrption" type="button" onClick={() => changeDescription(true)} >add</button>
                                    <button className="remove-descrption" type="button" onClick={() => changeDescription(false)} >remove</button>
                                    {
                                        description.map((str, idx) => <Description key={idx} description={str} setFunction={setDescription} idx={idx}/>)
                                    }
                                </div>
                            : null
                        }
                    </div>
                    {/* Picture */}

                    {/* Finder */}
                    <div>
                        <label className="finder-label" htmlFor="finder">Finder: </label>
                        <input
                            type="checkbox"
                            name="finder"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymouse(e.target.checked)}
                            />
                        <label className="Anonymous-label">Anonymous</label>
                        {
                            isAnonymous == true ? null :
                            <div>
                                <label className="Name-label" htmlFor="name">Name: </label>
                                <input type="text" name="name" {...register("finderName")}/>
                                <label className="Contact-label" htmlFor="contact">&nbsp;Contact: </label>
                                <input type="text" name="contact" {...register("contact")}/>
                            </div>
                        }
                    </div>
                    {/* Finder */}

                    <div className="form-control">
                        <button type="submit" disabled={!canSubmit}>Add</button>
                    </div>
                </form>
            </div>
        </div>
    )
}