//Database module
const sqlite3 = require("sqlite3").verbose();
//Open database
let db = new sqlite3.Database('./LoLDB.db');

module.exports = {
    name: 'listP',
    aliases: [],
    description: '',
    execute(message, args) {
    	let sql  = "SELECT Distinct BE, RP FROM Price ";

		db.all(sql,[],(err,rows)=>{
			if(err){
				console.error(err.message);
			}else{
				for(let i = 0; i < rows.length;i++){
					message.channel.send(rows[i].BE +' Blue Essence(BP) ' + rows[i].RP+' Riot Points');
				}
			}
		});

    },
};

