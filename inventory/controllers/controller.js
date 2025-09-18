// Require modules
const path = require("path");
const fs = require("fs");
const { response } = require("../utils/utils");

// Connect the local database (JSON file)
const itemsDbPath = path.join(__dirname, "..", "db", "items.json");

// Define allowed sizes for validation
const ALLOWED_SIZES = ["small", "s", "medium", "m", "large", "l"];

// Handle all get requests
function getAllItems(req, res) {
  fs.readFile(itemsDbPath, "utf8", (err, items) => {
    if (err) {
      console.log(err);
      return response(
        res,
        500,
        false,
        null,
        "An internal server error occured. Could not read items from database !"
      );
    }

    const parsedItems = JSON.parse(items);
    response(res, 200, true, parsedItems, "Items successfully retrieved !");
  });
}

// Handle get request by ID
function getItemById(req, res) {
  const parts = req.url.split("/");
  const itemId = parts[parts.length - 1];

  fs.readFile(itemsDbPath, "utf8", (err, data) => {
    if (err) {
      return response(
        res,
        500,
        false,
        null,
        "Could not read items from database!"
      );
    }

    let items;
    try {
      items = JSON.parse(data);
    } catch {
      return response(res, 500, false, null, "Database file is corrupted!");
    }

    console.log("Looking for id:", itemId);
    console.log(
      "Available ids:",
      items.map((i) => i.id)
    );

    const item = items.find((i) => String(i.id) === String(itemId));

    if (!item) {
      return response(res, 404, false, null, "Item not found!");
    }

    response(res, 200, true, item, "Item successfully retrieved !");
  });
}

// Handle post request to create new item
function createItem(req, res) {
  const body = [];

  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", () => {
    const itemData = Buffer.concat(body).toString();
    let newItem;
    try {
      newItem = JSON.parse(itemData);
    } catch (err) {
      // Log the err to help you catch the error
      // console.log(err);
      return response(
        res,
        400,
        false,
        null,
        "Invalid JSON format in request body !"
      );
    }

    // Validation: required fields
    const { name, price, size } = newItem;
    if (!name || !price || !size) {
      return response(
        res,
        400,
        false,
        null,
        "Missing required fields: name, price, size !"
      );
    }

    // Validate size
    if (!ALLOWED_SIZES.includes(size.toLowerCase())) {
      return response(
        res,
        400,
        false,
        null,
        "Invalid size! Allowed sizes are: small(s), medium(m), large(l)."
      );
    }

    fs.readFile(itemsDbPath, "utf8", (err, data) => {
      if (err) {
        console.log(err);
        return response(
          res,
          500,
          false,
          null,
          "An internal server error has occured. Could not read items from database !"
        );
      }

      const oldItems = JSON.parse(data);

      // Generate a new unique id automatically
      const newId =
        oldItems.length > 0
          ? String(Math.max(...oldItems.map((i) => Number(i.id))) + 1)
          : "1";

      const itemWithId = { id: newId, name, price, size };
      const allItems = [...oldItems, itemWithId];

      fs.writeFile(itemsDbPath, JSON.stringify(allItems, null, 2), (err) => {
        if (err) {
          console.log(err);
          return response(
            res,
            500,
            false,
            null,
            "An internal server error has occured. Could not save item to database !"
          );
        }

        response(res, 201, true, itemWithId, "Item successfully created !");
        console.log(itemWithId);
      });
    });
  });
}

// Handle patch request to update existing item
function updateItem(req, res) {
  const parts = req.url.split("/");
  const itemId = parts[parts.length - 1];
  const body = [];

  req.on("data", (chunk) => body.push(chunk));

  req.on("end", () => {
    let detailsToUpdate;
    try {
      detailsToUpdate = JSON.parse(Buffer.concat(body).toString());
    } catch {
      return response(res, 400, false, null, "Invalid JSON format!");
    }

    if (Object.keys(detailsToUpdate).length === 0) {
      return response(res, 400, false, null, "Nothing to update!");
    }

    // Validate size if it's being updated
    if (
      detailsToUpdate.size &&
      !ALLOWED_SIZES.includes(detailsToUpdate.size.toLowerCase())
    ) {
      return response(
        res,
        400,
        false,
        null,
        "Invalid size! Allowed sizes are: small(s), medium(m), large(l)."
      );
    }

    fs.readFile(itemsDbPath, "utf8", (err, data) => {
      if (err) {
        return response(res, 500, false, null, "Could not read database!");
      }

      const existingData = JSON.parse(data);

      // Displays the available ids and the id being searched for if necessary (for debugging)
      // console.log("Looking for id:", itemId);
      // console.log(
      //   "Available ids:",
      //   existingData.map((i) => i.id)
      // );

      const itemIndex = existingData.findIndex(
        (item) => String(item.id) === String(itemId)
      );

      if (itemIndex === -1) {
        return response(res, 404, false, null, "Item not found!");
      }

      const updatedItem = { ...existingData[itemIndex], ...detailsToUpdate };
      existingData[itemIndex] = updatedItem;

      fs.writeFile(
        itemsDbPath,
        JSON.stringify(existingData, null, 2),
        (err) => {
          if (err) {
            return response(res, 500, false, null, "Could not update item!");
          }

          response(res, 200, true, updatedItem, "Item successfully updated!");
        }
      );
    });
  });
}

// Handle delete request to remove item by ID
function deleteItem(req, res) {
  const parts = req.url.split("/");
  const id = parts[parts.length - 1];

  fs.readFile(itemsDbPath, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return response(
        res,
        500,
        false,
        null,
        "An internal server error occured. Could not read items from database !"
      );
    }

    let items = JSON.parse(data);
    const itemIndex = items.findIndex((item) => item.id == id);

    // Displays the available ids and the id being searched for if necessary (for debugging)
    // console.log("Looking for id:", id);
    // console.log(
    //   "Available ids:",
    //   items.map((i) => i.id)
    // );

    if (itemIndex === -1) {
      return response(res, 404, false, null, "Item not found !");
    }

    const deletedItem = items.splice(itemIndex, 1)[0];

    fs.writeFile(itemsDbPath, JSON.stringify(items, null, 2), (err) => {
      if (err) {
        console.log(err);
        return response(
          res,
          500,
          false,
          null,
          "An internal server error occued. Could not delete item from database !"
        );
      } else {
        response(res, 200, true, deletedItem, "Item successfully deleted !");
      }
    });
  });
}

// Export controller functions
module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
