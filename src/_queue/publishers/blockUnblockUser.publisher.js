const { Connnection } = require("../../index");
const KEYS = require("../../_config/keys");

exports.publishToBlockUnblockUserQueue = async (id, data) => {
  try {
    let BlockUnblockUserPublisher = new Connnection(
      KEYS.AMQP_URI,
      KEYS.IN_APP_NOTIFICATION_QUEUE,
      async (msg) => {
        console.log(`${KEYS.IN_APP_NOTIFICATION_QUEUE} publishing...`);
      }
    );
    const channel = await BlockUnblockUserPublisher.getChannel();
    await BlockUnblockUserPublisher.publish(id, data);
    process.on('exit', (code) => {
      channel.close();
      console.log(`Closing ${channel} channel`);
   });
  } catch (error) {
    console.error(error);
  }
};
