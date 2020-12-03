% -------------------------------------- Knowledge --------------------------------------
initial([
  [ 1,-1, 1,-1, 1,-1],
  [-1, 1,-1, 1,-1, 1],
  [ 1,-1, 1,-1, 1,-1],
  [-1, 1,-1, 1,-1, 1],
  [ 1,-1, 1,-1, 1,-1],
  [-1, 1,-1, 1,-1, 1]
]).
initial([
  [ 1, 0, 1, 0, 1, 0, 1, 0],
  [ 0,-1, 0,-1, 0,-1, 0,-1],
  [ 1, 0, 1, 0, 1, 0, 1, 0],
  [ 0,-1, 0,-1, 0,-1, 0,-1],
  [ 1, 0, 1, 0, 1, 0, 1, 0],
  [ 0,-1, 0,-1, 0,-1, 0,-1],
  [ 1, 0, 1, 0, 1, 0, 1, 0],
  [ 0,-1, 0,-1, 0,-1, 0,-1]
]).



% Pieces codes for each player
player_piece('Player1', 1).
player_piece('Player2', -1).


% value_in_board(+Board, +X, +Y, -Value)
% returns in Value the value [0,1,-1] at (X,Y) from Board
value_in_board(Board, X, Y, Value):-
    nth0(Y, Board, Row),
    nth0(X, Row, Value).

% player_in_board(+Board, +X, +Y, -PlayerS)
% returns in Player a string representing the player or fails if space is empty.
player_in_board(Board, X, Y, PlayerS):-
  value_in_board(Board, X, Y, Value),
  player_piece(PlayerS, Value).

% opposed_opponent_code(+PlayerS, -Code)
% Code takes opposed player code
opposed_opponent_code(PlayerS, Code):-
    player_piece(PlayerS, Piece),
    Code is -Piece.

% opposed_opponent_string(+PlayerS, -EnemyS)
% EnemyS returns the string of the enemy of PlayerS
opposed_opponent_string(PlayerS, EnemyS):-
    opposed_opponent_code(PlayerS, Code),
    player_piece(EnemyS, Code).

% size_of_board(+Board, -X)
% returns in X the size of the Square Board. Does not accept Rectangular Boards
size_of_board(Board, X):-
    nth0(0, Board, Header),
    length(Header, X),
    length(Board, Y),
    X == Y. % check if board is nxn and not nxm

% direction(+X, +Y, +Direction, -Xr, -Yr)
% get position in direction, doesn't check range, can get out of board
direction(X-Y, 'up', Xr-Yr):-     Xr = X,     Yr is Y-1.
direction(X-Y, 'right', Xr-Yr):-  Xr is X+1,  Yr = Y.
direction(X-Y, 'down', Xr-Yr):-   Xr = X,     Yr is Y+1.
direction(X-Y, 'left', Xr-Yr):-   Xr is X-1,  Yr = Y.

% Codes for board rows
row(0, 'A').
row(1, 'B').
row(2, 'C').
row(3, 'D').
row(4, 'E').
row(5, 'F').
row(6, 'G').
row(7, 'H').
row(8, 'I').
row(9, 'J').

% -------------------------------------- Predicates --------------------------------------

% validate_choice(+Board, +Xread, +Yread, +PlayerS)
% check if selected piece belongs to player
validate_choice(Board, Xread, Yread, PlayerS):-
    value_in_board(Board, Xread, Yread, Value),
    player_piece(PlayerS, Piece),
    Piece == Value.


% available_dirs(+Board, +X, +Y, +PlayerS, -List)
% returns in Lists the numbers of the directions available to go
available_dirs(Board, X, Y, PlayerS, List):-
  %needs to check all 4 directions
  check_dir(Board, X, Y, PlayerS, 'up', ListItem1), append([], ListItem1, PreList1),
  check_dir(Board, X, Y, PlayerS, 'right', ListItem2), append(PreList1, ListItem2, PreList2),
  check_dir(Board, X, Y, PlayerS, 'down', ListItem3), append(PreList2, ListItem3, PreList3),
  check_dir(Board, X, Y, PlayerS, 'left', ListItem4), append(PreList3, ListItem4, List), !.

dirs_to_spots([], _, []).
dirs_to_spots([Dir|Rest], X-Y, [[Xf,Yf]|TempListSpots]):-
  direction(X-Y, Dir, Xf-Yf),
  dirs_to_spots(Rest, X-Y, TempListSpots).

