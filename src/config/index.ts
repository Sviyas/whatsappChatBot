import WAWebJS, { Client, MessageMedia } from 'whatsapp-web.js';
import fs from 'fs';
import path from 'path';

const configClient = async (client: Client) => {
  // ? listen client request

  try {
    await client.on('message', async (message: WAWebJS.Message) => {
      const userMsg = /^h/i;

      if (userMsg.test(message.body)) {
        await message.react('😍');
        await message.reply(
          ` Hello! Mr/Ms ${
            (
              await message.getContact()
            ).pushname
          } ✨\nWelcome to our messaging service.😊\nWe're glad to have you here.\nFeel free to send a message and start a conversation.\nIf you have any questions or need assistance,\nplease let us know.🙌\nThank you for choosing our platform! 👍`
        );
      } else if (message.body || message.hasMedia || message.location) {
        //   await message.reply(`I could not find an answer to your query. Type *HI* to start again.`);

        const { body, id, from } = message;

        const pushname = (await message.getContact()).pushname;

        const about = (await message.getContact()).getAbout();

        // ? user information whatsapp chat
        const chatInfo = {
          naeme: pushname,
          chat: body,
          userId: id._serialized,
          about: await about,
          from: from
        };

        console.log(`send message the person info is : ${pushname} and message is `, chatInfo);

        // await message.react('👍');

        if (!message.location && (message.type === 'sticker' || message.type === 'image')) {
          // ? recieve only sticker or images

          // ? download media and type
          const downloadMedia = (await message.downloadMedia()).data;

          const decodeData = Buffer.from(downloadMedia, 'base64');

          const mediaType = await (await message.downloadMedia())?.mimetype.split('/')[1];
          console.log('media type :: ', mediaType);

          const writeFile = await path.resolve(__dirname, `../../garbage/stickers/${message.id.id}.${mediaType}`);

          console.log('full path : ', writeFile);

          // ? store to the media
          await fs.writeFile(writeFile, decodeData, err => {
            if (!err) {
              console.log('File Saved Successfully ....!  ');
            }
          });

          await client.sendMessage(from, 'wait for a moment ... !');

          await new Promise(resolve => setTimeout(resolve, 2000));

          const SendtoUser = await path.resolve(__dirname, `../../garbage/stickers/${message.id.id}.${mediaType}`);

          console.log('send user data : ', SendtoUser);

          // ? read the file who's send the file and save after return to the clinet
          const filepath = await fs.readFileSync(SendtoUser);

          // ? return to encoded
          const encoded = Buffer.from(filepath).toString('base64');

          // ? create the media to send the client
          const media = new MessageMedia((await message.downloadMedia()).mimetype, downloadMedia);

          await client.sendMessage(from, encoded, {
            media,
            sendMediaAsSticker: true,
            caption: 'this is picture'
          });
        }

        // ? if user send to location in chat recieves
        if (message.location) {
          const { latitude, longitude } = await message.location;
          // const identify = await client.getNumberId(from);
          console.log('identify the number : ', latitude, longitude);
        }

        //   ? send the message with specific person
        // await client.sendMessage(from, 'hello');

        //   ? workflow :
        /**
         * 1 check user is already exist or not
         * 2 exist , send the relevent answer to user and who raise the question
         * 3 not exists , redirect to login after continue the session
         * 4 when the session is over store the chat into db
         */

        //   ! fetch entire chat history
        //   await client.getChats().then(async chat => {
        //     const fetchChatid = await chat.map(id => id.id._serialized);
        //     const fetchUserName = await Promise.all(
        //       chat.map(async name => {
        //         const personName = await name.getContact();
        //         return personName.pushname;
        //       })
        //     );
        // console.log('user chat id', fetchChatid);
        // console.log('user name : ', fetchUserName);

        // for (let getAllchat of chat) {
        //   console.log('user timestamp  : ', getAllchat.lastMessage?.timestamp);
        //   console.log('nickname find   : ', (await getAllchat.getContact()).pushname);
        //   ? fetch user id
        //   const chatId = await getAllchat.id._serialized;
        //   const chatName = await getAllchat.name;
        //   const chatHistory = (await client.getChatById(chatId)).fetchMessages({});
        //   const history = (await chatHistory).map(history => history.body);
        //   console.log(`Get the chat user ${chatName} with history : `, history);
        // }
        //   });
      }
    });
  } catch (error) {
    console.log('error message : ', error);
  }
};

export default configClient;
