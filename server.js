const { Parser } = require('json2csv');

// Endpoint to download data as CSV
app.get('/export-csv', async (req, res) => {
    try {
        const data = await PlantData.find().lean();

        const fields = ['temperature', 'humidity', 'light', 'soilMoisture', 'timestamp'];
        const opts = { fields };
        const parser = new Parser(opts);
        const csv = parser.parse(data);

        res.header('Content-Type', 'text/csv');
        res.attachment('plant_data.csv');
        res.send(csv);
    } catch (err) {
        res.status(500).send('Error exporting data as CSV');
    }
});

