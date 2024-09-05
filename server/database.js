const {Pool} = require("pg")
const pool = new Pool(
    {
        user: "postgres",
        password: "290709Sw",
        host: "localhost",
        port: 5432
    }
)

pool.query("CREATE DATABASE raretrades;").then((response) => {
    console.log("Database created")
    console.log(response)
}).catch((err) => {
    console.log(err)
})

module.exports = pool;
