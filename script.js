

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

            cellEI.onclick = function() {
                handleClick(i,j,cells,m,n);
            }
            
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
    for (let rowIdx = 0; rowIdx < m; rowIdx++) {
        for (let colIdx = 0; colIdx < n; colIdx++) {
            let cell = cells[rowIdx][colIdx];
            if (cell.mined) {
                continue
            }
            let minecount = 0;
            for (let [drow,dcol] of direction) {
                let newRowIdx = rowIdx + drow, newColIdx = colIdx + dcol;
                if (newRowIdx < 0 || newRowIdx >= m ||
                    newColIdx < 0 || newColIdx >= n ) {
                    continue
                }
                if (cells[newRowIdx][newColIdx].mined) {
                    minecount += 1;
                }
            }
            if (minecount > 0) {
                let countSpan  = document.createElement('span');
                countSpan.className = "mine-count";
                countSpan.innerText = `${minecount}`;

                countSpan.classList.add(`n${minecount}`);

                cell.el.append(countSpan);
            }
            cell.minecount = minecount
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

function handleClick(rowIdx,colIdx,cells,m,n) {
    let cell = cells[rowIdx][colIdx];
    if (cell.mined) {

    } else if (cell.minecount == 0) {
        spreadSafeField(rowIdx,colIdx,cells,m,n);
    } else if (cell.minecount > 0) {

    }
}


function spreadSafeField(rowIdx,colIdx,cells,m,n) {

    let cell = cells[rowIdx][colIdx];
   
    if (!cell.spreaded) {
        cell.spreaded = true;
        cell.el.classList.add("spreaded");    
    }    

    for (let [drow,dcol] of direction) {

        let newRowIdx = rowIdx + drow, newColIdx = colIdx + dcol;
        if (newRowIdx < 0 || newRowIdx >= m ||
            newColIdx < 0 || newColIdx >= n ) {
            continue
        }
        let cell = cells[newRowIdx][newColIdx];

        if (!cell.spreaded && cell.minecount == 0) {
            spreadSafeField(newRowIdx,newColIdx,cells,m,n)
        }
        
        cell.spreaded = true;
        cell.el.classList.add("spreaded");
    } 
}

