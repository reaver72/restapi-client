
const axios = require("axios")

const url = "https://www.google.com"
axios({method:"get", url }).then((res) => {
    console.log(res.status)
})
