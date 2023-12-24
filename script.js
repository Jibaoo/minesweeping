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
    let tableEl = document.querySelector("#mine-field");
    let cells = [];
    
    for (let i = 0; i < gameState.m; i++) {
        let trEl = document.createElement('tr');
        let rows = [];

        for (let j = 0; j < gameState.n; j++) {
            let tdEl = document.createElement('td');
            let cellEl = document.createElement('div');
            
            cellEl.className = "cell";

            cellEl.onclick = function() {
                handleClick(i,j,gameState);
            };
            
            cellEl.oncontextmenu = function() {
                handleFlaging(i,j,gameState);
                event.stopPropagation();
                event.preventDefault();
            };

            tdEl.append(cellEl);

            rows.push({
                mined: false,
                el: cellEl,
            });

            trEl.append(tdEl);
            
            
        }
        cells.push(rows);
        tableEl.append(trEl);

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

    let messageEl = document.querySelector(".game-info  > .message");
    messageEl.innerText = "--~少女祈祷中~--"
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

//点击
function handleClick(rowIdx,colIdx,gameState) {
    if (gameState.timming === null) {
        startGame(gameState);
    }
    //根据周围雷数点开
    let cell = gameState.cells[rowIdx][colIdx];
    if (cell.mined) {
        exploded(gameState,rowIdx,colIdx);
    } else if (cell.minecount == 0) {
        spreadSafeField(rowIdx,colIdx,gameState);
    } else if (cell.minecount > 0) {
        let cell = gameState.cells[rowIdx][colIdx];   
        if (!cell.spreaded) {
            cell.spreaded = true;
            cell.el.classList.add("spreaded");    
        }    
    }
}

function startGame(gameState) {
    //第一次点击
        let messageEl = document.querySelector(".game-info  > .message");
        messageEl.innerText = "正在玩-扫雷-"

        gameState.remaining = gameState.mineNums;
        let remainingEl = document.querySelector(".game-info > .remaining");
        remainingEl.innerHTML = `<span>${gameState.remaining}</span>`;

        //计时
        let timerEl = document.querySelector(".game-info > .timer");
        gameState.timming = 0;
        timerEl.innerHTML = `<span>${gameState.timming}</span>`;

        gameState.intervalID = setInterval(() => {
            gameState.timming += 1;
            timerEl.innerText = `${gameState.timming}`;
        }, 1000);
    }



//爆炸
function exploded(gameState,rowIdx,colIdx) {
    for (let rowIdx = 0; rowIdx < gameState.m; rowIdx++) {
        for (let colIdx = 0; colIdx < gameState.n; colIdx++) {
            let cell = gameState.cells[rowIdx][colIdx];
            if (cell.mined) {
                cell.exploded = true;
                cell.el.classList.add("exploded");
            } else {
                cell.el.classList.add("exploded");
                cell.el.classList.add("spreaded");
            }
        }
    }
    clearInterval(gameState.intervalID);

    let messageEl = document.querySelector(".game-info  > .message");
    messageEl.innerText = "满身疮痍GameOver~"
}

//右键插旗
function handleFlaging(rowIdx,colIdx,gameState) {
    if (gameState.timming === null) {
        startGame(gameState);
    }
    let cell = gameState.cells[rowIdx][colIdx];
    if (cell.spreaded) {
        return;
    }
    setFlag(cell,!cell.flag);

    if (cell.flag) {
        gameState.remaining -= 1;
    } else {
        gameState.remaining += 1;
    }
    let remainingEl = document.querySelector(".game-info > .remaining");
    remainingEl.innerHTML = `<span>${gameState.remaining}</span>`;
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

