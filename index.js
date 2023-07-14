const express = require("express");
const amqp = require("amqplib");
const configs = require("./configs.json")
var channel, connection;
const app = express();
const PORT = process.env.PORT || 4002;
app.use(express.json());
app.listen(PORT, () => console.log("Server running at port " + PORT));


connectQueue()  // call the connect function
 
async function connectQueue() {
    try {
        connection = await amqp.connect("amqp://localhost:5672");
        channel    = await connection.createChannel()

        configs.queues.forEach(async(config)=> {            
            await channel.assertQueue(config.name)        
            channel.consume(config.name, async(data) => {               
                let dados = JSON.parse(Buffer.from(data.content))               
                await handlers[config.name](dados);
                channel.ack(data);
            })
        });
        
        
    } catch (error) {
        console.log(error);
    }
}

const test1=(data)=>{   
    console.log("test1 " + JSON.stringify(data))
}

const test2=(data)=>{
    console.log("test2" + JSON.stringify(data))
}

const handlers = {
    "test-queue" : test1,
    "test-queue2" : test2
}