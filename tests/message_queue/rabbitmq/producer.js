const amqp = require("amqplib");
const messages = "hello";

const runProducer = async () => {
    try {
        const connection = await amqp.connect("amqp://guest:12345@localhost");
        const channel = await connection.createChannel();

        const queueName = "test-topic";
        await channel.assertQueue(queueName, {
            durable: true,
        });

        //send message to consumer channel
        channel.sendToQueue(queueName, Buffer.from(messages));
        console.log("message sent:", messages);
        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.error(error);
    }
};

runProducer()
    .then((rs) => console.log(rs))
    .catch(console.error);
