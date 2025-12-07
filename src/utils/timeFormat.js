export const formatTime = (timeString, use24Hour = true) => {
    if (!timeString || use24Hour) {
        return timeString;
    }

    try {
        const parts = timeString.split(' - ');
        if (parts.length !== 2) return timeString;

        const convertTo12Hour = (time24) => {
            const [hours, minutes] = time24.split(':').map(Number);
            if (isNaN(hours) || isNaN(minutes)) return time24;

            const period = hours >= 12 ? 'PM' : 'AM';
            const hours12 = hours % 12 || 12;
            return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
        };

        const startTime = convertTo12Hour(parts[0]);
        const endTime = convertTo12Hour(parts[1]);

        return `${startTime} - ${endTime}`;
    } catch (error) {
        console.error('Error formatting time:', error);
        return timeString;
    }
};
