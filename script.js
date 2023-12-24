

let primary = document.getElementById('primary');
primary.onclick = function() {
    renderMineField(9,9);
   
}

let middle = document.getElementById('middle');
middle.onclick = function() {
    renderMineField(16,16);

}

let high = document.getElementById('high');
high.onclick = function() {
    renderMineField(16,30);
}

function renderMineField(m,n) {
    let tableEI = document.querySelector("#mine-field");
    
    for (let i = 0; i < m; i++) {
        let trEI = document.createElement('tr');
        for (let j = 0; j < n; j++) {
            let tdEI = document.createElement('td');
            let cellEI = document.createElement('div');
            
            cellEI.className = "cell";
            
            tdEI.append(cellEI);
            trEI.append(tdEI);
            
            
        }

        tableEI.append(trEI);

    }
}

