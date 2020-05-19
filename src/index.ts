const aedesPersistenceMongoDB = require('aedes-persistence-mongodb');
import { createServer } from 'net';
import * as aedesFn from 'aedes';
import { PublishPacket } from 'aedes';

const persistence = aedesPersistenceMongoDB({
  url: `mongodb://192.168.178.28:27017/mqttlog`
});
const aedes = aedesFn({ persistence });
const port = 1883;

aedes.on('subscribe', (subscriptions, client) => {
  console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
          '\x1b[0m subscribed to topics: ' + subscriptions.map(s => s.topic).join('\n'), 'from broker', aedes.id);
});

aedes.on('unsubscribe', (subscriptions, client) => {
  console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
          '\x1b[0m unsubscribed to topics: ' + subscriptions.join('\n'), 'from broker', aedes.id);
});

// fired when a client connects
aedes.on('client', (client) => {
  console.log('Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id);
});

// fired when a client disconnects
aedes.on('clientDisconnect', (client) => {
  console.log('Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.id);
});

// fired when a message is published
aedes.on('publish', async (packet, client) => {
  // tslint:disable-next-line:max-line-length
  console.log('Client \x1b[31m' + (client ? client.id : 'BROKER_' + aedes.id) + '\x1b[0m has published', packet.payload.toString(), 'on', packet.topic, 'to broker', aedes.id);
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
