import axios from "axios";
const BASE_URL = "http://localhost:3000/";
export const getRequest = async () => {
  const result = await axios
    .get(BASE_URL + "getCarouselData", {
      headers: { "Content-Type": "application/json" },
    })
    .catch((error) => console.log("error :", error));
  return result.data ? result.data : [];
};
