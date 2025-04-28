# QFMicro PureJS Client

To run this from your desktop in Chrome you'll need to disable CORS. 

chrome.exe --user-data-dir="C://ChromeNoCORS" --disable-web-security

Apologies for the lack of code comments. This was a proof-of-concept for a proposed update path for the Census Bureau's QuickFacts application.
https://www.census.gov/quickfacts/

It packs data data into binary files. Javascript unpacks the binary files and stores it locally using the IndexedDB API https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
