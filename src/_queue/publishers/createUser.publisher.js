const { Connnection } = require('../index');
const  KEYS  = require('../../_config/keys')

const CreateUserPublisher = new Connnection(KEYS.AMQP_URI, KEYS.ACCOUNT_VERIFICATION_MAIL_QUEUE,
  async (msg) => {
    const channel = CreateUserPublisher.getChannel();
    if (msg !== null) {
      const message = msg.content.toString();
      console.info(` [x] Consumed : ${message}`);
      try {
        return channel.ack(msg);
      } catch (error) {
        console.error(`Error while sending email: ${error}`);
        return channel.ack(msg);
      }
    }

    return null;
  });

  module.exports = CreateUserPublisher;
