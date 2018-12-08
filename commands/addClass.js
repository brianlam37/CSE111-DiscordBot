//Database module
const sqlite3 = require("sqlite3").verbose();
//Open database
let db = new sqlite3.Database('./LoLDB.db');

module.exports = {
    name: 'addClass',
    aliases: ['addclass'],
    description: '',
    execute(message, args) {
    	let insertClass = "INSERT INTO Class (C_Name ) Values (?)";

    	let user = message.author;

    	let input;
		const filter =  function ans(response){
					if(response.author.id == user.id){
						input = response.content;
						return true;
					}else{
						return false;
					}
				};
    	message.channel.send("Enter the new Class name:").then(()=>{
			message.channel.awaitMessages(filter,{
				time:15000,
				maxMatches: 1,
				errors:['time']

			}).then(()=>{
				db.run(insertClass,[input],(err)=>{
					if(err){
						console.error(err.message);
					}else{
						message.channel.send("Class added!");
					}
				});
			}).catch((err)=>{
				message.channel.send("took too long timeout");
				//db.close();;
			});

    	});

    },
};

