//Database module
const sqlite3 = require("sqlite3").verbose();
//Open database
let db = new sqlite3.Database('./LoLDB.db');

module.exports = {
    name: 'ordNew',
    aliases: [],
    description: '',
    execute(message, args) {
    	let sql  = 
					"SELECT Ch_Name, Date " + 
					"FROM Champion, ReleaseD " + 
					"WHERE Champion.Date_ID = ReleaseD.Date_ID " + 
					"GROUP BY Ch_Name " + 
					"ORDER BY Date DESC";

		db.all(sql,[],(err,rows)=>{
			if(err){
				console.error(err.message);
			}else{
				for(let i = 0; i < rows.length;i++){
					message.channel.send(rows[i].Ch_Name+ " was released on " + rows[i].Date);
				}
			}
		});

    },
};

