// import the http module to create an HTTP server
const http = require("http");

// Import the reusable response function
const { response } = require("../inventory/utils/utils.js");

// Import controller functions to handle requests to different endpoints
const {  getAllItems, getItemById, createItem, updateItem, deleteItem  } = require("./controllers/controller.js");

const HOST_NAME = "localhost";

// Set the port number
const PORT = process.env.PORT || 7000;

// Handle all endpoints / routes
function requestHandler(req, res) {
  if (req.url === "/api/inventory" && req.method === "GET") { //Read all items
    getAllItems(req, res);
  } else if (req.url.startsWith("/api/inventory/") && req.method === "GET") { //Read items by ID
    getItemById(req, res);
  } else if (req.url === "/api/inventory" && req.method === "POST") {  //Create new item
    createItem(req, res);
  } else if (req.url.startsWith("/api/inventory/") && req.method === "PATCH") { //Update existing item
    updateItem(req, res);
  } else if (req.url.startsWith("/api/inventory/") && req.method === "DELETE") {  //Delete item (by ID)
    deleteItem(req, res);
  } else {
    response(res, 404, false, null, "Route not found");  //Return 404 for all other endpoints
  }
}

// Create the server
const server = http.createServer(requestHandler);

// Start the server
server.listen(PORT, HOST_NAME, () => {
  console.log(`Server started at http://${HOST_NAME}:${PORT}`);
  console.log(`Visit http://${HOST_NAME}:${PORT}/api/inventory to access the inventory API`);
});
