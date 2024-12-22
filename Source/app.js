const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();
app.use(cors());
const PORT = 3000; // Choose any port you prefer

// Connect to MongoDB
const dbURI = 'YOUR MONGODB CONNECTION STRING';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define a schema for your RFID data
const rfidSchema = new mongoose.Schema({
  tagID: Number,
  readerID: String,
  timestamp: Date
});

const RFIDData = mongoose.model('cont_info', rfidSchema);

// Middleware to parse JSON
app.use(express.json());

// Route to handle incoming RFID data
app.post('/rfid-data', async (req, res) => {
    const { tagID, readerID } = req.body;
  
    try {
      // Check if tagID is a valid number
      const parsedTagID = parseInt(tagID);
      if (isNaN(parsedTagID)) {
        return res.status(400).json({ error: 'tagID must be a valid number' });
      }
  
      const currentTimeStamp = new Date();
  
      const rfidEntry = new RFIDData({
        tagID: parsedTagID,
        readerID,
        timestamp: currentTimeStamp
      });
  
      await rfidEntry.save();
  
      res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Route to search for data using tagID
app.get('/search/:tagID', async (req, res) => {
    const tagID = parseInt(req.params.tagID); // Parse as integer
  
    try {
      const results = await RFIDData.find({ tagID }); // Search by integer tagID
  
      if (!results || results.length === 0) {
        return res.status(404).send('Tag not found');
      }
  
      let response = '';
  
      results.forEach(result => {
        response += `tagID: ${result.tagID}, readerID: ${result.readerID}, timestamp: ${result.timestamp}\n`;
      });
      console.log(response);
      res.set('Content-Type', 'text/plain');
      res.send(response);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});