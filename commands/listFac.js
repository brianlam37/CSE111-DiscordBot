//Database module
const sqlite3 = require("sqlite3").verbose();
//Open database
let db = new sqlite3.Database('./LoLDB.db');

module.exports = {
    name: 'listFac',
    aliases: [],
    description: '',
    execute(message, args) {
    	let sql  = "SELECT Distinct F_Name FROM Faction ";

		db.all(sql,[],(err,rows)=>{
			if(err){
				console.error(err.message);
			}else{
				for(let i = 0; i < rows.length;i++){
					message.channel.send(rows[i].F_Name);
				}
			}
		});

    },
};