% check_dir(+Board, +X, +Y, +PlayerS, +Direction, -ResultList)
% Checks if there is an enemy piece on the 'up' direction
check_dir(Board, X, Y, PlayerS, 'up', ['up']):-
    opposed_opponent_code(PlayerS, ExpectedCode),
    Y > 0, Y1 is Y-1, value_in_board(Board, X, Y1, Value), Value==ExpectedCode.
% Checks if there is an enemy piece on the 'right' direction
check_dir(Board, X, Y, PlayerS, 'right', ['right']):-
    size_of_board(Board, Size),
    opposed_opponent_code(PlayerS, ExpectedCode),
    X < Size, X1 is X+1, value_in_board(Board, X1, Y, Value), Value==ExpectedCode.
% Checks if there is an enemy piece on the 'down' direction
check_dir(Board, X, Y, PlayerS, 'down', ['down']):-
    size_of_board(Board, Size),
    opposed_opponent_code(PlayerS, ExpectedCode),
    Y < Size, Y2 is Y+1, value_in_board(Board, X, Y2, Value), Value==ExpectedCode.
% Checks if there is an enemy piece on the 'left' direction
check_dir(Board, X, Y, PlayerS, 'left', ['left']):-
    opposed_opponent_code(PlayerS, ExpectedCode),
    X > 0, X2 is X-1, value_in_board(Board, X2, Y, Value), Value==ExpectedCode.
% returns a empty list in case of a wrong direction
check_dir(_, _, _, _, _, []).

% replace_index(+I, +L, +E, -K)
% replaces Element E in List L at Index I, Resulting in List K
replace_index(I, L, E, K) :-
    nth0(I, L, _, R),
    nth0(I, K, E, R).

% replace(+Board, +X, +Y, +Value, -BoardResult)
% replaces a value in the board
replace(Board, X, Y, Value, BoardResult):-
    %usar substitute(+X, +Xlist, +Y, ?Ylist)
    nth0(Y, Board, Row),
    replace_index(X, Row, Value, NewRow),
    replace_index(Y, Board, NewRow, BoardResult).

% -------------------------------------- Bots --------------------------------------

% choose_move(+GameState, +Player, +Level, -Move)
% Returns a Move after evaluating all the GameStates possible caused by all the available moves
% For the Easy Difficulty the move is chosen randomly
choose_move(GameState, Player, 'Easy', X-Y-Direction):-
  valid_moves(GameState, Player, List),
  random_member(Value, List),
  nth0(0, Value, X),
  nth0(1, Value, Y),
  nth0(2, Value, Direction).
% For the Normal Difficulty the move is chosen according to the value predicate
choose_move(GameState, Player, 'Normal', X-Y-Direction):-  
  valid_moves(GameState, Player, List),
  findall(
    Value1-X1-Y1-Direction1-Index,
    (
    nth0(Index, List, SubList), 
    nth0(0, SubList, X1),
    nth0(1, SubList, Y1),
    nth0(2, SubList, Direction1),
    move_dir(GameState, X1-Y1-Direction1, NewGameState),
    value(NewGameState, Player, Value1)
    ),
    ListResults
  ),
  sort(ListResults, Sorted), last(Sorted, _-X-Y-Direction-_).

% choose_remove(+GameState, +Player, +Level, -Move)
% Returns a Remove after evaluating all the GameStates possible caused by all the available removes
% For the Easy Difficulty the remove is chosen randomly
choose_remove(GameState, Player, 'Easy', X-Y):-
  valid_removes(GameState, Player, List),
  random_member(Value, List),
  nth0(0, Value, X),
  nth0(1, Value, Y).
% For the Normal Difficulty the remove is chosen according to the value predicate
choose_remove(GameState, Player, 'Normal', X-Y):-
  valid_removes(GameState, Player, List),
  findall(
    Value1-X1-Y1-Index,
    (
      nth0(Index, List, SubList), 
      nth0(0, SubList, X1),
      nth0(1, SubList, Y1),
      replace(GameState, X1, Y1, 0, NewGameState),
      value(NewGameState, Player, Value1)
    ),
    ListResults
    ),
  sort(ListResults, Sorted), 
  reverse(Sorted, [_-X-Y-_|_]).

% value(+GameState, +Player, -Value)
% For the Player 2, we can use the value function for the Player 1, given as the argument the transposed matrix
value(GameState, 'Player2', Value):-
  transpose(GameState, Transpose),
  value(Transpose, 'Player1', Value).
% In-Depth explanation : https://github.com/Ca-moes/feup-plog-proj/issues/19
value(GameState, 'Player1', Value):-
  value_part_1(GameState, List),
  value_part_2(GameState, List, ReturnList),
  max_member(Value, ReturnList), !.

