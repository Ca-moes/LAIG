test:-
    initial(GameState),
    available_moves(GameState,'Player1',1-1,List),
    write(List).

% -------------------------------------- Player --------------------------------------

/**
 * to test:
 * available_moves([[1,-1,1,-1,1,-1],[-1,1,-1,1,-1,1],[1,-1,1,-1,1,-1],[-1,1,-1,1,-1,1],[1,-1,1,-1,1,-1],[-1,1,-1,1,-1,1]],'Player1',1-1)
 * 
 * Returns a List in the format [X-Y, X-Y] containing the locations to where the player can move
 * 
 * GameState - [[],[],[]]
 * Player - 'Player 1'; 'Player 2'
 * X-Y - 0-0, 0-1
*/
%-------------------
available_moves(GameState, Player, X-Y, List):-
    available_dirs(GameState, X, Y, Player, DirsList),
    dirs_to_spots(DirsList, X-Y, List).

/**
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
 * Returns List of Lists representing new Board.
 * 
 * GameState - [[],[],[]]
 * X-Y-Xf-Yf - 0-0-0-1, 0-1-1-1
*/
move(GameState, X-Y-Xf-Yf, NewGameState):-
    value_in_board(GameState, X, Y, Code),
    replace(GameState, X, Y, 0, Board1),
    replace(Board1, Xf, Yf, Code, NewGameState).

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

/**
 * Returns List of Lists representing new Board after removing a piece.
 * 
 * GameState - [[],[],[]]
 * X-Y - 0-0, 0-1
*/
remove(GameState, X-Y, NewGameState):-
    replace(GameState, X, Y, 0, NewGameState).

% -------------------------------------- Bots --------------------------------------

/**
 * Returns List of Lists representing new Board.
 * 
 * Difficulty - 'Easy'; 'Normal'
 * GameState - [[],[],[]]
 * Player - 'Player 1'; 'Player 2'
*/
make_move(Difficulty, GameState, Player, NewGameState):-
    choose_move(GameState, Player, Difficulty, X-Y-Direction),
    direction(X-Y, Direction, Xr-Yr),
    move(GameState, X-Y-Xr-Yr, NewGameState).

/**
 * Returns List of Lists representing new Board.
 * 
 * Difficulty - 'Easy'; 'Normal'
 * GameState - [[],[],[]]
 * Player - 'Player 1'; 'Player 2'
*/
make_remove(Difficulty, GameState, Player, NewGameState):-
    choose_remove(GameState, Player, Difficulty, X-Y),
    replace(GameState, X, Y, 0, NewGameState).

% -------------------------------------- Final --------------------------------------
/**
 * ! Do not use with initial board, it won't return !
 * Returns 'Player 1', 'Player 2', 'none'
 * 
 * GameState - [[],[],[]]
 * Player - 'Player 1'; 'Player 2'
*/
%-------------------
check_winner(GameState, Player, WinnerReturn):-
    game_over(GameState, Player, WinnerReturn).

/**
 * Returns 0 if Player can't make any moves, only removes, 1 otherwise.
 * 
 * GameState - [[],[],[]]
 * Player - 'Player 1'; 'Player 2'
*/
check_final(GameState, Player, 0):-
    check_final_p(GameState, Player).
check_final(_, _, 1).