const amqp = require("amqplib");

const runConsumer = async () => {
    try {
        const connection = await amqp.connect("amqp://guest:12345@localhost");
        const channel = await connection.createChannel();

        const queueName = "test-topic";
        await channel.assertQueue(queueName, {
            durable: true,
        });

        //send message to consumer channel
        channel.consume(
            queueName,
            (message) => {
                console.log(`Received ${message.content.toString()}`);
            },
            //noAck mặc định là false nếu như ko để tk true thì dữ liệu đã được xử lý rồi sẽ ko được gửi lại
            {
                noAck: true,
            }
        );
        // console.log("message sent:", messages);
    } catch (error) {
        console.error(error);
    }
};

runConsumer().catch(console.error);