% value_part_1(+GameState, -List)
% Returns a List containing Positions to FloodFill, starts to analyze at position (0,0)
value_part_1(GameState, List):-
  value_part_1(GameState, 0, 0, List).
% if it's the last cell and its empty, neither the top nor left cell are empty, meaning list has a value.
% No need to do floodfill cause there's only 1 cell to fill
value_part_1(GameState, X, Y, [Size1-Size1]):-
  size_of_board(GameState, Size), check_end(X, Y, Size),
  value_in_board(GameState, X, Y, 0),
  Size1 is Size-1.
% if it's the last cell and it's not empty, returns list as empty
value_part_1(GameState, X, Y, []):-
  size_of_board(GameState, Size), check_end(X, Y, Size).
% if searh is not at end and value of cell is 0, saves the position to append to the result and goes to next position
value_part_1(GameState, X, Y, List):-
  value_in_board(GameState, X, Y, 0), 
  size_of_board(GameState, Size),
  floodFill(GameState, Size, X, Y, 0, 9, NewGS),
  next_index(X, Y, Size, X2, Y2),
  value_part_1(NewGS, X2, Y2, Result),
  append(Result, [X-Y], List).
% if searh is not at end and value is != 0, goes to next position
value_part_1(GameState, X, Y, List):-
  size_of_board(GameState, Size),
  next_index(X, Y, Size, X2, Y2),
  value_part_1(GameState, X2, Y2, List).

% value_part_2(+GameState, +List, -ReturnList)
% Base Case: No more Positions to analyze
value_part_2(_, [], []).
% Gets a position to floodFill, the amount of fill characters per column in a list, the value of the patch and calls itself with the next position
value_part_2(GameState, [X-Y|Rest], ReturnList):-
  attemp_flood_fill(GameState, X, Y, NewGS),
  values_in_all_columns(NewGS, 9, ListResult),
  sequence(ListResult, TempValue),
  value_part_2(GameState, Rest, TempReturnList),
  append(TempReturnList, [TempValue], ReturnList).

% values_in_all_columns(+GameState, +Value, -ListResult)
% with a Board and a value returns a list (eg. [4,3,4,3,0,0]) with amount of characters Value in all Columns
% Starts at the end of the board with Index Size-1
values_in_all_columns(GameState, Value, ListResult):-
  size_of_board(GameState, Size), Size1 is Size-1,
  values_in_all_columns(GameState, Value, Size1, ListResult).
% values_in_all_columns(+GameState, +Value, +Index, -ListResult)
% Base Case: When Index reaches -1 returns a empty List to be appended with results.
values_in_all_columns(_, _, -1, []).
% Gets the amount of one columns ans goes to next column.
values_in_all_columns(GameState, Value, Index, Result):-
  values_in_column(GameState, Index, Value, ValueResult),
  Index1 is Index-1,
  values_in_all_columns(GameState, Value, Index1, TempResult),
  append(TempResult, [ValueResult], Result).

% values_in_column(+GameState, +X, +Value, -Amount)
% returns the Amount of cells with Value in column X
values_in_column(GameState, X, Value, Amount):-
  get_column(GameState, X, Column),
  count(Value, Column, Amount).

% sequence(+List, -Result)
% Given a List finds the biggest sequence formed by numbers diferent from 0, starts with Counter 0 and MaxLenght 0
sequence(List, Result):-
  sequence(List, 0, 0, Result).
% sequence(+List, +Counter, +MaxLength, -Result)
% Base Case: If there's no more numbers to process and Counter is bigger than MaxLenght, returns Counter
sequence([], Counter, MaxLength, Counter):-
  Counter > MaxLength.
% Base Case: If there's no more numbers to process and MaxLenght is bigger than Counter, returns MaxLength
sequence([], _, MaxLength, MaxLength).
% If the number is zero and the current sequence is bigger than the one so far, then MaxLength takes the Counter value
sequence([ToTest|Rest], Counter, MaxLength, Result):-
  ToTest == 0, Counter > MaxLength, 
  sequence(Rest, 0, Counter, Result).
% If the number is zero and the current sequence isn't bigger than the one so far, then MaxLength keeps the same value
sequence([ToTest|Rest], _, MaxLength, Result):-
  ToTest == 0, 
  sequence(Rest, 0, MaxLength, Result).
% if the number is not 0, increments Counter by 1
sequence([_|Rest], Counter, MaxLength, Result):-
  Counter1 is Counter+1,
  sequence(Rest, Counter1, MaxLength, Result).

