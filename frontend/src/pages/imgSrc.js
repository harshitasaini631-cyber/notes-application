// Works whether the DB stores "abc.jpg", "uploads/abc.jpg" or "/uploads/abc.jpg"
export function imgSrc(image) {
    if (!image) return "";
    if (/^(https?:|blob:|data:)/.test(image)) return image;
    if (image.startsWith("/")) return image;
    if (image.startsWith("uploads/")) return "/" + image;
    return "/uploads/" + image;
}