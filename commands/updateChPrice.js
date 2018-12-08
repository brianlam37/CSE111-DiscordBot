//Database module
const sqlite3 = require("sqlite3").verbose();
//Open database
let db = new sqlite3.Database('./LoLDB.db');

module.exports = {
    name: 'updateChPrice',
    aliases: ['updatechp'],
    description: '',
    execute(message, args) {
    	let selectPID = "SELECT P_ID FROM PRICE WHERE BE = ? OR RP = ?";
    	let selectCh = "SELECT Ch_Name FROM Champion WHERE Ch_Name = ?";
		let updateCh = "UPDATE Champion SET P_ID = ? WHERE Ch_Name = ?";
    	let user = message.author;

    	let price;
    	let name;
    	let pid;
		const filterP =  function ans(response){
					if(response.author.id == user.id){
						price = response.content;
						return true;
					}else{
						return false;
					}
				};
		const filterN =  function ans(response){
					if(response.author.id == user.id){
						name = response.content;
						return true;
					}else{
						return false;
					}
				};
		message.channel.send("Enter Champion name:").then(()=>{
			message.channel.awaitMessages(filterN,{
				time:15000,
				maxMatches: 1,
				errors:['time']

			}).then(()=>{
				db.get(selectCh,[name],(row,err)=>{
					if(row == undefined){
						message.channel.send("Champion not in database!");
					}else{
						message.channel.send("Enter BE or RP:").then(()=>{
							message.channel.awaitMessages(filter,{
								time:15000,
								maxMatches: 1,
								errors:['time']

							}).then(()=>{
								db.get(selectPID,[price],(row,err)=>{
									pid = row.P_ID;
									db.run(updateCh,[pid,name],(err)=>{
										if(err){
											console.error(err.message);
										}else{
											message.channel.send("Champion price updated!");
										}
									});
								})

							}).catch((err)=>{
								message.channel.send("took too long timeout");
								//db.close();
							});

				    	});
					}
				});
			}).catch((err)=>{
				message.channel.send("took too long timeout");
				//db.close();
			});
				
		});
    	

    },
};
