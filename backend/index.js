import "./database.js"
import app from "./app.js"

const main = () => {
    app.listen(4000)
    console.log("Server listening in port 4000")
}

main()