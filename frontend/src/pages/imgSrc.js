import { API_URL } from "../api";

// Handles different image paths stored in MongoDB
export function imgSrc(image) {
    if (!image) return "";

    if (/^(https?:|blob:|data:)/.test(image)) {
        return image;
    }

    if (image.startsWith("/")) {
        return API_URL + image;
    }

    if (image.startsWith("uploads/")) {
        return API_URL + "/" + image;
    }

    return API_URL + "/uploads/" + image;
}