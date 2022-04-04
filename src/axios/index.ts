import axios from "axios"

const client = axios.create(
  {
    // baseURL: "https://math.radolyn.com/api/"
    baseURL: "http://localhost:10000/"
  }
)

export default client