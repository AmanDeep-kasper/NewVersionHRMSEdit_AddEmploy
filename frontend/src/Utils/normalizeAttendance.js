// Normalize various attendance response shapes into a consistent
// { years: [ { year, months: [ { month, dates: [...] } ] } ] } shape
function normalizeAttendance(response) {
    console.log('🔧 normalizeAttendance input:', response);

    if (!response) {
        console.warn('⚠️ Response is null/undefined');
        return null;
    }

    // If response has nested 'attendance' field (wrapped response from API)
    let att = response.attendance || response;

    console.log('🔧 After extracting attendance field:', att);

    if (!att) {
        console.warn('⚠️ Attendance data is null/undefined after extraction');
        return null;
    }

    // Already normalized format
    if (att.years) {
        console.log('✅ Already has years format');
        return att;
    }

    // Lightweight month response: { year, month, dates }
    if (att.year !== undefined && att.month !== undefined && Array.isArray(att.dates)) {
        console.log('✅ Converting lightweight format: year, month, dates');
        return { years: [{ year: att.year, months: [{ month: att.month, dates: att.dates }] }] };
    }

    // Today's attendance: { today, month, year }
    if (att.today && att.month !== undefined && att.year !== undefined) {
        console.log('✅ Converting today format');
        return { years: [{ year: att.year, months: [{ month: att.month, dates: [att.today] }] }] };
    }

    console.warn('⚠️ Could not normalize response, returning as-is:', att);
    // Fallback: return as-is if already in expected format
    return att;
}

export default normalizeAttendance;
