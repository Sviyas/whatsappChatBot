import { Client, List, LocalAuth, MessageMedia, Buttons } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import path from 'path';
// import getMessages from './config/getClientMsg';
import configClient from './config/index';

const configureBot = async () => {
  // ? store the session path

  try {
    const client = new Client({
      authStrategy: new LocalAuth({
        clientId: 'clien-one'
      })
    });

    // ? generate qr code if new client
    client.on('qr', qr => {
      console.log('Scan the QR Code Continue !!!');
      qrcode.generate(qr, { small: true });
    });

    client.on('authenticated', () => {
      console.log('Authenticated  ! ');
    });

    // ? client ready and send the messages into chat
    client.on('ready', async () => {
      console.log('Client is ready!');
    });

    await configClient(client);

    client.on('disconnected', () => {
      console.log('The Client Was Disconnected due to Netweork Problem ...!');
    });

    await client.initialize();
  } catch (err) {
    console.log('error idetfied on : ', err);
  }
};
export default configureBot;
