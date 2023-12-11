// I used the typescript documentation in help of doing this task

import express, {Express, Request, Response, query} from "express"

const app: Express = express()
const port: number = 3000

app.use(express.json())

// Defining the vechile interface
interface Vehicle {
    model: string,
    color: string,
    year: number,
    power: number
}

interface Car extends Vehicle{ 
    bodyType: string,
    wheelCount: string
}

interface Boat extends Vehicle{
    draft: number    
}

interface Plane extends Vehicle{
    wingspan: number   
}

// using union to declare the vechile 
// type AllVehicles = Car | Boat | Plane | Vehicle

// Defining the vechile list that is used to append new vechiles
let vehicleList: Vehicle[] = []

app.post("/vehicle/add", (req: Request, res: Response) => {
    // the req.body is type Vechile
    const { model, color, year, power, bodyType, wheelCount, draft, wingspan } = req.body

    // Checking if any of the properties is missing
    if (!model || !color || !year || !power) {
        return res.status(400).json({ error: "Some properties is missing"})
    }

    if (bodyType) {
        // Creating a new vechile from the new properties
        const newVehicle: Car = {
            model,
            color,
            year,
            power,
            bodyType,
            wheelCount
        } 
        vehicleList.push(newVehicle)
        // console.log(newVehicle)

    } else if (draft){
        const newVehicle: Boat = {
            model,
            color,
            year,
            power,
            draft
        }
        vehicleList.push(newVehicle)
        // console.log(newVehicle)

    } else if (wingspan){
        const newVehicle: Plane = {
            model,
            color,
            year,
            power,
            wingspan
        }
        vehicleList.push(newVehicle)
        // console.log(newVehicle)
    } else {
        const newVehicle: Vehicle = {
            model,
            color,
            year,
            power
        }
        vehicleList.push(newVehicle)
    }
    // console.log(vehicleList)
    res.status(201).send("Vehicle added")
})

app.get("/vehicle/search/:model", (req: Request, res: Response) => {
    const queryModel: string = req.params.model

    let vehicleFound: boolean = false
    
    for (let i: number = 0; i < vehicleList.length; i++) {
        if (vehicleList[i].model === queryModel){
            vehicleFound = true
            return res.send(vehicleList[i])
        }
    }

    if (vehicleFound === false) {
        return res.status(404).send()
    }
})

app.get("/hello", (req: Request, res: Response) => {
    let helloWorld = "Hello world"
    res.send(helloWorld)
})

app.listen(port, () => {
    console.log("Server is runing at http://localhost/:" +port)
})