% valid_removes(+GameState, +PlayerS, -List)
% will check the removes for every spot, starting ar 0,0
valid_removes(GameState, PlayerS, List):-
  check_spot_remove(GameState, 0, 0, PlayerS, List).

% check_spot_remove(+GameState, +X, +Y, +Player, -ReturnList)
% if check_end returns true, then Returns a empty List to be appended
check_spot_remove(GameState, X, Y, _, []):-
  size_of_board(GameState, Size),
  check_end(X, Y, Size).
% if not at the end, and the player in board is the current player, then saves spot and calls itself with next position
check_spot_remove(GameState, X, Y, Player, ReturnList):-
  player_in_board(GameState, X, Y, Player),
  size_of_board(GameState, Size),
  next_index(X, Y, Size, X1, Y1),
  check_spot_remove(GameState, X1, Y1, Player, TempReturnList),
  append(TempReturnList, [[X, Y]], ReturnList).
% if not the end of the board, checks next position
check_spot_remove(GameState, X, Y, Player, ReturnList):-
  size_of_board(GameState, Size),
  next_index(X, Y, Size, X1, Y1),
  check_spot_remove(GameState, X1, Y1, Player, ReturnList).

% valid_moves(+GameState, +PlayerS, -List)
% will check the moves for every spot, starting ar 0,0
valid_moves(GameState, PlayerS, List):-
  check_spot(GameState, 0, 0, PlayerS, List).
  
% check_spot(+GameState, +X, +Y, +Player, -ReturnList)
% if spot belongs to player, checks directions and if list is empty -> next spot
% Base Case: Last Spot and Spot Belongs to Player, There're available plays
check_spot(GameState, X, Y, Player, ReturnList):-
  size_of_board(GameState, Size), check_end(X, Y, Size),
  player_in_board(GameState, X, Y, Player),
  available_dirs(GameState, X, Y, Player, TempList), TempList \= [],
  create_sublist(X, Y, TempList, ReturnList).
% Base Case: Last Spot and Spot Belongs to Player, There're no available plays OR last spot and doesn't belong to player. Returns empty list 
check_spot(GameState, X, Y, _, []):-
  size_of_board(GameState, Size), check_end(X, Y, Size).
% if the spot belongs to player and there are directions available, saves the sublist created and calls itself with next position
check_spot(GameState, X, Y, Player, ReturnList):-
  player_in_board(GameState, X, Y, Player),
  available_dirs(GameState, X, Y, Player, TempList), TempList \= [],
  create_sublist(X, Y, TempList, Result),
  size_of_board(GameState, Size),
  next_index(X, Y, Size, X1, Y1),
  check_spot(GameState, X1, Y1, Player, TempReturnList),
  append(TempReturnList, Result, ReturnList).
% if not the end of the board, checks next spot
check_spot(GameState, X, Y, Player, ReturnList):-
  size_of_board(GameState, Size),
  next_index(X, Y, Size, X1, Y1),
  check_spot(GameState, X1, Y1, Player, ReturnList).

% create_sublist(+X, +Y, +ListDirs, -Result)
% from a position and a list of directions, creates options in the format [[X, Y, 'dir1'], [X, Y, 'dir2']]
create_sublist(X, Y, [Dir|Rest], Result):-
  NewList = [[X, Y, Dir]],
  create_sublist(X, Y, Rest, PreviousResult),
  append(PreviousResult, NewList, Result).
create_sublist(_, _, [], []).

% next_index(+X, +Y, +Length, -X2, -Y2)
% gets next index and verifies if reached end of Row,  in that case switches to the next row
next_index(X, Y, Length, X2, Y2):-
  X1 is X + 1,
  X1 \== Length,
  X2 is X1, 
  Y2 is Y.
next_index(X, Y, Length, X2, Y2):-
  X1 is X + 1,
  X1 == Length, 
  X2 is 0,
  Y2 is Y + 1.

% check_end(+X, +Y, +Length)
% used before calling next_index to check if current position is the last in the board
check_end(X, Y, Length):-
  X is (Length - 1),
  Y is (Length - 1).

% does one floodfill and doesn't repeat on redo
attemp_flood_fill(Board, X, Y, NewBoard):-
  size_of_board(Board, Size),
  floodFill(Board, Size, X, Y, 0, 9, NewBoard), !.
