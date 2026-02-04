const cron = require('node-cron');
const dayjs = require('dayjs');
const { LeaveApplication } = require('../models/leaveModel');
const { TotalLeave } = require('../models/totalLeave');

let jobRegistered = false;

const task = cron.schedule(
  '33 12 * * *',
  async () => {
    console.log('[AUTO‑REJECT] Cron tick at', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));

    try {
      const tomorrowEnd = dayjs().add(1, 'day').endOf('day').toDate();

      const pending = await LeaveApplication.find({
        Status: 1, 
        FromDate: { $lte: tomorrowEnd },
      });

      if (!pending.length) {
        console.log('[AUTO‑REJECT] No pending leaves to reject.');
        return;
      }

      for (const leave of pending) {
        const totalLeave = await TotalLeave.findOne({ empID: leave.employee });

        const qty = leave.leaveDuration === 'Half Day' ? 0.5 : leave.dateRange.length;

        if (totalLeave) {
          switch (leave.Leavetype) {
            case 'Sick Leave':
              totalLeave.sickLeave += qty;
              break;
            case 'Casual Leave':
              totalLeave.casualLeave += qty;
              break;
            case 'Paid Leave':
              totalLeave.paidLeave += qty;
              break;
            case 'Paternity Leave':
              totalLeave.paternityLeave += qty;
              break;
            case 'Maternity Leave':
              totalLeave.maternityLeave += qty;
              break;
          }
          await totalLeave.save();
        }

        leave.Status = 3;
        leave.reasonOfRejection =
          'Your leave request was not approved within the designated time frame and has been automatically rejected by the system. Kindly coordinate with your reporting manager for further clarification.';
        leave.updatedBy = null;

        await leave.save();
      }

      console.log(`[AUTO‑REJECT] ${pending.length} leave(s) auto-rejected by system.`);
    } catch (err) {
      console.error('[AUTO‑REJECT] job failed:', err.message);
    }
  },
  {
    timezone: 'Asia/Kolkata',
  }
);

if (task) {
  jobRegistered = true;
}
console.log('[AUTO‑REJECT] Cron job registered:', jobRegistered);
