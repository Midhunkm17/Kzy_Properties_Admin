import axios from "axios";
import { BASEURL } from "../baseUrl";

//get property
export const getProperties = async ({ page, limit }) => {
  const response = await axios.get(
    `${BASEURL}/api/property/listallproperties?page=${page}&limit=${limit}`
  );
  return response.data;
};

//update property
export const updateProperty = async (id, propertyData) => {
  const response = await axios.put(
    `${BASEURL}/api/property/updateproperty?id=${id}`,
    propertyData
  );
  return response.data;
};

//edit property images and thumbnail
export const updatePropertyImages = async (id, imageArray, thumbnailFile) => {
  const formData = new FormData();

  for (const item of imageArray) {
    if (item instanceof File) {
      formData.append("images", item);
    } else if (typeof item === "string") {
      // Convert existing image URL to Blob and append as File-like
      const response = await fetch(item);
      const blob = await response.blob();
      const filename = item.split("/").pop(); // Get filename from URL
      const file = new File([blob], filename || "image.jpg", {
        type: blob.type,
      });
      formData.append("images", file);
    }
  }

  if (thumbnailFile instanceof File || typeof thumbnailFile === "string") {
    formData.append("thumbnail", thumbnailFile);
  }

  const response = await axios.put(
    `${BASEURL}/api/property/property-img-update?id=${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

//add property
export const addProperty = async (propertyData) => {

  // Optional: Debug
  for (let [key, value] of propertyData.entries()) {
    console.log(key, value);
  }

  const response = await axios.post(
    `${BASEURL}/api/property/addproperty`,
    propertyData,
    {
      headers: {
        "Content-Type": "multipart/form-data"      },
    }
  );
  return response.data;
};
