const mongoose = require('mongoose');
require('./dbConnection/dbconnect.js');
const { AttendanceModel } = require('./models/attendanceModel.js');

async function checkFields() {
    try {
        const docSandwich = await AttendanceModel.findOne({ 'years.months.dates.isSandwich': { $exists: true } });
        console.log('isSandwich exists:', !!docSandwich);

        const docSandwhich = await AttendanceModel.findOne({ 'years.months.dates.isSandwhich': { $exists: true } });
        console.log('isSandwhich exists:', !!docSandwhich);

        if (docSandwich) {
            const date = docSandwich.years[0].months[0].dates.find(d => d.isSandwich !== undefined);
            console.log('Sample with isSandwich:', JSON.stringify(date, null, 2));
        }

        if (docSandwhich) {
            const date = docSandwhich.years[0].months[0].dates.find(d => d.isSandwhich !== undefined);
            console.log('Sample with isSandwhich:', JSON.stringify(date, null, 2));
        }
    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

checkFields();