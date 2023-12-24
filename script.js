

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

            rows.push({
                mined: false,
                el: cellEI,
            });

            trEI.append(tdEI);
            
            
        }
        cells.push(rows);
        tableEI.append(trEI);

    }

    for (let cellNo of randomMineFieldNo(m,n,mineNums)) {
        let rowNo = Math.floor(cellNo / n);
        let colNo = cellNo % n;

        let cell = cells[rowNo][colNo];
        cell.mined = true;

        let minespan = document.createElement('span');
        minespan.className = "mine";
        minespan.innerText = "*";
        cell.el.append(minespan);
    }
    checkAmbedianMineCounts(cells,m,n)
}

let direction = [
    [-1,-1], [0,-1], [1,-1],
    [-1,0], [1,0],
    [-1,1], [0,1], [1,1]
]

function checkAmbedianMineCounts(cells,m,n) {
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            let cell = cells[i][j];
            if (cell.mined) {
                continue
            }
            let minedcount = 0;
            for (let [dx,dy] of direction) {
                let newRowIdx = i + dx, newColIdx = j + dy;
                if (newRowIdx < 0 || newRowIdx >= m ||
                    newColIdx < 0 || newColIdx >= n ) {
                    continue
                }
                if (cells[newRowIdx][newColIdx].mined) {
                    minedcount += 1;
                }
            }
            if (minedcount > 0) {
                let countSpan  = document.createElement('span');
                countSpan.className = "mine-count";
                countSpan.innerText = `${minedcount}`;

                countSpan.classList.add(`n${minedcount}`);
                
                cell.el.append(countSpan);
            }
        }
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