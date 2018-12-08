//Database module
const sqlite3 = require("sqlite3").verbose();
//Open database
let db = new sqlite3.Database('./LoLDB.db');

module.exports = {
    name: 'chByY',
    aliases: [],
    description: '',
    execute(message, args) {
    	let sql  = "SELECT Distinct Ch_Name , Date FROM Champion,Released WHERE STRFTIME('%Y',Date) = ?  AND Champion.Date_ID = ReleaseD.Date_ID";
		
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
		message.channel.send("Year:").then(()=>{
			message.channel.awaitMessages(filter,{
				time:15000,
				maxMatches: 1,
				errors:['time']

			}).then(()=>{
				db.all(sql,[input],(err,rows)=>{
					if(err){
						message.channel.send("Error!");
						console.error(err.message);
					}else{
						if(rows.length <= 0){
							message.channel.send("Year not found!");
						}else{
							for(let i = 0; i < rows.length;i++){
								message.channel.send(rows[i].Ch_Name);
							}
						}

					}
				});
			}).catch((err)=>{
				if(err){
					console.error(err.message);
				}
				message.channel.send("took too long timeout");
				//db.close();
			});

    	});

    },
};

