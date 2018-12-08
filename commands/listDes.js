//Database module
const sqlite3 = require("sqlite3").verbose();
//Open database
let db = new sqlite3.Database('./LoLDB.db');

module.exports = {
    name: 'listDes',
    aliases: [],
    description: '',
    execute(message, args) {
    	let sql  = "SELECT Distinct D_Name,D_Handle FROM Designer ";

		db.all(sql,[],(err,rows)=>{
			if(err){
				console.error(err.message);
			}else{
				for(let i = 0; i < rows.length;i++){
						if(rows[i].D_Name == 'n\\a' && rows[i].D_Handle == 'n\\a') {
							message.channel.send("an Unknown designer");
						}else if(rows[i].D_Handle == 'n\\a') {
							message.channel.send(rows[i].D_Name);
						}else if(rows[i].D_Name == 'n\\a') {
							message.channel.send(rows[i].D_Handle);
						}else{
							message.channel.send(rows[i].D_Name+ " AKA "+ rows[i].D_Handle);
						}
				}
			}
		});

    },
};

