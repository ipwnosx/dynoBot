const base = require("path").resolve(".");

const configHandler = require(base + "/src/utils/configHandler");

const twoWeeks = 14; //in days
const oneDay = 86400000; //in ms

module.exports = {
	run: function (msg, client) {
		var pathConfig = base + "/cfg/config.json";
		var amount = configHandler.readJSON(pathConfig, msg.guild.id, "message_cleaner", "amount");

		msg.channel.fetchMessages({limit: amount})
			.then(messages => {
				var msgArray = messages.array();
				var msgToDelete = [];
				var index = 0;
				var date = new Date();

				msgArray.forEach(message => { //TODO optimize
					var diffDays = Math.round(Math.abs((message.createdAt.getTime() - date.getTime()) / (oneDay)));
					if ((message.isMentioned(client.user) || message.author.id === client.user.id) && diffDays < twoWeeks && msg.deletable) {
						msgToDelete[index] = message;
						index++;
					}
				});

				msg.channel.bulkDelete(msgToDelete);
				msg.channel.send(`I've deleted ${msgToDelete.length} messages related to requests regarding me.`);
			})
			.catch((e) => {
				console.error(`${new Date().toLocaleString()}: ${e}`)
			});
	}
};