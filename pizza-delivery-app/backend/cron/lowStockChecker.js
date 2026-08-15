const cron = require("node-cron");
const Inventory = require("../models/Inventory");
const { sendLowStockEmail } = require("../utils/sendEmail");

// Runs every hour: checks for low-stock items and emails admin
// (throttled to once per 24h per item via lastLowStockAlertSentAt)
const startLowStockCron = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      const items = await Inventory.find();
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;

      for (const item of items) {
        if (!item.isLowStock()) continue;

        const alreadyAlertedRecently =
          item.lastLowStockAlertSentAt &&
          now - item.lastLowStockAlertSentAt.getTime() < oneDay;

        if (alreadyAlertedRecently) continue;

        try {
          await sendLowStockEmail(process.env.ADMIN_EMAIL, item.itemName, item.stock);
          item.lastLowStockAlertSentAt = new Date();
          await item.save();
          console.log(`Low stock alert sent for ${item.itemName}`);
        } catch (err) {
          console.error(`Failed to send low stock alert for ${item.itemName}:`, err.message);
        }
      }
    } catch (error) {
      console.error("Low stock cron job error:", error.message);
    }
  });

  console.log("Low stock cron job scheduled (runs hourly)");
};

module.exports = startLowStockCron;
