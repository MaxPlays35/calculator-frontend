import axios from "axios"

const client = axios.create(
  {
    baseURL: "https://math.radolyn.com/api/"
  }
)

export default client