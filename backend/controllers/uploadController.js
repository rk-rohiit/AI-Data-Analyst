export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            console.log("File required but not provided");
            return res.status(400).json({
                success: false,
                message: "No File uploaded",
            });
        }
        console.log("File uploaded successfully:", req.file.path);
        res.status(200).json({
            success: true,
            message: "File Uploaded Sucessfully",
            filePath: req.file.path
        })
    } catch (error) {
        console.error("Error during file upload:", error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};