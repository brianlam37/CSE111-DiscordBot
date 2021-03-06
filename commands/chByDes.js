//Database module
const sqlite3 = require("sqlite3").verbose();
//Open database
let db = new sqlite3.Database('./LoLDB.db');

module.exports = {
    name: 'chByDes',
    aliases: [],
    description: '',
    execute(message, args) {
    	let sql  = "SELECT Distinct Ch_Name FROM Designer, Champion, DesBy WHERE D_Name = ? OR D_Handle = ? "
				+ "AND DesBy.D_ID = Designer.D_ID AND Champion.Ch_ID = DesBy.D_ID";
		
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
		message.channel.send("Designer name or handle:").then(()=>{
			message.channel.awaitMessages(filter,{
				time:15000,
				maxMatches: 1,
				errors:['time']

			}).then(()=>{
				db.all(sql,[input,input],(err,rows)=>{
					if(err){
						message.channel.send("Error!");
						console.error(err.message);
					}else{
						if(rows.length <= 0){
							message.channel.send("Designer not found!");
						}else{
							for(let i = 0; i < rows.length;i++){
								message.channel.send(rows[i].Ch_Name);
							}
						}

					}
				});
			}).catch((err)=>{
				message.channel.send("took too long timeout");
				//db.close();
			});

    	});

    },
};

