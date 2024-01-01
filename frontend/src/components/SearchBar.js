
export default function SearchBar({ searchBarChangedCallback }) {

    return (
        <div className="search-bar">
            <input className="search-bar-input" placeholder='Search...' onChange={searchBarChangedCallback}/>
        </div>
    )
}