import {
  Connection, ReceiverEvents,
} from "rhea-promise";

const __pdApp = {
  type: "app",
  app: "amqp",
  propDefinitions: {
    queueName: {
      type: "string",
      label: "Queue Name",
      description: "The name of the queue to send the message to.",
    },
  },
  methods: {
    async openConnection({
      host, ...args
    } = {}) {
      const connection = new Connection({
        transport: "tls",
        reconnect: false,
        host,
        hostname: host,
        ...args,
      });
      return connection.open();
    },
    async createSender({
      connection, ...args
    }) {
      return connection.createAwaitableSender(args);
    },
    async sendMessage({
      sender, ...args
    }) {
      return sender.send(args);
    },
    async createReceiver({
      connection, ...args
    } = {}) {
      return connection.createReceiver(args);
    },
    async onMessageReceiver(receiver) {
      const messages = [];
      return new Promise((resolve, reject) => {
        receiver.on(ReceiverEvents.message, ({ message }) => {
          console.log("Receiver message", message);
          messages.push(message);
        });

        receiver.on(ReceiverEvents.receiverError, (context) => {
          return reject(context.receiver?.error ?? "Unknown Message Error");
        });

        receiver.on(ReceiverEvents.receiverClose, () => {
          console.log("Receiver closed");
          return resolve(messages);
        });

        setTimeout(() => {
          console.log("Receiver timeout");
          return resolve(messages);
        }, 12000);
      });
    },
    // Where entity can be a connection, receiver, or sender object.
    async close(entity) {
      return entity.close();
    },
  },
};

export default __pdApp;
import { __pdBindAuth as __pdBind } from "../_platform-shim.mjs";
__pdBind(__pdApp, "amqp");
