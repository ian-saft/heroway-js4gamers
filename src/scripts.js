
const TILE_SIZE = 48;
const HELMET_OFFSET = 12;
const GAME_SIZE = TILE_SIZE * 20;

const root = document.documentElement;
root.style.setProperty('--tile-size', `${TILE_SIZE}px`);
root.style.setProperty('--helmet-offset', `${HELMET_OFFSET}px`);
root.style.setProperty('--game-size', `${GAME_SIZE}px`);


function createBoard() {

    const boardElement = document.getElementById('board')

    function createElement(options) {
        let { item , top , left} = options;

        const htmlElement = document.createElement('div');
        htmlElement.className  = item;
        htmlElement.style.top  = `${top}px`
        htmlElement.style.left = `${left}px`

        boardElement.appendChild(htmlElement)

        function getNewDirection(buttonPressed) {
            switch (buttonPressed) {
                case 'ArrowUp':
                    return { top: top - TILE_SIZE , left: left };
                case 'ArrowRight':
                    return { top: top , left: left + TILE_SIZE };
                case 'ArrowDown':
                    return { top: top + TILE_SIZE , left: left };
                case 'ArrowLeft':
                    return { top: top , left: left - TILE_SIZE };
                default:
                    return { top: top , left: left};
            }
        }
    
        function move(buttonPressed) {
    
            const newDirection = getNewDirection(buttonPressed);
            htmlElement.style.top  = `${newDirection.top}px`;
            htmlElement.style.left = `${newDirection.left}px`;
    
            top  = newDirection.top;
            left = newDirection.left;
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

    function createTrap(options) {
        createElement({
            item: 'trap',
            top: options.top,
            left: options.left
        })
    }

    return { 
        createHero: createHero,
        createDemon: createDemon,
        createTrap: createTrap
    }
}

const board = createBoard();

board.createHero({ top: 16 * TILE_SIZE, left: 2 * TILE_SIZE});
board.createDemon({ top: 16 * TILE_SIZE, left: 7 * TILE_SIZE});
board.createTrap({ top: 16 * TILE_SIZE, left: 8 * TILE_SIZE});
