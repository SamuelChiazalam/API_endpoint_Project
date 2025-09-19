const http = require("http");
const path = require("path");
const fs = require("fs");

//Set the port
const PORT = process.env.PORT || 7000;

//Join the student details and error page
const studentDetails = path.join(__dirname, "index.html");
const homePage = path.join(__dirname, "home.html");
const errorPage = path.join(__dirname, "404.html");

//Handle all requests and end-points
function requestHandler(req, res) {
  if (req.url === "/" && req.method === "GET") {
    homePageHandler(req, res);
  } else if (req.url === "/index.html" && req.method === "GET") {
    getStudentDetails(req, res);
  } else {
    errHandler(req, res);
    res.writeHead(400);
  }
}

//Read the index.html file
function getStudentDetails(req, res) {
  fs.readFile(studentDetails, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    } else {
      res.end(data);
    }
  });
}

//Handles the Home Page
function homePageHandler(req, res) {
  fs.readFile(homePage, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    } else {
      res.end(data);
    }
  });
}

//Read the 404.html file
function errHandler(req, res) {
  fs.readFile(errorPage, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    } else {
      res.end(data);
    }
  });
}

//Create the server
const server = http.createServer(requestHandler);

//Start the server
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
  console.log(
    `Visit http://localhost:${PORT}/index.html to get Student details`
  );
});
