
const TILE_SIZE = 48;
const HELMET_OFFSET = 12;
const GAME_SIZE = TILE_SIZE * 20;

const root = document.documentElement;
root.style.setProperty('--tile-size', `${TILE_SIZE}px`);
root.style.setProperty('--helmet-offset', `${HELMET_OFFSET}px`);
root.style.setProperty('--game-size', `${GAME_SIZE}px`);


function createBoard() {

    const boardElement = document.getElementById('board')
    const elements = [];

    function createElement(options) {
        let { item , top , left} = options;

        const currentElement = { item , currentPosition: { top , left }};
        elements.push(currentElement);

        const htmlElement = document.createElement('div');
        htmlElement.className  = item;
        htmlElement.style.top  = `${top}px`
        htmlElement.style.left = `${left}px`

        boardElement.appendChild(htmlElement)
        
        function getNewDirection(buttonPressed, position) {
            switch (buttonPressed) {
                case 'ArrowUp':
                    return { top: (position.top - TILE_SIZE) , left: position.left };
                case 'ArrowRight':
                    return { top: position.top , left: (position.left + TILE_SIZE) };
                case 'ArrowDown':
                    return { top: (position.top + TILE_SIZE) , left: position.left };
                case 'ArrowLeft':
                    return { top: position.top , left: (position.left - TILE_SIZE) };
                default:
                    return { top: position.top , left: position.left};
            }
        }

        function getElementConflict(position, els) {
            const conflictItem = els.find((el) => {
                return (
                    el.currentPosition.top === position.top &&
                    el.currentPosition.left === position.left
                )
            });

            return conflictItem;
        }

        function validateConflicts(currentEl, conflictItem) {

            function finishGame(message) {
                alert(message);
                location.reload();
            }

            if (currentEl.item === 'hero'){
                if (conflictItem?.item === 'mini-demon' || conflictItem?.item === 'trap') {
                    finishGame('YOU DIE!');
                }
                if (conflictItem?.item === 'chest') {
                    finishGame('YOU WIN!');
                }
            }
            if (currentEl.item === 'mini-demon' && conflictItem?.item === 'hero') {
                finishGame('YOU DIE!');
            }
        }
        
        function validateMovimente(position, conflictItem) {
            
            return (
                position.left >= 24 &&
                position.left <= 864 &&
                position.top >= 96 &&
                position.top <= 816 &&
                conflictItem?.item !== 'forniture'
            )
        }

        function move(buttonPressed) {
    
            const newPosition = getNewDirection(buttonPressed, currentElement.currentPosition);
            const conflictItem = getElementConflict(newPosition, elements);
            const isValidMoviment = validateMovimente(newPosition, conflictItem);

            if (isValidMoviment) {
                currentElement.currentPosition.top  = newPosition.top;
                currentElement.currentPosition.left = newPosition.left;
                htmlElement.style.top  = `${newPosition.top}px`;
                htmlElement.style.left = `${newPosition.left}px`;
                validateConflicts(currentElement, conflictItem);
            }
        }

        return { move };
    }

    function createHero(options) {
        const hero = createElement({
            item: 'hero',
            top: options.top,
            left: options.left
        })

        document.addEventListener('keydown', (event) => {
            hero.move(event.key);
        })
    }

    function createDemon(options) {
        const demon = createElement({
            item: 'mini-demon',
            top: options.top,
            left: options.left
        })

        setInterval(() => {
            const direction = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
            const randownIndex = Math.floor(Math.random() * direction.length);
            const randowDirection = direction[randownIndex];

            demon.move(randowDirection);
        }, 1000)
    }

    return { 
        createElement: createElement,
        createHero: createHero,
        createDemon: createDemon,
    }
}

const board = createBoard();


const startHeroPosition = { top: 16 , left: 2};

board.createHero({ top: startHeroPosition.top * TILE_SIZE, left: startHeroPosition.left * TILE_SIZE});

const fPositions = {
    f0: { top: 17 , left: 2 },
    f1: { top: 2 , left: 3 },
    f2: { top: 2 , left: 8 },
    f3: { top: 2 , left: 16 },
}

board.createElement({ item: 'forniture' , top: fPositions.f0.top * TILE_SIZE , left: fPositions.f0.left * TILE_SIZE});
board.createElement({ item: 'forniture' , top: fPositions.f1.top * TILE_SIZE , left: fPositions.f1.left * TILE_SIZE});
board.createElement({ item: 'forniture' , top: fPositions.f2.top * TILE_SIZE , left: fPositions.f2.left * TILE_SIZE});
board.createElement({ item: 'forniture' , top: fPositions.f3.top * TILE_SIZE , left: fPositions.f3.left * TILE_SIZE});


let occupiedPositions = [
    startHeroPosition,
    fPositions.f0,
    fPositions.f1,
    fPositions.f2,
    fPositions.f3
]


function randowStartPosition() {

    function validadePosition(top, left, positions) {
        return true;
    }

    let top  = 0;
    let left = 0;
    let validatedPosition = false;

    while (top < 2 || top > 17 || left < 1 || left > 18 || validatedPosition === false) {
        top  = Math.floor(Math.random() * 17);
        left = Math.floor(Math.random() * 18);

        validatedPosition = validadePosition(top, left, occupiedPositions);
    }
    const randownPosition = { top: top , left: left };
    console.log(randownPosition);
    return randownPosition;
}

const chestPosition = randowStartPosition(occupiedPositions);

board.createElement({item: 'chest' , top: chestPosition.top * TILE_SIZE, left: chestPosition.left * TILE_SIZE});


// Demons:
function createAllDemons(amountOfDemons) {
    let i = 0;
    while (i < amountOfDemons) {

        const demonPosition = randowStartPosition(occupiedPositions);
        occupiedPositions.push(demonPosition);
        board.createDemon({ top: demonPosition.top * TILE_SIZE, left: demonPosition.left * TILE_SIZE});
        i = i + 1;
    }
}

createAllDemons(10);

// Traps:
function createAllTraps(amountOfTraps) {
    let i = 0;
    while (i < amountOfTraps) {

        const trapPosition = randowStartPosition(occupiedPositions);
        occupiedPositions.push(trapPosition);
        board.createElement({ item: 'trap' , top: trapPosition.top * TILE_SIZE, left: trapPosition.left * TILE_SIZE});
        i = i + 1;
    }
}

createAllTraps(20);

