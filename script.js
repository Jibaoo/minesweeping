let gameState = {
    m: 9,
    n: 9,
    mineNums: 10,
    remaining: null,
    timming: null,
    cells: null,
}


let primary = document.getElementById('primary');
primary.onclick = function() {
    renderMineField(gameState);
   
}

let middle = document.getElementById('middle');
middle.onclick = function() {
    gameState.m = 16;
    gameState.n = 16;
    gameState.mineNums = 40;
    renderMineField(gameState);

}

let high = document.getElementById('high');
high.onclick = function() {
    gameState.m = 30;
    gameState.n = 16;
    gameState.mineNums = 99;
    renderMineField(gameState);
}

function renderMineField(gameState) {
    let tableEI = document.querySelector("#mine-field");
    let cells = [];
    
    for (let i = 0; i < gameState.m; i++) {
        let trEI = document.createElement('tr');
        let rows = [];

        for (let j = 0; j < gameState.n; j++) {
            let tdEI = document.createElement('td');
            let cellEI = document.createElement('div');
            
            cellEI.className = "cell";

            cellEI.onclick = function() {
                handleClick(i,j,gameState);
            };
            
            cellEI.oncontextmenu = function() {
                handleFlaging(i,j,gameState);
                event.stopPropagation();
                event.preventDefault();
            };

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
    gameState.cells = cells;

    for (let cellNo of randomMineFieldNo(gameState)) {
        let rowNo = Math.floor(cellNo / gameState.n);
        let colNo = cellNo % gameState.n;

        let cell = cells[rowNo][colNo];
        cell.mined = true;

        let minespan = document.createElement('span');
        minespan.className = "mine";
        minespan.innerText = "*";
        cell.el.append(minespan);
    }
    checkAmbedianMineCounts(gameState)
}

let direction = [
    [-1,-1], [0,-1], [1,-1],
    [-1,0], [1,0],
    [-1,1], [0,1], [1,1]
]

function checkAmbedianMineCounts(gameState) {
    for (let rowIdx = 0; rowIdx < gameState.m; rowIdx++) {
        for (let colIdx = 0; colIdx < gameState.n; colIdx++) {
            let cell = gameState.cells[rowIdx][colIdx];
            if (cell.mined) {
                continue
            }
            let minecount = 0;
            for (let [drow,dcol] of direction) {
                let newRowIdx = rowIdx + drow, newColIdx = colIdx + dcol;
                if (newRowIdx < 0 || newRowIdx >= gameState.m ||
                    newColIdx < 0 || newColIdx >= gameState.n ) {
                    continue
                }
                if (gameState.cells[newRowIdx][newColIdx].mined) {
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

function randomMineFieldNo(gameState) {
    

    let mines = [];
    for (let i = 0; i < gameState.mineNums; i++) {
        let fieldNo;
        while (true) {
            fieldNo = Math.floor(Math.random() * gameState.m * gameState.n);
            if (!mines.includes(fieldNo)) {
                break;
            }
        }
        mines.push(fieldNo);
    }
    return mines;
}

function handleClick(rowIdx,colIdx,gameState) {
    let cell = gameState.cells[rowIdx][colIdx];
    if (cell.mined) {

    } else if (cell.minecount == 0) {
        spreadSafeField(rowIdx,colIdx,gameState);
    } else if (cell.minecount > 0) {

    }
}

function handleFlaging(rowIdx,colIdx,gameState) {
    let cell = gameState.cells[rowIdx][colIdx];
    if (cell.spread) {
        return;
    }
    setFlag(cell,!cell.flag);
}

function setFlag(cell,flag) {
    if (flag) {
        cell.flag = true;
        cell.el.innerHTML=`<span class="flag">!</span>`;
    } else {
        cell.flag = false;
        if (cell.mined) {
            cell.el.innerHTML=`<span class="mine">*</span>`;
        } else if (cell.minecount > 0) {
            cell.el.innerHTML = `<span class="mine-count n${cell.minecount}">${cell.minecount}</span>`
        } else {
            cell.el.innerHTML = "";
        }
    }
}

function spreadSafeField(rowIdx,colIdx,gameState) {

    let cell = gameState.cells[rowIdx][colIdx];
   
    if (!cell.spreaded) {
        cell.spreaded = true;
        cell.el.classList.add("spreaded");    
    }    

    for (let [drow,dcol] of direction) {

        let newRowIdx = rowIdx + drow, newColIdx = colIdx + dcol;
        if (newRowIdx < 0 || newRowIdx >= gameState.m ||
            newColIdx < 0 || newColIdx >= gameState.n ) {
            continue
        }
        let cell = gameState.cells[newRowIdx][newColIdx];

        if (!cell.spreaded && cell.minecount == 0) {
            spreadSafeField(newRowIdx,newColIdx,gameState)
        }
        
        cell.spreaded = true;
        cell.el.classList.add("spreaded");

        if (cell.flag) {
            setFlag(cell,false);
        }
    } 
}

