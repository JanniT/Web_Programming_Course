"use strict";
// I used the typescript documentation in help of doing this task
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
// using union to declare the vechile 
// type AllVehicles = Car | Boat | Plane | Vehicle
// Defining the vechile list that is used to append new vechiles
let vehicleList = [];
app.post("/vehicle/add", (req, res) => {
    // the req.body is type Vechile
    const { model, color, year, power, bodyType, wheelCount, draft, wingspan } = req.body;
    // Checking if any of the properties is missing
    if (!model || !color || !year || !power) {
        return res.status(400).json({ error: "Some properties is missing" });
    }
    if (bodyType) {
        // Creating a new vechile from the new properties
        const newVehicle = {
            model,
            color,
            year,
            power,
            bodyType,
            wheelCount
        };
        vehicleList.push(newVehicle);
        // console.log(newVehicle)
    }
    else if (draft) {
        const newVehicle = {
            model,
            color,
            year,
            power,
            draft
        };
        vehicleList.push(newVehicle);
        // console.log(newVehicle)
    }
    else if (wingspan) {
        const newVehicle = {
            model,
            color,
            year,
            power,
            wingspan
        };
        vehicleList.push(newVehicle);
        // console.log(newVehicle)
    }
    else {
        const newVehicle = {
            model,
            color,
            year,
            power
        };
        vehicleList.push(newVehicle);
    }
    // console.log(vehicleList)
    res.status(201).send("Vehicle added");
});
app.get("/vehicle/search/:model", (req, res) => {
    const queryModel = req.params.model;
    let vehicleFound = false;
    for (let i = 0; i < vehicleList.length; i++) {
        if (vehicleList[i].model === queryModel) {
            vehicleFound = true;
            return res.send(vehicleList[i]);
        }
    }
    if (vehicleFound === false) {
        return res.status(404).send();
    }
});
app.get("/hello", (req, res) => {
    let helloWorld = "Hello world";
    res.send(helloWorld);
});
app.listen(port, () => {
    console.log("Server is runing at http://localhost/:" + port);
});
