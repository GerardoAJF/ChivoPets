import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

import pet_router from "./routes/pet_route.js"
import user_router from "./routes/user_route.js"
import vet_router from "./routes/vet_route.js"
import service_router from "./routes/service_route.js"
import appointment_router from "./routes/appointment_route.js"

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use("/api/pet", pet_router)
app.use("/api/user", user_router)
app.use("/api/vet", vet_router)
app.use("/api/service", service_router)
app.use("/api/appointment", appointment_router)

export default app