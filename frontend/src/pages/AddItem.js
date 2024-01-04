import { useState, useEffect } from "react"
import axios from "axios"
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";

import "react-datepicker/dist/react-datepicker.css";
export default function AddItem({ setShowAddItem }) {
    const [date, setdate] = useState(new Date());
    const [isAnonymous, setIsAnonymouse] = useState(true)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const passDataToBackend = async (jsonData) => {
        await axios.post('http://localhost:4000/addItem', {
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
        let imageLink = await uploadPicture(data.picture[0]).then();
        let lostDate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
        let locationFound = data.locationFound;
        let finderName = isAnonymous ? "Anonymous" : data.finderName;
        let finderContact = isAnonymous ? "Anonymous" : 'Empty';

        let jsonData = {
            "dateLost" : lostDate,
            "locationFound" : locationFound,

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

        return returnLink
    }

    return (
        <div className="half-transparent-background" onClick={setShowAddItem.bind(this, false)}>
            <div className="background" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Lost Date */}
                    <div>
                        <label htmlFor="lostDate">Lost Date:</label>
                        <DatePicker showIcon selected={date} onChange={setdate}/>
                    </div>
                    {/* Lost Date */}

                    {/* Location Found */}
                    <div>
                        <label htmlFor="locationFound">Lost Found:</label>
                        <input type="text" name="locationFound" {...register("locationFound")}/>
                    </div>
                    {/* Location Found */}

                    {/* Picture */}
                    <div>
                        <label htmlFor="picture">Picture:</label>
                        <input type="file" name="picture" {...register("picture")}/>
                    </div>
                    {/* Picture */}

                    {/* Finder */}
                    <div>
                        <label htmlFor="finder">Finder: </label>
                        <input
                            type="checkbox"
                            name="finder"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymouse(e.target.checked)}
                            />
                        <label>Anonymous</label>
                        {
                            isAnonymous == true ? null :
                            <div>
                                <label htmlFor="name">Name:</label>
                                <input type="text" name="name" {...register("name")}/>
                                <label htmlFor="contact">Contact:</label>
                                <input type="text" name="contact" {...register("contact")}/>
                            </div>
                        }
                    </div>
                    {/* Finder */}

                    <div className="form-control">
                        <label></label>
                        <button type="submit">Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}