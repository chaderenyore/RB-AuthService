const amqplib = require('amqplib');
const urlModule = require('url');

class Connnection {
  constructor(url, queue, onMessage) {
    this.url = url;
    this.queue = queue;
    this.onMessage = onMessage;
  }

  getChannel() {
    return this.channel;
  }

  async consume(service) {
    const { channel, conn } = await this.createConnection();
    this.channel = channel;
    this.conn = conn;
    await channel.assertQueue(this.queue);
    console.log(`${service} Consumer listening on queue ${this.queue}`);
    const consumer = await channel.consume(this.queue, (msg) => {
      this.onMessage(msg);
    });
    return consumer;
  }

  async publish(service) {
    const { channel, conn } = await this.createConnection();
    this.channel = channel;
    this.conn = conn;
    await channel.assertQueue(this.queue);
    console.log(`${service} Publisher listening on queue ${this.queue}`);
    const publisher = await channel.publish(this.queue, (msg) => {
      this.onMessage(msg);
    });
    return publisher;
  }

  async close() {
    if (!this.channel || !this.conn) {
      throw new Error('No connection');
    }
    await this.channel.close();
    await this.conn.close();
  }

  async createConnection() {
    const { hostname } = urlModule.parse(this.url);
    const conn = await amqplib.connect(this.url, { servername: hostname });
    console.log(`AMQP connected successfully on ${hostname}`);
    const channel = await conn.createChannel();
    channel.prefetch(50);
    return { conn, channel };
  }
}

module.exports = { Connnection };
