import Discord from 'discord.js';
import config from "../../../infrastructure/config";
import { ICommand } from "../../../infrastructure/types/commands/commands.types";

const filter = (reaction) => ["✅", "❌"].includes(reaction.emoji.name);

const polling: ICommand = {
    name: "poll",
    description: `create poll. Parameters:\n\t--title: Poll's title (req.)\n\t--description: Poll's description \n\t--duration: Poll's duration in secords (opt.)\n\tex: ${config.discord.prefix}.poll --title "my poll" --description "my description" --duration 60`,
    execute: async (message, args, kwargs) => {
        const helpMsg = `Bad inputs. You can have a look on how to use this command by typing \`${config.discord.prefix}.help polling\`.`;
    
        if (!("title" in kwargs) || !("description" in kwargs)) {
            message.reply(helpMsg);
            return;
        }

        const { title, description, duration: durationKwargs } = kwargs;

        if (durationKwargs) {
            const numberReg = /^[0-9]+$/g
            if (!durationKwargs.toString().match(numberReg)) {
                message.reply("Duration should be an integer.");
                return;
            }
        }

        const duration = durationKwargs !== undefined ? parseInt(durationKwargs.toString(), 10) : -1;
        const embed = new Discord.MessageEmbed({
            "title": `Polling: *${title.trim()}*`,
            "description": description.trim(),
            "color": 49151,
            "author": {
              "name": message.author.username,
              "icon_url": message.author.avatarURL()
            },
            "fields": [
              {
                "name": "Informations:",
                "value": `In order to vote, please click on reactions below. This poll lasts ${duration === -1 ? "forever" : `${duration} seconds`}`
              },
              {
                "name": ":white_check_mark:",
                "value": "Upvote",
                "inline": true
              },
              {
                "name": ":x:",
                "value": "Downvote",
                "inline": true
              }
            ]
        });

        const addedMessage = await message.channel.send(embed);

        if (duration !== -1) {
            addedMessage.awaitReactions(filter, { time: duration * 1000 })
                .then((collected) => {
                    addedMessage.delete();
                    
                    const upvotesCount = collected.get("✅").count - 1;
                    const downvotesCount = collected.get("❌").count - 1;
                    let color = 16775168;
                    if (upvotesCount > downvotesCount) {
                        color = 5570304;
                    } else if (upvotesCount < downvotesCount) {
                        color = 16711680;
                    }

                    const resultsEmbed = new Discord.MessageEmbed({
                        "title": `Polling Results: *${title.trim()}*`,
                        "description": description.trim(),
                        "color": color,
                        "author": {
                          "name": message.author.username,
                          "icon_url": message.author.avatarURL()
                        },
                        "fields": [
                          {
                            "name": "Informations:",
                            "value": `Received ${upvotesCount + downvotesCount} votes. Results for each below:`
                          },
                          {
                            "name": ":white_check_mark:",
                            "value": upvotesCount,
                            "inline": true
                          },
                          {
                            "name": ":x:",
                            "value": downvotesCount,
                            "inline": true
                          }
                        ]
                    });

                    message.channel.send(resultsEmbed).catch(error => console.error(`[polling]: ${error}`));
                })
                .catch((collected) => {});
        }

        addedMessage.react("✅");
        addedMessage.react("❌");
    }
}

export default polling;
