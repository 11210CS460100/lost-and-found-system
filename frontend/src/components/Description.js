
export default function Description({ description, setFunction, idx }) {

    const changeDescription = (e) =>{
        let modifiedDescription = e.target.value

        setFunction((prev) => {
            let newDescription = [...prev]
            newDescription[idx] = modifiedDescription
            return newDescription
        })

    }

    return(
        <div>
            <label className="child-description-label" htmlFor="description">{idx}:</label>
            <input className="child-description" type="text" name="description" value={description} onChange={(e) => changeDescription(e)}></input>
        </div>
    )
}