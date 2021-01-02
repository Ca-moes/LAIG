const Utils = Object.freeze({
    formatTime: (secs) => {
        const minutes = Math.floor(Math.round(secs) / 60);
        const seconds = Math.round(secs) - minutes * 60;

        return str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2)
    },
    getType: (player) => {
        let type
        switch (player.type) {
            case 0:
                type = "Human"
                break
            case 1:
                type = "Bot Easy"
                break
            case 2:
                type = "Bot Normal"
                break
            default:
                break
        }
        return type
    },
    tileToCoords: (tile) => `${String.fromCharCode(65 + tile.y)}${tile.x}`
})

function str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
}

const GraphUtils = Object.freeze({
    toGraph: (board) => {
        let graph = []
        for (let y = 0; y < board.length; y++) {
            let row = []
            for (let x = 0; x < board[y].length; x++) {
                row.push({value: (board[y][x] !== 0) ? -1 : 0, x: x, y: y, visited: false, marked: false})
            }
            graph.push(row)
        }
        return graph
    },
    findPath: (graph, x, y, destination) => {
        if (x >= graph[0].length || x < 0 || y >= graph.length || y < 0) {
            return false;
        }

        if (x === destination.x && y === destination.y) {
            graph[y][x].marked = true;
            return true;
        }

        if (graph[y][x].value !== 0) {
            return false;
        }

        if (graph[y][x].visited)
            return false;
        graph[y][x].visited = true;

        graph[y][x].marked = true;

        if (GraphUtils.findPath(graph, x + 1, y, destination) === true) {
            return true;
        }
        if (GraphUtils.findPath(graph, x, y + 1, destination) === true) {
            return true;
        }
        if (GraphUtils.findPath(graph, x - 1, y, destination) === true) {
            return true;
        }
        if (GraphUtils.findPath(graph, x, y - 1, destination) === true) {
            return true;
        }

        graph[y][x].marked = false;

        return false;
    },
    getPath: (graph) => {
        let solution = []
        let pathSize = 0
        for (let y = 0; y < graph.length; y++) {
            let row = []
            for (let x = 0; x < graph[0].length; x++) {
                row.push(graph[y][x].marked)
                if (graph[y][x].marked) {
                    pathSize++
                }
            }
            solution.push(row)
        }
        return {solution: solution, size: pathSize}
    },
    findPathPlayer1: (board) => {
        let solutions = []
        for (let y0 = 0; y0 < board.length; y0++) {
            for (let y1 = 0; y1 < board[0].length; y1++) {
                let graph = GraphUtils.toGraph(board)
                if (graph[y0][0].value !== 0 || graph[y1][graph.length - 1].value !== 0)
                    continue
                if (GraphUtils.findPath(graph, 0, y0, graph[y1][graph.length - 1]))
                    solutions.push(GraphUtils.getPath(graph))
            }
        }
        if (solutions.length === 0) return null
        let solution = solutions[0]
        for (let i = 0; i < solutions.length; i++)
            if (solutions[i].size < solution.size)
                solution = solutions[i]
        return solution.solution
    },
    findPathPlayer2: (board) => {
        let solutions = []
        for (let x0 = 0; x0 < board.length; x0++) {
            for (let x1 = 0; x1 < board[0].length; x1++) {
                let graph = GraphUtils.toGraph(board)
                if (graph[0][x0].value !== 0 || graph[graph.length - 1][x1].value !== 0)
                    continue
                if (GraphUtils.findPath(graph, x0, 0, graph[graph.length - 1][x1]))
                    solutions.push(GraphUtils.getPath(graph))
            }
        }
        if (solutions.length === 0) return null
        let solution = solutions[0]
        for (let i = 0; i < solutions.length; i++)
            if (solutions[i].size < solution.size)
                solution = solutions[i]
        return solution.solution
    }
})

class CustomLogging {
    constructor(title) {
        this.title = {
            body: title || "---",
            color: "darkgrey",
            size: "1rem"
        };

        this.body = {
            color: "#008f68",
            size: "1rem"
        };
    }

    setTitleStyle({color, size}) {
        if (color !== undefined) this.title.color = color;
        if (size !== undefined) this.title.size = size;
    }

    setBodyStyle({color, size}) {
        if (color !== undefined) this.body.color = color;
        if (size !== undefined) this.body.size = size;
    }

    logStateChanged(state) {
        console.log(
            `%cChanged State: %c${state}`,
            `font-weight: bold; font-size: ${
                this.title.size
            };`,
            `color: blue; font-weight: bold; font-size: ${
                this.body.size
            }; text-shadow: 0 0 5px rgba(0,0,0,0.2);`
        );
    }

    logPieceMoved(tile1, tile2) {
        if (tile1 === tile2) {
            console.log(
                `%cPiece Removed: %c${Utils.tileToCoords(tile1)}`,
                `font-weight: bold; font-size: ${
                    this.title.size
                };`,
                `color: blue; font-weight: bold; font-size: ${
                    this.body.size
                }; text-shadow: 0 0 5px rgba(0,0,0,0.2);`
            );
            return
        }

        console.log(
            `%cPiece Moved: %c${Utils.tileToCoords(tile1)} to %c${Utils.tileToCoords(tile2)}`,
            `font-weight: bold; font-size: ${
                this.title.size
            };`,
            `color: blue; font-weight: bold; font-size: ${
                this.body.size
            }; text-shadow: 0 0 5px rgba(0,0,0,0.2);`,
            `color: blue; font-weight: bold; font-size: ${
                this.body.size
            }; text-shadow: 0 0 5px rgba(0,0,0,0.2);`
        );
    }

    extraInfo(body) {
        console.log(
            `%c-- | %c${body}`,
            `color: ${this.title.color}; font-weight: bold; font-size: ${
                this.title.size
            };`,
            `font-size: ${
                this.body.size
            }; text-shadow: 0 0 5px rgba(0,0,0,0.2);`
        );
    }

    log(body = "") {
        // the second line is now the body because the first references the content after the first %c for the title
        console.log(
            `%c${this.title.body} | %c${body}`,
            `color: ${this.title.color}; font-weight: bold; font-size: ${
                this.title.size
            };`,
            `color: ${this.body.color}; font-weight: bold; font-size: ${
                this.body.size
            }; text-shadow: 0 0 5px rgba(0,0,0,0.2);`
        );
    }
}