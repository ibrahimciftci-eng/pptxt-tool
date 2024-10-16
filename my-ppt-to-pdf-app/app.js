const express = require('express');
const multer = require('multer');
const path = require('path');
const pptxToPdf = require('pptx-to-pdf');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/upload', upload.single('file'), async (req, res) => {
    const filePath = req.file.path;
    const outputFilePath = `uploads/${req.file.filename}.pdf`;

    try {
        await pptxToPdf.convert(filePath, outputFilePath);
        res.download(outputFilePath, (err) => {
            if (err) throw err;
            fs.unlinkSync(filePath);  // PPTX dosyasını sil
            fs.unlinkSync(outputFilePath);  // PDF dosyasını sil
        });
    } catch (error) {
        res.status(500).send('Dosya dönüştürme başarısız.');
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor.`);
});
