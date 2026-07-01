import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/ai";

export const analyzeClothingImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post(
      `${API_BASE_URL}/analyze-clothing`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to analyze clothing image";

    throw new Error(message);
  }
};