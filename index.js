import readXlsxFile from 'read-excel-file/node';
import { addTimes, compareTimes, calculateTimeDifference } from './componets.js';


let workbook = [];// Contains all the entries, it does not take the entries of individual on the day they have not worked whether persent on the day or not. If employee timestamp is empty then it omits there entry.

let ID = new Map(); // contains a map linking File Number to Employee Name.

let dateSheets = new Map();// Contain entries only related to the days employee has worked.

let shiftDiff = new Map(); // contains entries of the amount of work done (in hours) by an individual on a particular day. It includes work done in all shift

let maxShift = new Map(); // contains entries of the amount of work done in single shift

function id_processing(entry) {
    let key = entry.get("File Number")
    if (!ID.has(key)) {
        ID.set(key, entry.get("Employee Name"));
    }
}

function shiftDiff_processing(entry) {
    // console.log(entry.get("File Number") +'_'+ new Date(entry.get("Time")).toISOString().split("T")[0]);
    let key = entry.get("File Number") + 'on' + new Date(entry.get("Time")).toISOString().split("T")[0];
    if (!shiftDiff.has(key)) {
        shiftDiff.set(key, `${entry.get("Timecard Hours (as Time)")}`);
        // console.log(shiftDiff.get(key));
    }
    else {
        let totalTime = addTimes(shiftDiff.get(key), entry.get("Timecard Hours (as Time)"));
        // console.log(totalTime);
        shiftDiff.set(key, `${totalTime}`);
    }
}

function maxShift_processing(entry) {
    let key = entry.get("File Number");
    if (!maxShift.has(key)) {
        maxShift.set(key, `${entry.get("Timecard Hours (as Time)")}`);
    }
    else {
        let result = compareTimes(entry.get("Timecard Hours (as Time)"), maxShift.get(key));
        let maxTime = (result ? entry.get("Timecard Hours (as Time)") : maxShift.get(key));
        // console.log(`${key} = ${maxTime}`);
        maxShift.set(key, `${maxTime}`);
    }
}

readXlsxFile('Assignment_Timecard.xlsx')
    .then((rows) => {
        rows.slice(1).forEach(row => {
            // console.log(row[0]);
            if (row[2] != null && row[3] != null) {
                workbook.push(new Map([
                    ['Position ID', row[0]],
                    ['Position Status', row[1]],
                    ['Time', row[2]],
                    ['Time Out', row[3]],
                    ['Timecard Hours (as Time)', row[4]],
                    ['Pay Cycle Start Date', row[5]],
                    ['Pay Cycle End Date', row[6]],
                    ['Employee Name', row[7]],
                    ['File Number', row[8]],
                ]));
            }
        });
        // console.log(workbook[0]);
        // console.log(typeof workbook[0].get("Time"));
        console.log(new Date(workbook[0].get("Time")));
        // myDate.toISOString().split("T")[0]

        workbook.forEach(entry => {
            id_processing(entry); // here all file number are linked to Employee Name.
            shiftDiff_processing(entry); //here we process all the work done in a single day.
            maxShift_processing(entry);
        });

        //  b) who have less than 10 hours of time between shifts but greater than 1 hour
        console.log("\n\nb) who have less than 10 hours of time between shifts but greater than 1 hour\n")
        for (const entr of shiftDiff.entries()) {
            // console.log(entr[1]);
            if (!compareTimes(entr[1], '10:00') && compareTimes(entr[1], '1:00')) {
                console.log(`${entr[0].slice(0, entr[0].indexOf("on"))} : ${entr[1]}`);
            }
        }


        //  c) Who has worked for more than 14 hours in a single shift
        console.log("\n\nc) Who has worked for more than 14 hours in a single shift\n")
        for (const entr of maxShift.entries()) {
            // console.log(entr[1]);
            if (compareTimes(entr[1], '14:00')) {
                console.log(`${entr[0]} : ${ID.get(entr[0])}`);
            }
        }
    })
