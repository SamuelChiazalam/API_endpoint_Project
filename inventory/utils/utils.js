//Reusable function
function response(res, statusCode, success, data, message) {
  res.writeHead(statusCode, {  "Content-Type": "application/json"  });
  res.end(JSON.stringify({  success, data, message  }));
}

module.exports = {
  response
}