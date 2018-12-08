//Database module
const sqlite3 = require("sqlite3").verbose();
//Open database
let db = new sqlite3.Database('./LoLDB.db');

module.exports = {
    name: 'delChampion',
    aliases: [],
    description: '',
    execute(message, args) {
    	let selectChID = "SELECT Ch_ID FROM Champion WHERE Ch_Name = ?";
    	let deleteCh = "DELETE FROM Champion WHERE Ch_ID = ?";
    	let deleteDesBy = "DELETE FROM DesBy WHERE Ch_ID = ?";
    	let deleteInRole = "DELETE FROM InRole WHERE Ch_ID = ?";
    	let deleteInClass = "DELETE FROM InClass WHERE Ch_ID = ?";
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
    	message.channel.send("Enter the Champion name:").then(()=>{
			message.channel.awaitMessages(filter,{
				time:15000,
				maxMatches: 1,
				errors:['time']

			}).then(()=>{
				db.get(selectChID,[input],(err,row)=>{
					if(err){
						console.error(err.message);
					}else{
						if(row == undefined){
							message.channel.send("Champion doesn't exist!");
						}else{
							let chid = row.Ch_ID;
							db.run(deleteCh,[chid],(err)=>{
								message.channel.send("Champion deleted!");
							})
							db.run(deleteDesBy,[chid],(err)=>{
								message.channel.send("DesBy entries deleted!");
							})
							db.run(deleteInClass,[chid],(err)=>{
								message.channel.send("InClass entries deleted!");
							})	
							db.run(deleteInRole,[chid],(err)=>{
								message.channel.send("InRole entries deleted!");
							})																					
						}
						
					}
				});
			}).catch((err)=>{
				message.channel.send("took too long timeout");
				//db.close();;
			});

    	});

    },
};

