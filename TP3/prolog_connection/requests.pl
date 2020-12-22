test:-
    check_winner([[1,-1,1,-1,1,-1],[0,0,0,0,0,0],[1,-1,1,-1,1,-1],[-1,1,-1,1,-1,1],[1,-1,1,-1,1,-1],[-1,1,-1,1,-1,1]],'Player1', List),
    write(List).

% -------------------------------------- Player --------------------------------------

/** 
 * Returns a List in the format [X-Y, X-Y] containing the locations to where the player can move
 * 
 * GameState - [[],[],[]]
 * Player - 'Player 1'; 'Player 2'
 * X-Y - 0-0, 0-1
*/
available_moves(GameState, Player, X-Y, List):-
    available_dirs(GameState, X, Y, Player, DirsList),
    dirs_to_spots(DirsList, X-Y, List).

/**
 * spot([[1,-1,1,-1,1,-1],[-1,1,-1,1,-1,1],[1,-1,1,-1,1,-1],[-1,1,-1,1,-1,1],[1,-1,1,-1,1,-1],[-1,1,-1,1,-1,1]],'Player1',0-0)
 * Returns 0 if spot belongs to player and has available dirs, 1 otherwise.
 * 
 * GameState - [[],[],[]]
 * Player - 'Player 1'; 'Player 2'
 * X-Y - 0-0, 0-1
*/
spot(GameState, Player, X-Y, 0):-
    validate_choice(GameState, X, Y, Player),
    available_dirs(GameState, X, Y, Player, List), List \== [].
spot(_, _, _, 1).

/**
 * Returns 0 if spot_f belongs to enemy and it's adjacent, 1 otherwise.
 * 
 * GameState - [[],[],[]]
 * Player - 'Player 1'; 'Player 2'
 * X-Y-Xf-Yf - 0-0-0-1, 0-1-1-1
*/
moveto(GameState, Player, X-Y-Xf-Yf, 0):-
    opposed_opponent_string(Player, Enemy),
    validate_choice(GameState, Xf, Yf, Enemy),
    direction(X-Y, _Dir, Xf-Yf).
moveto(_, _, _, 1).

/**
 * Only used when game is in final state
 * Returns 0 if spot belongs to player, 1 otherwise.
 * 
 * GameState - [[],[],[]]
 * Player - 'Player 1'; 'Player 2'
 * X-Y - 0-0, 0-1
*/
spot_remove(GameState, Player, X-Y, 0):-
    validate_choice(GameState, X, Y, Player).
spot_remove(_, _, _, 1).

% -------------------------------------- Bots --------------------------------------

/**
 * Returns List of Lists representing new Board.
 * 
 * Difficulty - 'Easy'; 'Normal'
 * GameState - [[],[],[]]
 * Player - 'Player1'; 'Player2'
*/
make_move(Difficulty, GameState, Player, [[X, Y], [Xr, Yr]]):-
    choose_move(GameState, Player, Difficulty, X-Y-Direction),
    direction(X-Y, Direction, Xr-Yr).

/**
 * Returns List of Lists representing new Board.
 * 
 * Difficulty - 'Easy'; 'Normal'
 * GameState - [[],[],[]]
 * Player - 'Player1'; 'Player2'
*/
make_remove(Difficulty, GameState, Player, [X,Y]):-
    choose_remove(GameState, Player, Difficulty, X-Y).

% -------------------------------------- Final --------------------------------------
/**
 * ! Do not use with initial board, it won't return !
 * Returns 1, -1, 0
 * 
 * GameState - [[],[],[]]
 * Player - 'Player1'; 'Player2'; 'none'
*/
%-------------------
check_winner(GameState, Player, WinnerReturn):-
    game_over(GameState, Player, TempReturn),
    player_to_int(TempReturn, WinnerReturn).

/**
 * Returns 0 if Player can't make any moves, only removes, 1 otherwise.
 * 
 * GameState - [[],[],[]]
 * Player - 'Player 1'; 'Player 2'
*/
check_final(GameState, Player, 0):-
    check_final_p(GameState, Player).
check_final(_, _, 1).

/*

[
[1,0,1,0,1,0],
[0,0,0,0,0,0],
[0,-1,0,-1,0,-1],
[-1,0,-1,0,-1,0],
[0,-1,0,-1,0,-1],
[-1,0,-1,0,-1,0]
]

[[1,0,1,0,1,0],[0,0,0,0,0,0],[0,-1,0,-1,0,-1],[-1,0,-1,0,-1,0],[0,-1,0,-1,0,-1],[-1,0,-1,0,-1,0]]
*/