% prolog implementation of the floodFill algorithm
floodFill(Board, BoardSize, X, Y, PrevCode, NewCode, FinalBoard):-
  X >= 0, X < BoardSize, Y >= 0, Y < BoardSize,
  value_in_board(Board, X, Y, PrevCode),
  replace(Board, X, Y, NewCode, BoardResult), % replaces PrevCode by NewCode
  X1 is X+1, X2 is X-1, Y1 is Y+1, Y2 is Y-1,
  floodFill(BoardResult, BoardSize, X1, Y, PrevCode, NewCode, T1) ,
  floodFill(T1, BoardSize, X2, Y, PrevCode, NewCode, T2) ,
  floodFill(T2, BoardSize, X, Y1, PrevCode, NewCode, T3) ,  
  floodFill(T3, BoardSize, X, Y2, PrevCode, NewCode, FinalBoard).
% if initial floodfill returns from every direction, returns the initial board
floodFill(Board, _, _, _, _, _, Board).

% move(+GameState, +X-Y-Direction, -NewGameState)
%  performs the change in the board, replaces current piece with 0 and enemy piece with player code
move_dir(GameState, X-Y-Direction, NewGameState):-
  value_in_board(GameState, X, Y, Code),
  replace(GameState, X, Y, 0, Board1),
  direction(X-Y, Direction, X1-Y1),
  replace(Board1, X1, Y1, Code, NewGameState).

% get_row(+GameState, +Y, -Row)
% Returns a list in Row corresponding to the Row in the Y index
get_row(GameState, Y, Row):-
  nth0(Y, GameState, Row).
% get_column(+GameState, +X, -Column)
% Returns a list in Column corresponding to the Column in the X index
get_column(GameState, X, Column):-
  transpose(GameState, Transpose),
  get_row(Transpose, X, Column).

% count(+Num,+List, -X)
% Returns in X the amount of Num in List
count(_, [], 0).
count(Num, [H|T], X) :- Num \= H, count(Num, T, X).
count(Num, [H|T], X) :- Num = H, count(Num, T, X1), X is X1 + 1.


% -------------------------------------- Final --------------------------------------


% game_over(+GameState, +Player , -Winner)
% checks first if enemy is winner
game_over(GameState, CurrentPlayer, EnemyS):-
  size_of_board(GameState, Size), 
  opposed_opponent_string(CurrentPlayer, EnemyS),
  check_win(EnemyS, GameState, Size).
% then checks if player is the winner
game_over(GameState, CurrentPlayer, CurrentPlayer):-
  size_of_board(GameState, Size),
  check_win(CurrentPlayer, GameState, Size).
% in case there is no winner, 'none' is returned
game_over(_, _, 'none').

% check_win(+PlayerS, +GameState, +K, -Result)
% to check the win for Player 1, we can check the win for Player 1 with the transposed matrix
check_win('Player2', GameState, X):-
  transpose(GameState, Transpose),
  check_win('Player1', Transpose, X).

check_win('Player1', GameState, Size):-
  value(GameState, 'Player1', Value),
  Value == Size.

% check_final_p(+GameState, +PlayerS)
% Predicate to check if the game as reached its final state (i.e. starting to remove pieces)
check_final_p(GameState, PlayerS):-
  check_final_state(GameState, PlayerS, 0, 0).

% check_final_state(+GameState, +PlayerS, +X, +Y)
/* predicate to check if game as reached its final state */
% if check_no_neightbors returs 0, ends predicate   
check_final_state(GameState, PlayerS, X, Y):-
    value_in_board(GameState, X, Y, Value),
    check_no_neighbors(GameState, PlayerS, X, Y, Value, 0), !, fail.
% check_no_neighbors returned 1, there are not directions available, checking if reached end of board
% if reached end of board, then returns, else fails and continues to next predicate
check_final_state(GameState, _, X, Y):-
    size_of_board(GameState, Length),
    check_end(X, Y, Length).
% checks if next position has directions available
check_final_state(GameState, PlayerS, X, Y):-
    size_of_board(GameState, Length),
    next_index(X, Y, Length, X2, Y2),
    check_final_state(GameState, PlayerS, X2, Y2).

% check_no_neighbors(+Board, +PlayerS, +X, +Y, +Value, -Return)
% checks if there are directions available, if the list is empty goes to next predicate, else return is 0
check_no_neighbors(Board, PlayerS, X, Y, Value, 0):-
  player_piece(PlayerS, Value),
  available_dirs(Board, X, Y, PlayerS, [_]).
% if list of directions is empty, returns 1
check_no_neighbors(Board, PlayerS, X, Y, Value, 1):-
  player_piece(PlayerS, Value),
  available_dirs(Board, X, Y, PlayerS, []).
% if the player piece is different from the value on the board, no need to check for directions
check_no_neighbors(_, _, _, _, _, 1).

player_to_int('Player1', 1).
player_to_int('Player2', -1).
player_to_int('none', 0).