import amqp from 'amqplib';
import logger from '../../utils/logging.js';

const ProducerService = {
  sendMessage: async (queue, message) => {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
      const channel = await connection.createChannel();
      await channel.assertQueue(queue, {
        durable: true,
      });

      await channel.sendToQueue(queue, Buffer.from(message));

      setTimeout(() => {
        connection.close();
      }, 1000);
    } catch (error) {
      logger.error('Error sending message:', error);
    }
  },
};

export default ProducerService;
