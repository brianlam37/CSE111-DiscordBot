//Database module
const sqlite3 = require("sqlite3").verbose();
//Open database
let db = new sqlite3.Database('./LoLDB.db');

module.exports = {
    name: 'dispPrice',
    aliases: ['dPrice'],
    description: '',
    execute(message, args) {
    	let sql = 
					"SELECT Ch_Name, BE, RP " +
					"FROM Champion, Price " +
					"WHERE Champion.P_ID = Price.P_ID";

		db.all(sql,[],(err,rows)=>{
			if(err){
				console.error(err.message);
			}else{
				for(let i = 0; i < rows.length;i++){
					message.channel.send(rows[i].Ch_Name+ " costs " + rows[i].BE + " in BE or " + rows[i].RP+" in RP");
				}
			}
		});

    },
};

