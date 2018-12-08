//Database module
const sqlite3 = require("sqlite3").verbose();
//Open database
let db = new sqlite3.Database('./LoLDB.db');

module.exports = {
    name: 'crossSearch',
    aliases: ['xs'],
    description: '',
    execute(message, args) {
		let selectAID = "SELECT A_ID FROM Attack WHERE A_Name = ?";
    	let selectCID = "SELECT C_ID FROM Class WHERE C_Name = ?";
		let selectDID = "SELECT D_ID FROM Designer WHERE D_Name = ? OR D_Handle = ?";
		let selectFID = "SELECT F_ID FROM Faction WHERE F_Name = ?";	
		let selectBPID = "SELECT P_ID FROM Price WHERE BE = ?";
		let selectRPID = "SELECT P_ID FROM Price WHERE RP = ?";	
		let selectRID = "SELECT R_ID FROM Role WHERE R_Name = ?";
		let selectYID  = "SELECT Date_ID FROM Released WHERE STRFTIME('%Y',Date) = ?";	

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

		let yes = [];
		let no = []

		for(let i = 0; i < 7; i++){
			yes[i] = false;
			no[i] = false;
		}

		let numA;
		let aIter = 0; 
		let aList = [];
		let A_ID =[]
		let numCl;
		let clIter = 0;
		let clList = [];
		let C_ID =[]
		let numD;
		let dIter = 0;
		let dList = [];
		let D_ID =[]
		let numF;
		let fIter = 0;
		let fList = [];
		let F_ID =[]
		let bBool = false;
		let rBool = false;
		let bPrice;
		let bPID;
		let rPrice;
		let rPID;
		let numR;
		let rIter = 0;
		let rList = [];
		let R_ID =[]
		let numY;
		let yIter = 0;
		let yList = [];
		let Y_ID =[];		


		const filterYNA =  function ans(response){
								if(response.author.id == user.id && response.content == 'Yes'){
									yes[0] = true;
									return true;
								}else if(response.author.id == user.id && response.content == 'No'){
									no[0] = true;
									return true;
								}else{
									return false;
								}
							};
		const filterYNC =  function ans(response){
								if(response.author.id == user.id && response.content == 'Yes'){
									yes[1] = true;
									return true;
								}else if(response.author.id == user.id && response.content == 'No'){
									no[1] = true;
									return true;
								}else{
									return false;
								}
							};
		const filterYND =  function ans(response){
								if(response.author.id == user.id && response.content == 'Yes'){
									yes[2] = true;
									return true;
								}else if(response.author.id == user.id && response.content == 'No'){
									no[2] = true;
									return true;
								}else{
									return false;
								}
							};	
		const filterYNF =  function ans(response){
								if(response.author.id == user.id && response.content == 'Yes'){
									yes[3] = true;
									return true;
								}else if(response.author.id == user.id && response.content == 'No'){
									no[3] = true;
									return true;
								}else{
									return false;
								}
							};	
		const filterYNP =  function ans(response){
								if(response.author.id == user.id && response.content == 'Yes'){
									yes[4] = true;
									return true;
								}else if(response.author.id == user.id && response.content == 'No'){
									no[4] = true;
									return true;
								}else{
									return false;
								}
							};
		const filterYNBE =  function ans(response){
								if(response.author.id == user.id && response.content == 'Yes'){
									bBool = true;
									return true;
								}else if(response.author.id == user.id && response.content == 'No'){
									return true;
								}else{
									return false;
								}
							};
		const filterYNRP =  function ans(response){
								if(response.author.id == user.id && response.content == 'Yes'){
									rBool = true;
									return true;
								}else if(response.author.id == user.id && response.content == 'No'){
									return true;
								}else{
									return false;
								}
							};														
		const filterYNR =  function ans(response){
								console.log('role ' +response.content);
								if(response.author.id == user.id && response.content == 'Yes'){
									yes[5] = true;
									return true;
								}else if(response.author.id == user.id && response.content == 'No'){
									no[5] = true;
									return true;
								}else{
									return false;
								}
							};
		const filterYNY =  function ans(response){
								console.log('im here dawg');
								if(response.author.id == user.id && response.content == 'Yes'){
									yes[6] = true;
									return true;
								}else if(response.author.id == user.id && response.content == 'No'){
									no[6] = true;
									return true;
								}else{
									return false;
								}
							};																																								
		const filterNA = function ans(response){
							let parsed = parseInt(response.content);
							let check = Number.isInteger(parsed);
							if(response.author.id == user.id && check){
								if(parsed > 0 && parsed < 3){
									numA = parsed;
									return true;
								}else if(parsed < 0){
									message.channel.send("At least 1!!!!!");
									return false;
								}else{
									message.channel.send("Less than 3!!!!!");
									return false;									
								}
							}else{
								return false;
							}
						};
		const filterNC = function ans(response){
							let parsed = parseInt(response.content);
							let check = Number.isInteger(parsed);
							if(response.author.id == user.id && check){
								if(parsed > 0 && parsed < 8){
									numCl = parsed;
									return true;
								}else if(parsed < 0){
									message.channel.send("At least 1!!!!!");
									return false;
								}else{
									message.channel.send("Less than 8!!!!!");
									return false;									
								}
							}else{
								return false;
							}
						};
		const filterND = function ans(response){
							let parsed = parseInt(response.content);
							let check = Number.isInteger(parsed);
							if(response.author.id == user.id && check){
								if(parsed > 0 && parsed < 8){
									numD = parsed;
									return true;
								}else if(parsed < 0){
									message.channel.send("At least 1!!!!!");
									return false;
								}else{
									message.channel.send("Less than 8!!!!!");
									return false;									
								}
							}else{
								return false;
							}
						};
		const filterNF = function ans(response){
							let parsed = parseInt(response.content);
							let check = Number.isInteger(parsed);
							if(response.author.id == user.id && check){
								if(parsed > 0 && parsed < 14){
									numF = parsed;
									return true;
								}else if(parsed < 0){
									message.channel.send("At least 1!!!!!");
									return false;
								}else{
									message.channel.send("Less than 14!!!!!");
									return false;									
								}
							}else{
								return false;
							}
						};
		const filterNR = function ans(response){
							let parsed = parseInt(response.content);
							let check = Number.isInteger(parsed);
							if(response.author.id == user.id && check){
								if(parsed > 0 && parsed < 14){
									numR = parsed;
									return true;
								}else if(parsed < 0){
									message.channel.send("At least 1!!!!!");
									return false;
								}else{
									message.channel.send("Less than 14!!!!!");
									return false;									
								}
							}else{
								return false;
							}
						};								
		const filterNY = function ans(response){
							let parsed = parseInt(response.content);
							let check = Number.isInteger(parsed);
							if(response.author.id == user.id && check){
								if(parsed > 0 && parsed < 8){
									numY = parsed;
									return true;
								}else if(parsed < 0){
									message.channel.send("At least 1!!!!!");
									return false;
								}else{
									message.channel.send("Less than 8!!!!!");
									return false;									
								}
							}else{
								return false;
							}
						};																								
		const filterCL =  function ans(response){
			if(response.author.id == user.id){
				clList[clIter] = response.content;
				clIter++;
				return true;
			}else{
				return false;
			}
		};
		const filterAL =  function ans(response){
			if(response.author.id == user.id){
				aList[aIter] = response.content;
				aIter++;
				return true;
			}else{
				return false;
			}
		};
		const filterDL =  function ans(response){
			if(response.author.id == user.id){

				dList[dIter] = response.content;
				console.log(dList[dIter]);
				dIter++;
				return true;
			}else{
				return false;
			}
		};
		const filterFL =  function ans(response){
			if(response.author.id == user.id){
				fList[fIter] = response.content;
				fIter++;
				return true;
			}else{
				return false;
			}
		};	
		const filterBE =  function ans(response){
							console.log("filterBE")
							let parsed = parseInt(response.content);
							let check = Number.isInteger(parsed);
							if(response.author.id == user.id && check){
								bPrice = parsed;
								return true;
							}else{
								return false;
							}
		};	
		const filterRP =  function ans(response){
							console.log("filterRP")
							let parsed = parseInt(response.content);
							let check = Number.isInteger(parsed);
							if(response.author.id == user.id && check){
								rPrice = parsed;
								return true;
							}else{
								return false;
							}
		};	
		const filterRL =  function ans(response){
			if(response.author.id == user.id){
				rList[rIter] = response.content;
				rIter++;
				return true;
			}else{
				return false;
			}
		};
		const filterYL =  function ans(response){
			if(response.author.id == user.id){
				yList[yIter] = response.content;
				yIter++;
				return true;
			}else{
				return false;
			}
		};
		function start(){
			message.channel.send("Search by Attack (Yes or No):").then(()=>{
				message.channel.awaitMessages(filterYNA,{
					time:15000,
					maxMatches: 1,
					errors:['time']

				}).then(()=>{
					if(yes[0]){
							message.channel.send("Number of Attacks (1 - 2):").then(()=>{
								message.channel.awaitMessages(filterNA,{
									time:15000,
									maxMatches: 1,
									errors:['time']
								}).then(()=>{
									attacks(0);
								}).catch((err)=>{
									message.channel.send("took too long timeout");
									//db.close();
								});
							})
					}else{
						classQ();
					}
				}).catch((err)=>{
					message.channel.send("took too long timeout");
					//db.close();
				});

	    	});
		}
		function attacks(i){
			if(i < numA){
				let index = i+1;
				message.channel.send("Enter Attack number "+ index +": ").then(()=>{
					message.channel.awaitMessages(filterAL,{
						time:15000,
						maxMatches: 1,
						errors:['time']
					}).then(()=>{
						db.get(selectAID,[aList[i]],(err,row)=>{
							if(row == undefined){
								console.log(aList[i]);
								message.channel.send("Not an Attack!\nAborted!");
							}else{
								A_ID[i] = row.A_ID;
								attacks(i+1);
							}
						});
					}).catch((err)=>{
						message.channel.send("took too long timeout");
						//db.close();
					});
				});	
			}else{
				classQ();
			}
		}
		function classQ(){
			message.channel.send("Search by Class (Yes or No):").then(()=>{
				message.channel.awaitMessages(filterYNC,{
					time:15000,
					maxMatches: 1,
					errors:['time']

				}).then(()=>{
					if(yes[1]){
							message.channel.send("Number of Classes (1 - 7):").then(()=>{
								message.channel.awaitMessages(filterNC,{
									time:15000,
									maxMatches: 1,
									errors:['time']
								}).then(()=>{
									classes(0);
								}).catch((err)=>{
									message.channel.send("took too long timeout");
									//db.close();
								});
							})
					}else{
						DesQ();
					}
				}).catch((err)=>{
					message.channel.send("took too long timeout");
					//db.close();
				});

	    	});			
		}
		function classes(i){
			if(i < numCl){
				let index = i+1;
				message.channel.send("Enter Class number "+ index +": ").then(()=>{
					message.channel.awaitMessages(filterCL,{
						time:15000,
						maxMatches: 1,
						errors:['time']
					}).then(()=>{
						db.get(selectCID,[clList[i]],(err,row)=>{
							if(row == undefined){
								message.channel.send("Not a Class!\nAborted!");
							}else{
								C_ID[i] = row.C_ID;
								classes(i+1);
							}
						});
					}).catch((err)=>{
						message.channel.send("took too long timeout");
						//db.close();
					});
				});	
			}else{
				DesQ();
			}
		}
		function DesQ(){
			message.channel.send("Search by Designers (Yes or No):").then(()=>{
				message.channel.awaitMessages(filterYND,{
					time:15000,
					maxMatches: 1,
					errors:['time']

				}).then(()=>{
					if(yes[2]){
							message.channel.send("Number of Designers (1 - ?):").then(()=>{
								message.channel.awaitMessages(filterND,{
									time:15000,
									maxMatches: 1,
									errors:['time']
								}).then(()=>{
									des(0);
								}).catch((err)=>{
									message.channel.send("took too long timeout");
									//db.close();
								});
							})
					}else{
						FacQ();
					}
				}).catch((err)=>{
					message.channel.send("took too long timeout");
					//db.close();
				});

	    	});			
		}
		function des(i){
			if(i < numD){
				let index = i+1;
				message.channel.send("Enter Designer number "+ index +": ").then(()=>{
					message.channel.awaitMessages(filterDL,{
						time:15000,
						maxMatches: 1,
						errors:['time']
					}).then(()=>{
						db.get(selectDID,[dList[i],dList[i]],(err,row)=>{
							if(row == undefined){
								message.channel.send("Not a Designer!\nAborted!");
							}else{
								console.log(row.D_ID);
								D_ID[i] = row.D_ID;
								console.log(D_ID[i]);
								des(i+1);
							}
						});
					}).catch((err)=>{
						message.channel.send("took too long timeout");
						//db.close();
					});
				});	
			}else{
				FacQ();
			}
		}
		function FacQ(){
			message.channel.send("Search by Factions (Yes or No):").then(()=>{
				message.channel.awaitMessages(filterYNF,{
					time:15000,
					maxMatches: 1,
					errors:['time']

				}).then(()=>{
					if(yes[3]){
							message.channel.send("Number of Factions (1 - 13):").then(()=>{
								message.channel.awaitMessages(filterNF,{
									time:15000,
									maxMatches: 1,
									errors:['time']
								}).then(()=>{
									fac(0);
								}).catch((err)=>{
									message.channel.send("took too long timeout");
									//db.close();
								});
							})
					}else{
						priceQ();
					}
				}).catch((err)=>{
					message.channel.send("took too long timeout");
					//db.close();
				});

	    	});			
		}
		function fac(i){
			if(i < numF){
				let index = i+1;
				message.channel.send("Enter Faction number "+ index +": ").then(()=>{
					message.channel.awaitMessages(filterFL,{
						time:15000,
						maxMatches: 1,
						errors:['time']
					}).then(()=>{
						console.log(fList[i]);
						db.get(selectFID,[fList[i]],(err,row)=>{
							if(row == undefined){
								message.channel.send("Not a Faction!\nAborted!");
							}else{
								F_ID[i] = row.F_ID;
								fac(i+1);
							}
						});
					}).catch((err)=>{
						message.channel.send("took too long timeout");
						//db.close();
					});
				});	
			}else{
				priceQ();
			}
		}		
		function priceQ(){
			message.channel.send("Search by Price(Yes or No), outputs champions with exact price:").then(()=>{
				message.channel.awaitMessages(filterYNP,{
					time:15000,
					maxMatches: 1,
					errors:['time']

				}).then(()=>{
					if(yes[4]){
							message.channel.send("BE? (Yes or No):").then(()=>{
								message.channel.awaitMessages(filterYNBE,{
									time:15000,
									maxMatches: 1,
									errors:['time']
								}).then(()=>{
									if(bBool){
										priceBE();
									}else{
										askRP();
									}
								}).catch((err)=>{
									message.channel.send("took too long timeout");
									//db.close();
								});
							})
					}else{
						roleQ();
					}
				}).catch((err)=>{
					message.channel.send("took too long timeout");
					//db.close();
				});

	    	});				
		}		
		function priceBE(){

			message.channel.send("Enter Price in BE:\n\t450\n\t1350,\n\t3150\n\t4800\n\t6300").then(()=>{
				message.channel.awaitMessages(filterBE,{
					time:15000,
					maxMatches: 1,
					errors:['time']
				}).then(()=>{
					console.log(bPrice);
					db.get(selectBPID,[bPrice],(err,row)=>{
						if(row == undefined){
							message.channel.send("Not a valid BE Price!\nAborted!");
						}else{
							bPID = row.P_ID;
							askRP();
						}
					});
				}).catch((err)=>{
					message.channel.send("took too long timeout");
					//db.close();
				});
			});	
		
		}
		function askRP(){
				message.channel.send("RP? (Yes or No):").then(()=>{
					message.channel.awaitMessages(filterYNRP,{
						time:15000,
						maxMatches: 1,
						errors:['time']
					}).then(()=>{
						if(rBool){
							priceRP();
						}else{
							roleQ();
						}
					}).catch((err)=>{
						message.channel.send("took too long timeout");
						//db.close();
					});
				});
		}	
		function priceRP(){

			message.channel.send("Enter Price in RP:\n\t260\n\t585,\n\t790\n\t880\n\t975,").then(()=>{
				message.channel.awaitMessages(filterRP,{
					time:15000,
					maxMatches: 1,
					errors:['time']
				}).then(()=>{
					db.get(selectRPID,[rPrice],(err,row)=>{
						if(row == undefined){
							message.channel.send("Not a valid RP Price!\nAborted!");
						}else{
							rPID = row.P_ID;
							roleQ();
						}
					});
				}).catch((err)=>{
					message.channel.send("took too long timeout");
					//db.close();
				});
			});	
		
		}	
		function roleQ(){
			message.channel.send("Search by Roles (Yes or No):").then(()=>{
				message.channel.awaitMessages(filterYNR,{
					time:15000,
					maxMatches: 1,
					errors:['time']

				}).then(()=>{
					console.log(yes[5]);
					if(yes[5]){
							message.channel.send("Number of Roles (1 - 13):").then(()=>{
								message.channel.awaitMessages(filterNR,{
									time:15000,
									maxMatches: 1,
									errors:['time']
								}).then(()=>{
									roles(0);
								}).catch((err)=>{
									message.channel.send("took too long timeout");
									//db.close();
								});
							})
					}else{
						console.log("askDate")
						yearQ();
					}
				}).catch((err)=>{
					message.channel.send("took too long timeout");
					//db.close();
				});

	    	});			
		}
		function roles(i){
			if(i < numR){
				let index = i+1;
				message.channel.send("Enter Role number "+ index +": ").then(()=>{
					message.channel.awaitMessages(filterRL,{
						time:15000,
						maxMatches: 1,
						errors:['time']
					}).then(()=>{
						console.log(rList[i]);
						db.get(selectRID,[rList[i]],(err,row)=>{
							if(row == undefined){
								message.channel.send("Not a Role!\nAborted!");
							}else{
								R_ID[i] = row.R_ID;
								roles(i+1);
							}
						});
					}).catch((err)=>{
						message.channel.send("took too long timeout");
						//db.close();
					});
				});	
			}else{
				yearQ();
			}
		}				
		function yearQ(){
			message.channel.send("Search by Year (Yes or No), matches with an exact Year:").then(()=>{
				message.channel.awaitMessages(filterYNY,{
					time:15000,
					maxMatches: 1,
					errors:['time']

				}).then(()=>{
					console.log('years is' + yes[6]);
					if(yes[6]){
							message.channel.send("Number of Years (1 - ?):").then(()=>{
								message.channel.awaitMessages(filterNY,{
									time:15000,
									maxMatches: 1,
									errors:['time']
								}).then(()=>{
									years(0);
								}).catch((err)=>{
									message.channel.send("took too long timeout");
									//db.close();
								});
							})
					}else{
						console.log('this should run')
						print();
					}
				}).catch((err)=>{
					if(err){
						console.error(err.message);
					}
					message.channel.send("took too long timeout!!!!!");
					//db.close();
				});

	    	});						
		}	
		function years(i){
			if(i < numY){
				let index = i+1;
				message.channel.send("Enter Year number "+ index +": ").then(()=>{
					message.channel.awaitMessages(filterYL,{
						time:15000,
						maxMatches: 1,
						errors:['time']
					}).then(()=>{
						console.log(yList[i]);
						db.get(selectYID,[yList[i]],(err,row)=>{
							if(row == undefined){
								message.channel.send("Not a Year!\nAborted!");
							}else{
								Y_ID[i] = row.Date_ID;
								years(i+1);
							}
						});
					}).catch((err)=>{
						message.channel.send("took too long timeout");
						//db.close();
					});
				});	
			}else{
				print();
			}			
		}
		let bigSQL ="SELECT Ch_Name FROM Champion ";
		function print(){
			console.log('something');

			// if(yes[0]){
			// 	bigSQL += ",Attack"+;
			// }
			if(yes[1]){
				if(bigSQL[bigSQL.length-1] !=','){
					bigSQL += ",";
				}
				//bigSQL += "Class, InClass";
				bigSQL += "InClass";
			}
			if(yes[2]){
				if(bigSQL[bigSQL.length-1] !=','){
					bigSQL += ",";
				}
				// 	bigSQL += "Designer, Desby";
				bigSQL += "DesBy";
			}
			if(yes[3]){
				// if(bigSQL[bigSQL.length-1] !=',' && bigSQL.substring(bigSQL.length-9) !='Champion '){
				// 	bigSQL += ","
				// }
				// bigSQL += "Faction";

			}
			if(yes[4]){
				// if(bigSQL[bigSQL.length-1] !=',' && bigSQL.substring(bigSQL.length-9) !='Champion '){
				// 	bigSQL += ","
				// }
				// bigSQL += "Price";

			}
			if(yes[5]){
				if(bigSQL[bigSQL.length-1] !=','){
					bigSQL += ","
				}
				// bigSQL += "Role, InRole";
 				bigSQL += "InRole";
			}	
			if(yes[6]){
				if(bigSQL[bigSQL.length-1] !=','){
					bigSQL += ","
				}
				bigSQL += "Released";

			}
			let addWhere = false;
			for(let i = 0; i < yes.length;i++){
				if(yes[i]==true){
					addWhere = true;
				}		
			}
			if(addWhere){
				bigSQL += ' WHERE '
			}


			if(yes[0]){
				for(let i = 0; i < aList.length; i++){
					if(bigSQL.substring(bigSQL.length-2) == '? '){
						bigSQL+=' OR ';
					}
					bigSQL += "Champion.A_ID = ? ";
				}
			}
			if(yes[1]){
				for(let i = 0; i < clList.length; i++){
					console.log(bigSQL.length[bigSQL.length-3]);
					if(bigSQL.substring(bigSQL.length-9) =='A_ID = ? '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-3) == '?) '){
						bigSQL+=' OR ';
					}else if(bigSQL.substring(bigSQL.length-2) == '? '){
						bigSQL+=' OR ';
					}
					bigSQL += "(Champion.Ch_ID = InClass.Ch_ID AND C_ID = ?) ";
				}
			}
			if(yes[2]){
				for(let i = 0; i < dList.length; i++){
					if(bigSQL.substring(bigSQL.length-9) =='A_ID = ? '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-10) =='C_ID = ?) '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-3) == '?) '){
						bigSQL+=' OR ';
					}else if(bigSQL.substring(bigSQL.length-2) == '? '){
						bigSQL+=' OR ';
					}
					bigSQL += "(Champion.Ch_ID = DesBy.Ch_ID AND D_ID = ?) ";
				}
			}
			if(yes[3]){
				for(let i = 0; i < fList.length; i++){
					if(bigSQL.substring(bigSQL.length-9) =='A_ID = ? '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-10) =='C_ID = ?) '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-10) =='D_ID = ?) '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-3) == '?) '){
						bigSQL+=' OR ';
					}else if(bigSQL.substring(bigSQL.length-2) == '? '){
						bigSQL+=' OR ';
					}
					bigSQL += "Champion.F_ID = ? ";
				}

			}
			if(yes[4]){
				if(bBool){
					if(bigSQL.substring(bigSQL.length-9) =='A_ID = ? '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-10) =='C_ID = ?) '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-10) =='D_ID = ?) '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-9) =='F_ID = ? '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-3) == '?) '){
						bigSQL+=' OR ';
					}else if(bigSQL.substring(bigSQL.length-2) == '? '){
						bigSQL+=' OR ';
					}
					bigSQL += "Champion.P_ID = ? ";
				}
				if(rBool){
					if(bigSQL.substring(bigSQL.length-9) =='A_ID = ? '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-10) =='C_ID = ?) '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-10) =='D_ID = ?) '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-9) =='F_ID = ? '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-3) == '?) '){
						bigSQL+=' OR ';
					}else if(bigSQL.substring(bigSQL.length-2) == '? '){
						bigSQL+=' OR ';
					}
					bigSQL += "Champion.P_ID = ? ";					
				}

			}
			if(yes[5]){
				for(let i = 0; i < rList.length; i++){
					if(bigSQL.substring(bigSQL.length-9) =='A_ID = ? '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-10) =='C_ID = ?) '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-10) =='D_ID = ?) '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-9) =='F_ID = ? '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-9) =='P_ID = ? '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-3) == '?) '){
						bigSQL+=' OR ';
					}else if(bigSQL.substring(bigSQL.length-2) == '? '){
						bigSQL+=' OR ';
					}
					bigSQL += "(Champion.Ch_ID = InRole.Ch_ID AND R_ID = ?) ";
				}
			}	
			if(yes[6]){
				for(let i = 0; i < yList.length; i++){
					if(bigSQL.substring(bigSQL.length-9) =='A_ID = ? '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-10) =='C_ID = ?) '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-10) =='D_ID = ?) '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-9) =='F_ID = ? '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-9) =='P_ID = ? '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-10) =='R_ID = ?) '){
						bigSQL+=' AND ';
					}else if(bigSQL.substring(bigSQL.length-3) == '?) '){
						bigSQL+=' OR ';
					}else if(bigSQL.substring(bigSQL.length-2) == '? '){
						bigSQL+=' OR ';
					}
					bigSQL += "(Champion.Date_ID = Released.Date_ID AND STRFTIME('%Y',Date) = ?) ";
				}

			}		
			console.log(bigSQL);	
			plswork();														
		}
		let arr = [];
		function plswork(){
			
			let arrIter = 0;
			if(yes[0]){
				for(let i= 0; i < A_ID.length;i++){
					arr[arrIter] = A_ID[i];
					arrIter++;
				}
			}
			if(yes[1]){
				for(let i= 0; i < C_ID.length;i++){
					console.log(C_ID[i]);
				arr[arrIter] = C_ID[i];
				arrIter++;
				}
			}
			if(yes[2]){
				for(let i= 0; i < D_ID.length;i++){
					console.log(D_ID[i]);
					arr[arrIter] = D_ID[i];
					arrIter++;
				}
			}
			if(yes[3]){
				for(let i= 0; i < F_ID.length;i++){
					arr[arrIter] = F_ID[i];
					arrIter++;
				}
			}
			if(yes[4]){
				if(bBool){
					arr[arrIter] = bPID;
					arrIter++;
				}
				if(rBool){
					arr[arrIter] = rPID;
					arrIter++;		
				}
			}

			if(yes[5]){
				for(let i= 0; i < R_ID.length;i++){
					console.log(R_ID[i]);
					arr[arrIter] = R_ID[i];
					arrIter++;
				}		
			}
			if(yes[6]){
				for(let i= 0; i < yList.length;i++){
					arr[arrIter] = yList[i]
					arrIter++;
				}
			}
			console.log('heya');
			for(let i = 0; i < arr.length;i++){
				console.log(arr[i]);
			}
			db.all(bigSQL,arr,(err,rows)=>{
				if(err){
					console.error(err.message);
				}else{
					if(rows == undefined){
						console.log("nothing");
					}else{
						
						for(let i = 0;i < rows.length;i++){
							//console.log("heya");
							yo(rows[i].Ch_Name);
						}
					}
				}
				

			});
		}
		function yo(input){
			//console.log("heya");
			db.get(sql,[input],(err,row)=>{
				if(row == undefined){
					message.channel.send("doesn't exist");
					console.log("doesn't exist");
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
		}
		start();
    },
};

