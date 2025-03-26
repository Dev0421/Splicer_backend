const db = require('../config/db'); // Ensure this is your MySQL connection
const moment = require('moment');  // For managing datetime
const path = require('path');
const fs = require('fs');

// UPLOAD FILE
exports.uploadFile = async (req, res) => {
    try {
        const userId = req.userId; // Retrieve userId from the request object
        const enclosure_id = req.body.enclosure_id; // Retrieve enclosure_id from request body
        const file = req.file;

        console.log(enclosure_id, userId);

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileData = {
            name: file.originalname,
            url: path.join('/uploads', file.filename),
            size: file.size,
            enclosure_id,
            user_id: userId
        };

        // Insert file into MySQL
        db.query('INSERT INTO files (name, url, size, enclosure_id, user_id) VALUES (?, ?, ?, ?, ?)', 
            [fileData.name, fileData.url, fileData.size, fileData.enclosure_id, fileData.user_id], 
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Failed to insert file into the database' });
                }

                res.status(201).json({ 
                    message: 'File uploaded successfully', 
                    userId, 
                    fileName: file.filename, 
                    fileId: result.insertId 
                });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// GET FILES BY ENCLOSURE ID
exports.getNamesFile = async (req, res) => {
    console.log("Fetching files...");
    try {
        const userId = req.userId; // Retrieve userId from request object
        const enclosure_id = req.body.enclosure_id; // Retrieve enclosure_id from request body
        console.log(`Fetching files for enclosure_id: ${enclosure_id}, userId: ${userId}`);

        db.query('SELECT * FROM files WHERE enclosure_id = ?', [enclosure_id], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'No files found for the given enclosure ID' });
            }

            res.status(200).json({ message: 'Files retrieved successfully', files: results });
        });

    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// DOWNLOAD FILE
exports.downloadFile = async (req, res) => {
    try {
        const fileId = req.params.id;
        if (!fileId) {
            return res.status(400).send('File ID is required');
        }
        console.log(fileId);

        // Fetch file details from MySQL
        db.query('SELECT * FROM files WHERE id = ?', [fileId], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Internal server error');
            }
            if (results.length === 0) {
                return res.status(404).send('File not found');
            }

            const fileDetails = results[0];

            // Correct the file path
            const filePath = path.join(__dirname, '..', fileDetails.url);
            res.download(filePath, (err) => {
                if (err) {
                    console.error('Error downloading file:', err.message);
                    res.status(500).send('Error downloading file');
                }
            });
        });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal server error');
    }
};

// DELETE FILE
exports.deleteFile = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch file metadata from MySQL
        db.query('SELECT * FROM files WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'File not found' });
            }

            const file = results[0];
            const filePath = path.join(__dirname, '..', file.url);

            // Delete file from storage
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            // Delete file record from database
            db.query('DELETE FROM files WHERE id = ?', [id], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Failed to delete file from database' });
                }
                res.status(200).json({ message: 'File deleted successfully' });
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
