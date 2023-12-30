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
    return (
        <>
            <h1>Homepage</h1>
            <ul className="productBox">
                <li>
                    <a href="/product/143" className="productLink"> <img className="productImage" src="https://imgur.com/a/GbM6sKT" alt="Eat, Sleep, Code, Repeat"/></a>
                    <br/><a href="/product/143" className="productLink">It's a good day to code</a>
                </li>
                <li>
                    <a href="/product/486" className="productLink"><img className="productImage" src={require('../assets/images/eat-sleep-code-repeat.jpg')} alt="Eat. Sleep. Code. Repeat."/></a>
                    <br /><a href="/product/486" className="productLink">Eat. Sleep. Code. Repeat.</a>
                </li>
            </ul>
        </>
    )
}