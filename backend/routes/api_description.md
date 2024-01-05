## The description for api in the backmd 

### 輸入url得到description
方法: get
使用網址: http://127.0.0.1:4000/description/rwC9sD0
後面那段的網址是: https://i.imgur.com/rwC9sD0.jpg  的 rwC9sD0
response: 
[
    {
        "generated_text": "there is a usb drive that is laying on a table"
    }
]

### add item
方法: post 
使用網址: http://127.0.0.1:4000/addItem
需要確定的是傳過來的body必須類似以下的樣子
{
    "description": "Black leather wallet",
    "picture": "https://example.com/images/wallet.jpg",
    "dateLost": "2024-01-03",
    "locationFound": "Main Street Park",
    "status": "Unclaimed",
    "finder": {
        "name": "Test Test",
        "contact": "0912345678"
    }
}
response: successfully insert or error code

