const amqp = require("amqplib");
const Order = require("../../../models/orderModel");
const mongoose = require("mongoose");
async function ReceiveMessageFromQueue() {
    //connect
    const connection = await amqp.connect("amqp://guest:12345@localhost");
    //create channel
    const channel = await connection.createChannel();
    //create queue
    const queueName = "ordered-queue-message";
    await channel.assertQueue(queueName, {
        durable: true,
    });

    // set prefetch
    // mỗi tác vụ sẽ xử lý cùng 1 lúc mà thôi, ko thể 1 ng mà xử lý 2 tác vụ được
    // xử lý tuần tự như nhau
    channel.prefetch(1);

    channel.consume(queueName, async (msg) => {
        const orderData = JSON.parse(msg.content.toString());
        console.log("consumer", orderData);
        const order = await Order.create({
            user: new mongoose.Types.ObjectId(orderData.user),
            ...orderData,
        });
        console.log(`[+] Saved order to MongoDB: ${JSON.stringify(order)}`);
        channel.ack(msg);
    });
}

ReceiveMessageFromQueue().catch((err) => console.error(err));
