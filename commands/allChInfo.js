//Database module
const sqlite3 = require("sqlite3").verbose();
//Open database
let db = new sqlite3.Database('./LoLDB.db');

module.exports = {
    name: 'blowup',
    aliases: ['bp'],
    description: '',
    execute(message, args) {
    	const selectAll = "SELECT Ch_Name, Date, A_Name, F_Name ,BE, RP " + 
				"FROM Champion, Released, Attack, Faction, Price " + 
				"WHERE Price.P_ID = Champion.P_ID " + 
				"AND Attack.A_ID = Champion.A_ID AND Champion.Date_ID = Released.Date_ID AND Faction.F_ID = Champion.F_ID";
		const selectClass = "SELECT Distinct C_Name " + 
							"FROM Champion, Class, InClass " + 
							"WHERE Ch_Name = ? AND InClass.Ch_ID = Champion.Ch_ID AND Class.C_ID = InClass.C_ID ";
		const selectRole =  "SELECT Distinct R_Name " + 
							"FROM Champion, Role, InRole " + 
							"WHERE Ch_Name = ? AND InRole.Ch_ID = Champion.Ch_ID AND Role.R_ID = InRole.R_ID ";
		const selectDes  =	"SELECT Distinct D_Handle, D_Name " + 
							"FROM Champion, Designer, DesBy " + 
							"WHERE Ch_Name = ? AND DesBy.Ch_ID = Champion.Ch_ID AND Designer.D_ID = DesBy.D_ID ";

		db.all(selectAll,[],(err,row)=> {
			let bigMessage = [];
			let size;
			size = row.length;
			let wows = [];
			for(let i = 0; i <row.length;i++){
				wows[i] = false;
			}
			for(let wow = 0; wow < row.length;wow++){	
				if (err) {
					return console.error(err.message);
				}
		   		if(row[wow].F_Name != 'Other'){
			    	bigMessage[wow] = row[wow].Ch_Name+ " was originally released on " + row[wow].Date+", costs " + row[wow].BE + " in BE or " + row[wow].RP+" in RP,"
							+ " uses " + row[wow].A_Name+" attacks, and is affiliated with " +row[wow].F_Name +".\n";
				}else{
					bigMessage[wow] = row[wow].Ch_Name+ " was originally released on " + row[wow].Date+", costs " + row[wow].BE + " in BE or " + row[wow].RP+" in RP,"
							+ " uses " + row[wow].A_Name+" attacks and is unaffiliated with a faction.\n";
				}
				db.all(selectClass,[row[wow].Ch_Name],(err,rows)=>{
			    	if(rows == undefined){
			    		bigMessage[wow] +="No Classes found, database needs to be updated!\n";
			    	}else{
			    		bigMessage[wow] +=row[wow].Ch_Name + " is a part of these classes:\n";
			    		for(let i = 0; i < rows.length;i++){
			    			bigMessage[wow] +="\t" + rows[i].C_Name+"\n";
			    		}

				    }
				    db.all(selectRole,[row[wow].Ch_Name],(err,rows)=>{
				    	if(rows == undefined){
				    		bigMessage[wow] +="No Roles found, database needs to be updated!\n";
				    	}else{
				    		bigMessage[wow] +=row[wow].Ch_Name + " is a part of these roles:\n";
				    		for(let i = 0; i < rows.length;i++){
				    			bigMessage[wow] +="\t" + rows[i].R_Name+"\n";
				    		}


					    }
					    db.all(selectDes,[row[wow].Ch_Name],(err,rows)=>{
					    	if(rows == undefined){
					    		bigMessage[wow] +="No Designers found, database needs to be updated!\n";
					    	}else{
					    		bigMessage[wow] +=row[wow].Ch_Name + " was designed by:\n";
					    		for(let i = 0; i < rows.length;i++){
						    		if(rows[i].D_Name == 'n\\a' && rows[i].D_Handle == 'n\\a') {
										bigMessage[wow]+="\t" + "an Unknown designer"+'\n';
									}else if(rows[i].D_Handle == 'n\\a') {
										bigMessage[wow]+="\t" + rows[i].D_Name+'\n';
									}else if(rows[i].D_Name == 'n\\a') {
										bigMessage[wow]+="\t" + rows[i].D_Handle+'\n';
									}else{
										bigMessage[wow]+="\t" + rows[i].D_Name+ " AKA "+ rows[i].D_Handle+'\n';
									}
								}

						    }
						    

						    wows[wow] = true;
							// message.channel.send(bigMessage).catch((err)=>{
							// 	console.error(err.message);
							// });	
							//console.log(bigMessage[wow]);
							let print = true;

							for(let i = 0; i < size;i++){
								if(wows[i]!=true){
									print = false;
								}
							}
							if(print == true){
								for(let i = 0; i < size;i++){
									//console.log(i);
									console.log(bigMessage[i]);
									message.channel.send(bigMessage[i]).catch((err)=>{
										console.error(err.message);
									});	
								}
							}

						});
					});

		    	});
			}
		});

		


    },
};
