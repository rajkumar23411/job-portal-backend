import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { promisify } from "util";

const unlinkAsync = promisify(fs.unlink);

cloudinary.config({
    cloud_name: "dkukx5byz",
    api_key: "377951573467452",
    api_secret: "9y6Vx-Ahkmvs2LM8C_Dto7hJ4aM",
});

const deleteLocalFile = async (localFilePath) => {
    if (!localFilePath) {
        throw new Error("Please provide the local file path");
    }

    try {
        await unlinkAsync(localFilePath);
    } catch (err) {
        console.error("Error unlinking file:", err);
        throw new Error("Problem while unlinking file");
    }
};

const cloudinaryServices = {
    async upload(localFilePath) {
        try {
            if (!localFilePath) {
                throw new Error("File path is required to upload");
            }

            const res = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto",
            });
            console.log(res);
            if (!res) {
                throw new Error("Could not upload file to cloudinary");
            }
            return res;
        } catch (error) {
            console.log("Error while uploading file", error);
            throw new Error(error.message);
        } finally {
            await deleteLocalFile(localFilePath);
        }
    },
    async destroy(id) {
        try {
            const res = await cloudinary.uploader.destroy(id);

            if (!res) {
                throw new Error("Could not delete file from cloudinary");
            }
            return res;
        } catch (error) {
            throw new Error(error.message);
        }
    },
};

export default cloudinaryServices;
