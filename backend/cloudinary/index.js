const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
	cloud_name: 'arpityadav',
	api_key: '739381663179639',
	api_secret:'X9o0ge7vv3hlkdZ_PsKS3M6NDCo' ,
});

const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "DDX",
		allowedFormats: ["png", "jpeg", "jpg"], // supports promises as well
	},
});

module.exports={
    cloudinary,
    storage
}