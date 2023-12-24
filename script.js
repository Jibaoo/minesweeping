

let primary = document.getElementById('primary');
primary.onclick = function() {
    renderMineField(9,9,10);
   
}

let middle = document.getElementById('middle');
middle.onclick = function() {
    renderMineField(16,16,40);

}

let high = document.getElementById('high');
high.onclick = function() {
    renderMineField(16,30,99);
}

function renderMineField(m,n,mineNums) {
    let tableEI = document.querySelector("#mine-field");
    let cells = [];
    
    for (let i = 0; i < m; i++) {
        let trEI = document.createElement('tr');
        let rows = [];

        for (let j = 0; j < n; j++) {
            let tdEI = document.createElement('td');
            let cellEI = document.createElement('div');
            
            cellEI.className = "cell";
            
            tdEI.append(cellEI);

            rows.push(cellEI);

            trEI.append(tdEI);
            
            
        }
        cells.push(rows);
        tableEI.append(trEI);

    }

    for (let cellNo of randomMineFieldNo(m,n,mineNums)) {
        let rowNo = Math.floor(cellNo / n);
        let colNo = cellNo % n;
        
        let minespan = document.createElement('span');
        minespan.className = "mine";
        minespan.innerText = "*";
        cells[rowNo][colNo].append(minespan);
    }
}

function randomMineFieldNo(m,n,mineNums) {
    console.assert(mineNums <= m * n);

    let mines = [];
    for (let i = 0; i < mineNums; i++) {
        let fieldNo;
        while (true) {
            fieldNo = Math.floor(Math.random() * m * n);
            if (!mines.includes(fieldNo)) {
                break;
            }
        }
        mines.push(fieldNo);
    }
    return mines;
}