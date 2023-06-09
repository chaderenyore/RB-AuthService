const { Connnection } = require("../../index");
const KEYS = require("../../_config/keys");

exports.publishToVerifyUserQueue = async (id, data) => {
  try {
    let VerifyUserPublisher = new Connnection(
      KEYS.AMQP_URI,
      KEYS.VERIFY_USER_QUEUE,
      async (msg) => {
        console.log(`${KEYS.VERIFY_USER_QUEUE} publishing...`);
      }
    );
    const channel = await VerifyUserPublisher.getChannel();
    await VerifyUserPublisher.publish(id, data);
    process.on('exit', (code) => {
      channel.close();
      console.log(`Closing ${channel} channel`);
   });
  } catch (error) {
    console.error(error);
  }
};
