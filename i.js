import { addTimes, compareTimes, readExcelFile } from "./componets.js";


let dateSheets = new Map();// Contain entries only related to the days employee has worked.

let daySheets = new Map(); // contains entries of the amount of work done (in hours) by an individual on a particular day. It includes work done in all shift

let maxShiftSheets = new Map(); // contains entries of the amount of work done in single shift

function daySheets_processing(entry) {
    // console.log(entry.get("File Number") +'_'+ new Date(entry.get("Time")).toISOString().split("T")[0]);
    let key = entry.get("File Number") + 'on' + new Date(entry.get("Time")).toISOString().split("T")[0];
    if (!daySheets.has(key)) {
        daySheets.set(`${key}`, `${entry.get("Timecard Hours (as Time)")}`);
        // console.log(daySheets.get(key));
    }
    else {
        let totalTime = addTimes(daySheets.get(key), entry.get("Timecard Hours (as Time)"));
        // console.log(totalTime);
        daySheets.set(`${key}`, `${totalTime}`);
    }
}

function maxShiftSheets_processing(entry) {
    let key = entry.get("File Number");
    if (!maxShiftSheets.has(key)) {
        maxShiftSheets.set(`${key}`, `${entry.get("Timecard Hours (as Time)")}`);
        // console.log(daySheets.get(key));
    }
    else {
        let result = compareTimes(entry.get("Timecard Hours (as Time)"), maxShiftSheets.get(key));
        let maxTime = (result ? entry.get("Timecard Hours (as Time)") : maxShiftSheets.get(key));
        // console.log(`${key} = ${maxTime}`);
        maxShiftSheets.set(`${key}`, `${maxTime}`);
    }
}

readExcelFile()
    .then(workbook => {
        // console.log(workbook[0]);
        // Do more with the workbook array as needed
        workbook.forEach(entry => {
            daySheets_processing(entry); //here we process all the work done in a single day.
            maxShiftSheets_processing(entry);
        });

        for (const entr of maxShiftSheets.entries()) {
            console.log(entr);
        }
    })
    .catch(error => {
        // Handle errors here
        console.error('Error processing the workbook:', error);
    });
