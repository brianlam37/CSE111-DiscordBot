//Database module
const sqlite3 = require("sqlite3").verbose();
//Open database
let db = new sqlite3.Database('./LoLDB.db');

module.exports = {
    name: 'chInfoChN',
    aliases: [],
    description: '',
    execute(message, args) {
    	let sql =   "SELECT Date, A_Name, F_Name ,BE, RP " + 
					"FROM Champion, Released, Attack, Faction, Price " + 
					"WHERE Ch_Name = ? AND Price.P_ID = Champion.P_ID " + 
					"AND Attack.A_ID = Champion.A_ID AND Champion.Date_ID = ReleaseD.Date_ID AND Faction.F_ID = Champion.F_ID";
		const selectClass = "SELECT Distinct C_Name " + 
							"FROM Champion, Class, InClass " + 
							"WHERE Ch_Name = ? AND InClass.Ch_ID = Champion.Ch_ID AND Class.C_ID = InClass.C_ID ";
		const selectRole =  "SELECT Distinct R_Name " + 
							"FROM Champion, Role, InRole " + 
							"WHERE Ch_Name = ? AND InRole.Ch_ID = Champion.Ch_ID AND Role.R_ID = InRole.R_ID ";
		const selectDes  =	"SELECT Distinct D_Handle, D_Name " + 
							"FROM Champion, Designer, DesBy " + 
							"WHERE Ch_Name = ? AND DesBy.Ch_ID = Champion.Ch_ID AND Designer.D_ID = DesBy.D_ID ";					

    	let user = message.author;

    	let input;
		const filter =  function ans(response){
					console.log(response.content);
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
				db.get(sql,[input],(err,row)=>{
					if(row == undefined){
						message.channel.send("doesn't exist");
					}else{
						let bigMessage;
						if (err) {
							return console.error(err.message);
						}
				   		if(row.F_Name != 'Other'){
					    	bigMessage = input+ " was originally released on " + row.Date+", costs " + row.BE + " in BE or " + row.RP+" in RP,"
									+ " uses " + row.A_Name+" attacks, and is affiliated with " +row.F_Name +".\n";
						}else{
							bigMessage = input+ " was originally released on " + row.Date+", costs " + row.BE + " in BE or " + row.RP+" in RP,"
									+ " uses " + row.A_Name+" attacks and is unaffiliated with a faction.\n";
						}

						db.all(selectClass,[input],(err,rows)=>{
					    	if(rows == undefined){
					    		bigMessage +="No Classes found, database needs to be updated!\n";
					    	}else{
					    		bigMessage +=input + " is a part of these classes:\n";
					    		for(let i = 0; i < rows.length;i++){
					    			bigMessage +="\t" + rows[i].C_Name+"\n";
					    		}

						    }
						    db.all(selectRole,[input],(err,rows)=>{
						    	if(rows == undefined){
						    		bigMessage +="No Roles found, database needs to be updated!\n";
						    	}else{
						    		bigMessage +=input + " is a part of these roles:\n";
						    		for(let i = 0; i < rows.length;i++){
						    			bigMessage +="\t" + rows[i].R_Name+"\n";
						    		}


							    }
							    db.all(selectDes,[input],(err,rows)=>{
							    	if(rows == undefined){
							    		bigMessage +="No Designers found, database needs to be updated!\n";
							    	}else{
							    		bigMessage +=input + " was designed by:\n";
							    		for(let i = 0; i < rows.length;i++){
								    		if(rows[i].D_Name == 'n\\a' && rows[i].D_Handle == 'n\\a') {
												bigMessage+="\t" + "an Unknown designer"+'\n';
											}else if(rows[i].D_Handle == 'n\\a') {
												bigMessage+="\t" + rows[i].D_Name+'\n';
											}else if(rows[i].D_Name == 'n\\a') {
												bigMessage+="\t" + rows[i].D_Handle+'\n';
											}else{
												bigMessage+="\t" + rows[i].D_Name+ " AKA "+ rows[i].D_Handle+'\n';
											}
										}
									}
									console.log(bigMessage);
									message.channel.send(bigMessage).catch((err)=>{
										console.error(err.message);
									});
								});

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

