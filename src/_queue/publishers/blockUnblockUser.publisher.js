const { Connnection } = require("../index");
const KEYS = require("../../_config/keys");

exports.publishToBlockUnblockUserQueue = async (data) => {
  try {
    let BlockUnblockUserPublisher = new Connnection(
      KEYS.AMQP_URI,
      KEYS.BLOCK_UNBLOCK_USER_QUEUE,
      async (msg) => {
        console.log(`${KEYS.BLOCK_UNBLOCK_USER_QUEUE} publishing...`);
      }
    );
    const channel = await BlockUnblockUserPublisher.getChannel();
    await BlockUnblockUserPublisher.publish("Auth", data);
    process.on('exit', (code) => {
      channel.close();
      console.log(`Closing ${channel} channel`);
   });
  } catch (error) {
    console.error(error);
  }
};
