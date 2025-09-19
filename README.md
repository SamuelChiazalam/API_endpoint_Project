# API_endpoint_Project


## 1
Without using a framework, build a web server to render html files:
When I navigate to “/index.html”, I should see a simple webpage of the student. (Nothing fancy)
Add another feature such that when I navigate to “{random}.html” it should return with a 404 page


## 2
Without using a framework, build an api server to manage inventory information. Api should be able to
Create item
Get all items
Get one item
Update item
Delete item
Item should have the following attributes
Name
Price
Size: small(s), medium(m) or large(l)
Id
Things to note:
Return data structure should be consistent among the apis
Ensure code is modular
Handle errors where possible
No need to use database, use file system to persist data eg items.json
