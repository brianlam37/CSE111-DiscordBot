//Database module
const sqlite3 = require("sqlite3").verbose();
//Open database
let db = new sqlite3.Database('./LoLDB.db');

module.exports = {
    name: 'addDes',
    aliases: ['adddes'],
    description: '',
    execute(message, args) {
    	let sql = "INSERT INTO Designer (D_Name, D_Handle) Values (?,?)";

    	let user = message.author;

    	let desHandle;
    	let desName;
		const filterH =  function ans(response){
					if(response.author.id == user.id){
						desHandle = response.content;
						return true;
					}else{
						return false;
					}
				};
		const filterN =  function ans(response){
					if(response.author.id == user.id){
						desName = response.content;
						return true;
					}else{
						return false;
					}
				};
    	message.channel.send("Enter the new Designer name (n'\\'a if unknown'):").then(()=>{
			message.channel.awaitMessages(filterN,{
				time:15000,
				maxMatches: 1,
				errors:['time']

			}).then(()=>{
				message.channel.send("Enter the new Designer handle (n'\\'a if unknown'):").then(()=>{
					message.channel.awaitMessages(filterH,{
						time:15000,
						maxMatches: 1,
						errors:['time']

					}).then(()=>{
						db.run(sql,[desName,desHandle],(err)=>{
							if(err){
								console.error(err.message);
								message.channel.send("Error!")
							}else{
								message.channel.send("Designer added!");
							}
						});			
					}).catch((err)=>{
						message.channel.send("took too long timeout");
						//db.close();;
					});
				});
			}).catch((err)=>{
				message.channel.send("took too long timeout");
				//db.close();;
			});

    	});

    },
};

