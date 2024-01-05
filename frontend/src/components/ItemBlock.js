import Item from "./Item"


export default function ItemBlock({ items }) {

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {
            items.map((item, idx) => {
                return <Item key={idx} description={item} picture={'test'} dateLost={'2024-01-01'} locationFound={'garbage can'} status={'Unclaimed'} finderName={'me'}/>
            })
        }
        </div>
    )
}