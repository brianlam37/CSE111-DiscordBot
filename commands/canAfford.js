//Database module
const sqlite3 = require("sqlite3").verbose();
//Open database
let db = new sqlite3.Database('./LoLDB.db');

module.exports = {
    name: 'canAfford',
    aliases: [],
    description: '',
    execute(message, args) {
    	let selectPID  = "SELECT P_ID FROM Champion WHERE Ch_Name = ? ";
		let selectP = "SELECT BE , RP FROM Price WHERE P_ID = ?";
    	let user = message.author;

		let pType;
		let dolla;
		let total = 0;
		let numCh;
		let chIter = 0;
		let chList = [];
		let P_ID = [];

		const filterPtype =  function ans(response){
								if(response.author.id == user.id){
									pType = response.content;
									return true;
								}else{
									return false;
								}
							};
		const filterD =  function ans(response){
							let parsed = Number.isInteger(parseInt(response.content));
							if(response.author.id == user.id && parsed){
								dolla = parseInt(response.content);
								return true;
							}else{
								return false;
							}
						};	
		const filterNC =  function ans(response){
							let parsed = Number.isInteger(parseInt(response.content));
							if(response.author.id == user.id && parsed){
								if(parsed > 0){
									numCh= parseInt(response.content);
									return true;
								}else{
									message.channel.send("At least 1!!!!!");
									return false;
								}
							}else{
								return false;
							}
						};

		const filterCL =  function ans(response){
			if(response.author.id == user.id){
				chList[chIter] = response.content;
				console.log(chList[chIter]);
				chIter++;
				return true;
			}else{
				return false;
			}
		};						
		function champions(i){
			if(i < numCh){
				let index = i+1;
				message.channel.send("Enter Champion number "+ index +": ").then(()=>{
					message.channel.awaitMessages(filterCL,{
						time:15000,
						maxMatches: 1,
						errors:['time']
					}).then(()=>{
						db.get(selectPID,[chList[i]],(err,row)=>{
							if(row == undefined){
								message.channel.send("Not a champion!\nAborted!");
							}else{
								P_ID[i] = row.P_ID;
								champions(i+1);
							}
						});
					}).catch((err)=>{
						message.channel.send("took too long timeout");
						//db.close();;
					});
				});	
			}else{
				calcP(0);
			}
		}
		function calcP(i){
			if(i < numCh){
				if(pType == 'BE'){
					db.get(selectP,[P_ID[i]],(err,row)=>{
						if(row == undefined){
							console.log('wtf');
						}else{
							total+=row.BE;
							calcP(i+1);
						}
					});
					
				}else{

					db.get(selectP,[P_ID[i]],(err,row)=>{
						if(row == undefined){
							console.log('wtf');
						}else{
							total+=row.RP;
							calcP(i+1);
						}
					});
					
				}
			}else{
				if(total > dolla){
					let pooru = total - dolla;
					message.channel.send("You can't purchase them all!\nTotal purchase price is "+ total +" "+ pType+ "!\nYou need " + pooru + " more " + pType + "!");
				}else{
					let pooru = dolla - total;
					message.channel.send("You can purchase them all!\nTotal purchase price is "+ total +" "+ pType+ "!\nYou will have "+ pooru +" "+pType+ " left!");

				}
			}
		}
		message.channel.send("Enter your type of currency (BE or RP):").then(()=>{
			message.channel.awaitMessages(filterPtype,{
				time:15000,
				maxMatches: 1,
				errors:['time']

			}).then(()=>{
				if(pType!='BE' && pType!='RP'){
					message.channel.send('Not a valid currency!');
				}else{
					message.channel.send("Enter your balance:").then(()=>{
						message.channel.awaitMessages(filterD,{
							time:15000,
							maxMatches: 1,
							errors:['time']

						}).then(()=>{
							message.channel.send("Enter number of Champions:").then(()=>{
								message.channel.awaitMessages(filterNC,{
									time:15000,
									maxMatches: 1,
									errors:['time']

								}).then(()=>{
									champions(0);
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
				}
				
			}).catch((err)=>{
				message.channel.send("took too long timeout");
				//db.close();;
			});

    	});

    },
};

