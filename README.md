# switch
assessment solution to switch
install JSON server for mock data
npm install -g json-server
➜  switch git:(main) ✗ sudo npm install -g json-server  


json-server --watch db.json --port 3001

json-server --host 0.0.0.0 --watch db.json --port 3001 external


ifconfig | grep "inet ":--mac


Run JSON Server with verbose logging using --verbose:

sh
Copy
Edit
json-server --host 0.0.0.0 --watch db.json --port 3001 --verbose
This will log every request made to the server, including:

HTTP method (GET, POST, PUT, DELETE)
Request body
Response status codes