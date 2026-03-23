export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No File uploaded"
            });
        }
        res.status(200).json({
            success: true,
            message: "File Uploaded Sucessfully",
            filePath: req.file.path
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};