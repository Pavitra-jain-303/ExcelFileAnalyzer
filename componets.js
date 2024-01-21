export function compareTimes(time1, time2) {
    // Parse time strings into hours and minutes
    let [hours1, minutes1] = time1.split(':').map(Number);
    let [hours2, minutes2] = time2.split(':').map(Number);

    // Convert times to total minutes
    let totalMinutes1 = hours1 * 60 + minutes1;
    let totalMinutes2 = hours2 * 60 + minutes2;

    // Compare the total minutes
    if (totalMinutes1 > totalMinutes2) {
        return true; // time1 is more
    } else {
        return false;
    }
}

export function addTimes(time1, time2) {
    // Parse time strings into hours and minutes
    let [hours1, minutes1] = time1.split(':').map(Number);
    let [hours2, minutes2] = time2.split(':').map(Number);

    // Calculate the total duration in minutes
    let totalMinutes = (hours1 * 60 + minutes1) + (hours2 * 60 + minutes2);

    // Calculate hours and minutes from the total
    let totalHours = Math.floor(totalMinutes / 60);
    let remainingMinutes = totalMinutes % 60;

    // Format the result as HH:mm
    return `${totalHours}:${remainingMinutes}`;
}

export function calculateTimeDifference(dateString1, dateString2) {
    const dateTimeObject1 = new Date(dateString1);
    const dateTimeObject2 = new Date(dateString2);

    const timeDifferenceMilliseconds = dateTimeObject2 - dateTimeObject1;
    const timeDifference = new Date(timeDifferenceMilliseconds);

    const hours = timeDifference.getUTCHours();
    const minutes = timeDifference.getUTCMinutes();
    const seconds = timeDifference.getUTCSeconds();

    const formattedTimeDifference = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return formattedTimeDifference;
}

export function areDatesConsecutive(datesSet) {
    // Convert the Set values to an array and then to Date objects
    const datesArray = Array.from(datesSet).map(dateString => new Date(dateString));

    // Sort the Date objects
    datesArray.sort((a, b) => a - b);

    // Check if there are 7 consecutive days
    for (let i = 0; i < datesArray.length - 6; i++) {
        const currentDate = datesArray[i];
        const seventhDay = new Date(currentDate);
        seventhDay.setDate(currentDate.getDate() + 6);

        if (seventhDay.toISOString().split("T")[0] === datesArray[i + 6].toISOString().split("T")[0]) {
            return true;  // Found 7 consecutive days
        }
    }

    return false;  // No consecutive 7 days found
}