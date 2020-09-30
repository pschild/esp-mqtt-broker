// const mongodb = require('mongodb');
import { createServer } from 'net';
import * as aedesFn from 'aedes';
import { PublishPacket } from 'aedes';
import { format } from 'date-fns';

// const mongoUri = `mongodb://192.168.178.28:27017/`;

const aedes = aedesFn();
const port = 1883;

function log(logMessage: string) {
  console.log(`${format(new Date(), 'dd.MM.yyyy HH:mm:ss.SSS')}: ${logMessage}`);
}

aedes.on('subscribe', (subscriptions, client) => {
  // tslint:disable-next-line:max-line-length
  log(`MQTT client \x1b[32m${client ? client.id : client}\x1b[0m subscribed to topics: ${subscriptions.map(s => s.topic).join(',')} from broker ${aedes.id}`);
});

aedes.on('unsubscribe', (subscriptions, client) => {
  // tslint:disable-next-line:max-line-length
  log(`MQTT client \x1b[32m${client ? client.id : client}\x1b[0m unsubscribed to topics: ${subscriptions.join(',')} from broker ${aedes.id}`);
});

// fired when a client connects
aedes.on('client', (client) => {
  log(`Client Connected: \x1b[33m${client ? client.id : client}\x1b[0m to broker ${aedes.id}`);
});

// fired when a client disconnects
aedes.on('clientDisconnect', (client) => {
  log(`Client Disconnected: \x1b[31m${client ? client.id : client}\x1b[0m to broker ${aedes.id}`);
});

// fired when a message is published
aedes.on('publish', async (packet, client) => {
  // tslint:disable-next-line:max-line-length
  log(`Client \x1b[31m${client ? client.id : 'BROKER_' + aedes.id}\x1b[0m has published ${packet.payload.toString()} on ${packet.topic} to broker ${aedes.id}`);

  /*if (packet.topic.search(/heartbeat/) < 0) {
    mongodb.MongoClient.connect(mongoUri, (error, database) => {
      if (error != null) {
        throw error;
      }

      const db = database.db('mydb');

      const collection = db.collection(`mycoll`);
      collection.createIndex({ topic: 1 });

      const messageObject = {
        topic: packet.topic,
        datetime: new Date(),
        message: packet.payload.toString()
      };

      collection.insertOne(messageObject, (error, result) => {
        if (error != null) {
          console.log('ERROR inserting to mongoDb: ' + error);
        }
      });
    });
  }*/
});

const server = createServer(aedes.handle);
server.listen(port, () => {
  console.log('Aedes listening on port:', port);
  const packet: PublishPacket = {
    cmd: `publish`,
    qos: 2,
    topic: `aedes/hello`,
    payload: Buffer.from(`I am broker # ${aedes.id}`),
    retain: false,
    dup: true
  };
  aedes.publish(packet, (err) => console.log(err));
});
