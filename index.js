//Include modules
const fs = require('fs');
const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const { token,prefix} = require('./config.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
//Read commands file and looks for files ending with .js ie JavaScript commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name.toLowerCase(), command);
}

//Tell's me the bot is up
client.on('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
	if (message.author.bot) return;
	if(!message.content.startsWith(prefix)){
		return;
  	}else if(message.content.startsWith(prefix)){
	    const args = message.content.slice(prefix.length).split(/ +/);
	    const commandName = args.shift().toLowerCase();
	    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	    if (!command) return;
		if (!cooldowns.has(command.name)) {
	        cooldowns.set(command.name, new Discord.Collection());
	    }

	    try {
	        command.execute(message, args);
	    }
	    catch (error) {
	        console.error(error);
	        message.reply('there was an error trying to execute that command!');
	    }
  	}

});

client.login(token);