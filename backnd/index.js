const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/excel-importer', {
 // useNewUrlParser: true,
  //useUnifiedTopology: true,
});

const upload = multer({ dest: 'uploads/' });

const DataSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  date: String,
  verified: String,
});
const DataModel = mongoose.model('Data', DataSchema);

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetNames = workbook.SheetNames;
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);

    const errors = [];
    const validData = [];
    jsonData.forEach((row, index) => {
      if (!row.Name || !row.Amount || !row.Date || !row.Verified) {
        errors.push({ row: index + 2, message: 'Missing required fields' });
      } else {
        validData.push({
          name: row.Name,
          amount: row.Amount,
          date: row.Date,
          verified: row.Verified,
        });
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    await DataModel.insertMany(validData);
    res.json({ message: 'Data imported successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error processing file' });
  }

  fs.unlinkSync(req.file.path);
});

app.listen(5000, () => console.log('Server running on port 5000'));