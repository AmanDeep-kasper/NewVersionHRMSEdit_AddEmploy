#!/usr/bin/env node
/**
 * server/scripts/attendance_totals_check.js
 * Usage: node attendance_totals_check.js path/to/attendance.json [period]
 * period: today|weekly|monthly|yearly (default monthly)
 *
 * Load an attendance JSON file and compute gross/net/break/expected totals
 * for a given period to validate the aggregation logic.
 */

const fs = require('fs');
const path = require('path');
const Moment = require('moment');

if (process.argv.length < 3) {
    console.error('Usage: node attendance_totals_check.js path/to/attendance.json [period]');
    console.error('  period: today|weekly|monthly|yearly (default: monthly)');
    process.exit(1);
}

const filePath = path.resolve(process.argv[2]);
const period = process.argv[3] || 'monthly';

if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(2);
}

let data;
try {
    const content = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(content);
    console.log('✓ Loaded attendance JSON');
} catch (err) {
    console.error('Failed to parse JSON:', err.message);
    process.exit(3);
}

// Helper copied from server logic
const toMinutes = (raw) => {
    if (raw === null || typeof raw === 'undefined') return 0;
    let n = Number(raw);
    if (!isFinite(n) || Number.isNaN(n)) return 0;
    if (n <= 24 * 60 * 2) return Math.round(n);
    if (n > 24 * 60 * 2 && n <= 24 * 60 * 60 * 2) return Math.round(n / 60);
    if (n > 24 * 60 * 60 * 2) return Math.round(n / 1000 / 60);
    return Math.round(n);
};

const computeTotalsForAttendance = (attendance, period) => {
    const now = Moment();
    let start = null, end = null;

    if (period === 'today') {
        start = now.clone().startOf('day');
        end = now.clone().endOf('day');
    } else if (period === 'weekly') {
        start = now.clone().startOf('isoWeek').startOf('day');
        end = now.clone().endOf('isoWeek').endOf('day');
    } else if (period === 'monthly') {
        start = now.clone().startOf('month').startOf('day');
        end = now.clone().endOf('month').endOf('day');
    } else if (period === 'yearly') {
        start = now.clone().startOf('year').startOf('day');
        end = now.clone().endOf('year').endOf('day');
    } else {
        start = now.clone().startOf('month').startOf('day');
        end = now.clone().endOf('month').endOf('day');
    }

    let gross = 0, net = 0, brk = 0, expected = 0, workDays = 0;

    if (!attendance || !Array.isArray(attendance.years)) {
        return { gross, net, brk, expected, workDays, grossHours: '0.00', netHours: '0.00', expectedHours: '0.00' };
    }

    const year = start.year();
    const yearObj = attendance.years.find(y => y.year === year);
    if (!yearObj) {
        return { gross, net, brk, expected, workDays, grossHours: '0.00', netHours: '0.00', expectedHours: '0.00' };
    }

    for (const m of (yearObj.months || [])) {
        for (const d of (m.dates || [])) {
            // build dateMoment
            let dateMoment = null;
            if (typeof d.date === 'string' && d.date.includes('-')) {
                dateMoment = Moment(d.date, 'YYYY-MM-DD', true);
            } else {
                const monthNum = String(m.month).padStart(2, '0');
                const dayNum = String(d.date).padStart(2, '0');
                dateMoment = Moment(`${year}-${monthNum}-${dayNum}`, 'YYYY-MM-DD', true);
            }

            if (!dateMoment || !dateMoment.isValid()) continue;
            if (!dateMoment.isBetween(start, end, null, '[]')) continue;

            const dGross = toMinutes(d.TotalLogin ?? d.totalLogin ?? 0);
            const dBreak = toMinutes(d.totalBrake ?? d.brake ?? 0);
            const dNet = toMinutes(d.totalLogAfterBreak ?? ((d.TotalLogin ?? d.totalLogin ?? 0) - (d.totalBrake ?? d.brake ?? 0)));

            gross += dGross;
            brk += dBreak;
            net += dNet;

            if (!['WO', 'LV', 'HD'].includes(d.status)) {
                workDays += 1;
                // expected from shift if present, else default 8h -> 480 minutes
                let dailyExpected = 8 * 60;
                const shiftObj = (d.shifts && Array.isArray(d.shifts) && d.shifts[0]) ? d.shifts[0] : (d.shift || null);

                if (shiftObj && shiftObj.startTime && shiftObj.endTime) {
                    const parse = (t) => {
                        const parts = String(t).split(':').map(Number);
                        if (!parts.length) return null;
                        const hh = parts[0] || 0;
                        const mm = parts[1] || 0;
                        return hh * 60 + mm;
                    };
                    const s = parse(shiftObj.startTime);
                    const e = parse(shiftObj.endTime);
                    if (typeof s === 'number' && typeof e === 'number') {
                        let dur = e - s;
                        if (dur <= 0) dur += 24 * 60;
                        dailyExpected = Math.max(0, dur - 60); // subtract 1 hour break
                    }
                }
                expected += dailyExpected;
            }
        }
    }

    return {
        gross,
        net,
        brk,
        expected,
        workDays,
        grossHours: (gross / 60).toFixed(2),
        netHours: (net / 60).toFixed(2),
        expectedHours: (expected / 60).toFixed(2),
    };
};

const resTotals = computeTotalsForAttendance(data, period);

console.log('\n' + '='.repeat(60));
console.log(`Computed totals for period: ${period.toUpperCase()}`);
console.log('='.repeat(60));
console.log(`Date Range: ${Moment().startOf(period === 'weekly' ? 'isoWeek' : period).format('YYYY-MM-DD')} to ${Moment().endOf(period === 'weekly' ? 'isoWeek' : period).format('YYYY-MM-DD')}`);
console.log(`Working Days: ${resTotals.workDays}`);
console.log('-'.repeat(60));
console.log(`Gross Login:   ${resTotals.gross} minutes = ${resTotals.grossHours} hours`);
console.log(`Break:         ${resTotals.brk} minutes = ${(resTotals.brk / 60).toFixed(2)} hours`);
console.log(`Net Working:   ${resTotals.net} minutes = ${resTotals.netHours} hours`);
console.log(`Expected:      ${resTotals.expected} minutes = ${resTotals.expectedHours} hours`);
console.log('='.repeat(60));
console.log('Full JSON:');
console.log(JSON.stringify(resTotals, null, 2));
console.log('='.repeat(60));
