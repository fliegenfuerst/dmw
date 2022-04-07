class GUI{
	constructor(){
		
	}
	getRegisteredDigiTable(digi, index){
		let table = document.createElement("TABLE");
		let row = document.createElement("TR");
		let col = document.createElement("TD");
		col.colspan="2";
		col.innerText = `registered digimon no. ${index}`
		table.appendChild(row);
		row.appendChild(col);
		table.appendChild(this.getDigiStatsRow("Name", digi.name));
		table.appendChild(this.getDigiStatsRow("Type", digimonStats[digi.id].name));
		table.appendChild(this.getDigiStatsRow("HP", digi.hp));
		table.appendChild(this.getDigiStatsRow("MP", digi.mp));
		table.appendChild(this.getDigiStatsRow("Offense", digi.off));
		table.appendChild(this.getDigiStatsRow("Defense", digi.def));
		table.appendChild(this.getDigiStatsRow("Speed", digi.spd));
		table.appendChild(this.getDigiStatsRow("Brains", digi.brn));
		table.appendChild(this.getMoveStatRow(digi.move1Id , 1, digi.id));
		table.appendChild(this.getMoveStatRow(digi.move2Id , 2, digi.id));
		table.appendChild(this.getMoveStatRow(digi.move3Id , 3, digi.id));
		return table;
	}
	getMoveStatRow(moveId, index, digiId){
		let name = "";
		if(moveId == 255){
			name = "empty";
		}else{
			name = digimonStats[digiId].moves[moveId-0x2E];
		}
		return this.getDigiStatsRow(`Move ${index}`, name);
	}
	getDigiStatsRow(statName, value){
		let row = document.createElement("TR");
		let col = document.createElement("TD");
		col.innerText = statName;
		row.appendChild(col);
		col = document.createElement("TD");
		col.innerText = value;
		row.appendChild(col);
		return row;
	}
}
