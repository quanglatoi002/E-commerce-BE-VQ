const amqp = require("amqplib");
const messages = "hello";

// const log = console.log;
// console.log = function () {
//     log.apply(console, [new Date()].concat(arguments));
// };

const runProducer = async () => {
    try {
        const connection = await amqp.connect("amqp://guest:12345@localhost");
        const channel = await connection.createChannel();

        //exchange success 1
        const notificationExchange = "notificationEx";
        //queue / handle success and false
        const notifiQueue = "notificationQueueProcess";
        //exchange false 2 DLX
        const notificationExchangeDLX = "notificationExDLX";
        const notificationRoutingDLX = "notificationRoutingKeyDLX";

        // create exchange
        //các notifi sẽ ko bị mất khi đóng kết nối
        await channel.assertExchange(notificationExchange, "direct", {
            durable: true,
        });

        const queueResult = await channel.assertQueue(notifiQueue, {
            //cho phép các consumer kết nối khác truy cập vào queue
            exclusive: false,
            // nếu mà các notifiQueue bị lỗi sẽ bị chuyển tới notificationExchangeDLX với cái key notificationRoutingDLX
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingDLX,
        });

        // bindQueue

        await channel.bindQueue(queueResult.queue, notificationExchange);

        // send message
        const msg = "a new product";
        console.log(`producer msg::`, msg);
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: "10000",
        });

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
