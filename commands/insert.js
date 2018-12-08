//Database module
const sqlite3 = require("sqlite3").verbose();
//Open database
let db = new sqlite3.Database('./LoLDB.db');

module.exports = {
    name: 'insertCh',
    aliases: ['insCh','insch'],
    description: '',
    execute(message, args) {
    	//console.log("hi");
    	let selectAID = "SELECT A_ID FROM Attack WHERE A_Name = ?";
    	let selectFID = "SELECT F_ID FROM Faction WHERE F_Name = ?";
    	let selectPID = "SELECT P_ID FROM Price WHERE BE = ? AND RP = ?";
    	let selectCID = "SELECT C_ID FROM Class WHERE C_Name = ?";
    	let selectRID = "SELECT R_ID FROM Role WHERE R_Name = ?";
    	let selectDID = "SELECT D_ID FROM Designer WHERE D_Name = ? OR D_Handle = ?";
    	let selectDate = "SELECT Date_ID FROM Released WHERE Date = ?";
    	let selectChID = "SELECT Ch_ID FROM Champion WHERE Ch_Name = ?";
    	let insertDate = "INSERT INTO Released (Date) VALUES (?)";
    	let insertChampion = "INSERT INTO Champion (Ch_Name, A_ID,F_ID,Date_ID,P_ID) VALUES (?,?,?,?,?)";
    	let insertDesBy = "INSERT INTO DesBy (Ch_ID, D_ID) VALUES (?,?)";
    	let insertInRole = "INSERT INTO InRole (Ch_ID, R_ID) VALUES (?,?)";
    	let insertInClass = "INSERT INTO InClass (Ch_ID, C_ID) VALUES (?,?)";
    	let user = message.author;

		let name;
		let attack;
		let faction;
		let date;
		let be;
		let rp;
		let A_ID;
		let F_ID;
		let P_ID;
		let Ch_ID;
		let classList = [];
		let C_ID = [];
		let roleList = [];
		let R_ID = [];
		let date_ID;
		let desList = [];
		let D_ID = [];
		let numClasses;
		let numDes;
		let numRoles;

		let clIter = 0; 
		let rlIter = 0;
		let dlIter = 0;

		function classes(i){
			if(i < numClasses){
				let index = i+1;
				message.channel.send("Enter Class number "+ index +": ").then(()=>{
					message.channel.awaitMessages(filterCL,{
						time:15000,
						maxMatches: 1,
						errors:['time']
					}).then(()=>{
						db.get(selectCID,[classList[i]],(err,row)=>{
							if(row == undefined){
								message.channel.send("Not a valid class!\nInsertion Aborted!");
							}else{
								C_ID[i] = row.C_ID;
								classes(i+1);
							}
						});
					}).catch((err)=>{
						message.channel.send("took too long timeout");
						//db.close();;
					});
				});	
			}else{
				message.channel.send("Number of Roles:").then(()=>{
					message.channel.awaitMessages(filterNR,{
						time:15000,
						maxMatches: 1,
						errors:['time']

					}).then(()=>{
						roles(0);
					}).catch((err)=>{
						message.channel.send("took too long timeout");
						//db.close();;
					});
				});
			}
		}	
		function roles(i){
			if(i < numRoles){
				let index = i+1;
				message.channel.send("Enter Role number "+ index +": ").then(()=>{
					message.channel.awaitMessages(filterRL,{
						time:15000,
						maxMatches: 1,
						errors:['time']
					}).then(()=>{
						db.get(selectRID,[roleList[i]],(err,row)=>{
							if(row == undefined){
								message.channel.send("Not a valid role!\nInsertion Aborted!");
							}else{
								R_ID[i] = row.R_ID;
								roles(i+1);
							}
						});
					}).catch((err)=>{
						message.channel.send("took too long timeout");
						//db.close();;
					});
				});	
			}else{
				message.channel.send("Number of Designers:").then(()=>{
					message.channel.awaitMessages(filterND,{
						time:15000,
						maxMatches: 1,
						errors:['time']

					}).then(()=>{
						des(0);
					});
				}).catch((err)=>{
					message.channel.send("took too long timeout");
					//db.close();;
				});
			}
		}
		function des(i){
			if(i < numDes){
				let index = i+1;
				message.channel.send("Enter Designer number "+ index +": ").then(()=>{
					message.channel.awaitMessages(filterDL,{
						time:15000,
						maxMatches: 1,
						errors:['time']
					}).then(()=>{
						db.get(selectDID,[desList[i],desList[i]],(err,row)=>{
							if(row == undefined){
								//db.close();;
								message.channel.send("Not a valid designer!\nInsertion Aborted!");
							}else{
								D_ID[i] = row.D_ID;
								des(i+1);
							}
						});
					}).catch((err)=>{
						message.channel.send("took too long timeout");
						//db.close();;
					});
				});	
			}else{
				storeDateID();
			}
		}
		function storeDateID(){
			db.get(selectDate,[date],(err,row)=>{
				if(row == undefined){
					db.run(insertDate,[date],(err)=>{
						if (err) {
							//db.close();;
							return console.error(err.message);
						}else{
							db.get(selectDate,[date],(err,row)=>{
								if(row == undefined){
									console.log('wtf');
									//db.close();;
								}else{
									date_ID = row.Date_ID;
									insertCh();
								}
							});
						}
					});

				}else{
					date_ID = row.Date_ID;
					insertCh();
				}
			});
		}
		function insertCh(){
			db.run(insertChampion,[name,A_ID,F_ID,date_ID,P_ID],(err)=>{
				if(err){
					//db.close();;
					return console.error(err.message);
				}else{
					message.channel.send("Champion Inserted!");
					insertEverythingElse();
				}
			});
		}
		function insertEverythingElse(){
			db.get(selectChID,[name],(err,row)=>{
				if(row == undefined){
					console.log('wtf');
					//db.close();;
				}else{
					Ch_ID = row.Ch_ID;
					for(let i = 0; i < numRoles;i++){
						db.run(insertInRole,[Ch_ID,R_ID[i]],(err)=>{
							if(err){
								//db.close();;
								return console.error(err.message);
							}else{
								message.channel.send("InRole Updated!");
							}
						});
					}
					for(let i = 0; i < numClasses;i++){
						db.run(insertInClass,[Ch_ID,C_ID[i]],(err)=>{
							if(err){
								//db.close();;
								return console.error(err.message);
							}else{
								message.channel.send("InClass Updated!");
							}
						});
					}
					for(let i = 0; i < numDes;i++){
						db.run(insertDesBy,[Ch_ID,D_ID[i]],(err)=>{
							if(err){
								//db.close();;
								return console.error(err.message);
							}else{
								message.channel.send("DesBy Updated!");
							}
						});
					}
				}

			});
		}

		const filterNC =  function ans(response){
			let parsed = Number.isInteger(parseInt(response.content));
			if(response.author.id == user.id && parsed){
				if(parsed > 0){
					numClasses = parseInt(response.content);
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
				classList[clIter] = response.content;
				clIter++;
				return true;
			}else{
				return false;
			}
		};		
		const filterNR =  function ans(response){
			let parsed = Number.isInteger(parseInt(response.content));
			if(response.author.id == user.id && parsed){
				if(parsed > 0){
					numRoles = parseInt(response.content);
					return true;
				}else{
					message.channel.send("At least 1!!!!!");
					return false;
				}
			}else{
				return false;
			}
		};
		const filterRL =  function ans(response){
			if(response.author.id == user.id){
				roleList[rlIter] = response.content;
				rlIter++;
				return true;
			}else{
				return false;
			}
		};	
		const filterND =  function ans(response){
			let parsed = Number.isInteger(parseInt(response.content));
			if(response.author.id == user.id && parsed){
				if(parsed > 0){
					numDes = parseInt(response.content);
					return true;
				}else{
					message.channel.send("At least 1!!!!!");
					return false;
				}
			}else{
				return false;
			}
		};
		const filterDL =  function ans(response){
			if(response.author.id == user.id){
				desList[dlIter] = response.content;
				dlIter++;
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
		const filterA =  function ans(response){
							if(response.author.id == user.id){
								attack = response.content;
								return true;
							}else{
								return false;
							}
						};
		const filterF =  function ans(response){
							if(response.author.id == user.id){
								faction = response.content;
								return true;
							}else{
								return false;
							}
						};	
		const filterBE =  function ans(response){
							if(response.author.id == user.id){
								be = response.content;
								return true;
							}else{
								return false;
							}
						};
		const filterRP =  function ans(response){
					if(response.author.id == user.id){
						rp = response.content;
						return true;
					}else{
						return false;
					}
		};
		const filterDate =  function ans(response){
			if(response.author.id == user.id){
				date = response.content;
				return true;
			}else{
				return false;
			}
		};		
		function storeClassNum(){
			message.channel.send("Number of Classes:").then(()=>{
				message.channel.awaitMessages(filterNC,{
					time:15000,
					maxMatches: 1,
					errors:['time']

				}).then(()=>{
					classes(0);
				}).catch((err)=>{
					message.channel.send("took too long timeout");
					//db.close();;
				});
			});
		}
		function storeClassNum(){
			message.channel.send("Number of Classes:").then(()=>{
				message.channel.awaitMessages(filterNC,{
					time:15000,
					maxMatches: 1,
					errors:['time']

				}).then(()=>{
					classes(0);
				}).catch((err)=>{
					message.channel.send("took too long timeout");
					//db.close();;
				});
			});
		}		
		function storePriceID(){
			message.channel.send("Price in BE: ").then(() =>{
				message.channel.awaitMessages(filterBE,{
					time:15000,
					maxMatches: 1,
					errors:['time']
				}).then(()=>{
					message.channel.send("Price in RP: ").then(() =>{
						message.channel.awaitMessages(filterRP,{
							time:15000,
							maxMatches: 1,
							errors:['time']
						}).then(()=>{
							db.get(selectPID,[be,rp],(err,row)=>{
								if(row == undefined){
									message.channel.send("Not a valid price pair!\nInsertion Aborted!")
									//db.close();;
								}else{
									P_ID = row.P_ID;
									storeClassNum();
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
		}		
		function storeDate(){
			message.channel.send("Date (yyyy-mm-dd): ").then(()=>{
				message.channel.awaitMessages(filterDate,{
					time:15000,
					maxMatches: 1,
					errors:['time']
				}).then(()=>{
					storePriceID();
				}).catch((err)=>{
					message.channel.send("took too long timeout");
					//db.close();;
				});
			});	
		}
		function storeFactionID(){
			message.channel.send("Enter Faction:").then(() => {
				message.channel.awaitMessages(filterF,{
					time:15000,
					maxMatches: 1,
					errors:['time']
				}).then(() => {
					db.get(selectFID,[faction],(err,row)=>{
						if(row == undefined){
							message.channel.send("Faction doesn't exist!\nInsertion Aborted!");
							//db.close();;
						}else{
							F_ID = row.F_ID;
							storeDate();
						}
					});
				}).catch((err)=>{
					message.channel.send("took too long timeout");
					//db.close();;
				});
			});			
		}
		function storeAttackID(){
			message.channel.send("Enter Attack: ").then(() => {
				message.channel.awaitMessages(filterA,{
					time:15000,
					maxMatches: 1,
					errors:['time']
				}).then(() => {
					db.get(selectAID,[attack],(err,row)=>{
						if(row == undefined){
							message.channel.send("Attack doesn't exist!\nInsertion Aborted!");
							//db.close();;
						}else{
							A_ID = row.A_ID;
							storeFactionID();
						}
					});
				}).catch((err)=>{
					message.channel.send("took too long timeout");
					//db.close();;
				});
			});
		}	
		message.channel.send("Enter data please");										
    	message.channel.send("Enter Name:").then(() => {
    		message.channel.awaitMessages(filterN,{
					time:15000,
					maxMatches: 1,
					errors:['time']
				}).then(() => {
					db.get(selectChID,[name],(row,err)=>{
						if(row == undefined){
							storeAttackID();
						}else{
							message.channel.send("Already in there!");
							//db.close();;
						}
					});

				}).catch((err)=>{
					message.channel.send("took too long timeout");
					//db.close();;
				});
    	});

    },
};

