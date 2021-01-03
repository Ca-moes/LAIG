# LAIG 2020/2021 - TP3

## Group: T07G08

| Name                            | Number    | E-Mail               |
| ------------------------------- | --------- | -------------------- |
| André Daniel Alves Gomes        | 201806224 | up201806224@fe.up.pt |
| Gonçalo André Carneiro Teixeira | 201806562 | up201806562@fe.up.pt |

----

## Project information

We won't be presenting detailed information here, as every meaningful method in our project is documented.

- **Strong Points**
    - Regarding Code, our project was developed to respect certain design patterns such as State Pattern,
      making the development simpler and structured as a game often depends on States;
    - We give the user a lot of custom options, such as colors, type of animations, speed of animations,
      type of model to use on the pieces, different scenarios, etc.
    - Bots' Difficulty can be changed even after the game has already started.
    - The prolog connection is done asynchronously. On some browsers if the connection was done synchronously
      it would stop to display the scene, or it would stop the interaction when a request was being made.
  

- **Scenes**
    - **[Space](scenes/space.xml)**  
      A space-like scene with 2 animated planets, skybox and a light representing the Sun.
    - **[Izakaya](scenes/izakaya.xml)**  
      Our scene for TP2, simplified for this project as some elements were no visible.
    - **[Room](scenes/room.xml)**  
      A scene with a room, a suspended table with 4 candles with lights associated.
    - **[Test](scenes/test.xml)**  
      An empty scene, so the user can focus on the game board and game characteristics.
      

- **Models**
    - [Box](models/box.obj) model for the auxiliary board;
    - [Default](models/default_piece.obj) piece model;
    - [Donut](models/donut_chip_piece.obj) piece model;
    - [Flat](models/flat_chip_piece.obj) piece model;
    - [Round](models/round_chip_piece.obj) piece model;
    [manifest](models/manifest.xml) has our models declared.
      

- **Shaders**
    - **Highlight Option Shader** ([vertex shader](shaders/highlightoption.vert) & [fragment shader](shaders/highlightoption.frag))  
      This shader was useful to highlight the option selected on the Menu. The shader replaces the color with white, and
      fills a rectangular border around the option.
    - **Loading Shader** ([vertex shader](shaders/loading.vert) & [fragment shader](shaders/loading.frag))  
      This shader fills a progress bar on the Loading Screen, the progress status has a message in the format 
      "Loading scene.xml", and the progress bar is related to the ratio between loaded components, and the total
      components to be loaded.
    - **Tile Highlight Shader** ([vertex shader](shaders/tilehighlighting.vert) & [fragment shader](shaders/tilehighlighting.frag))  
      This shader highlights a tile depending on the color passed by uniform value. The color can be red, blue or green. Fun fact,
      our shader also changes the color over time, but we made the difference very small to be noticed,
      this can be easily changed on the fragment shader to see the color being changed over time.
      

- **Easing Functions**  
    We have used many easing functions on our project for the movements and the camera animation, this can be changed
    on the interface. The easing functions used were adapted from [here](https://easings.net/) and can be found on our
    code [here](Animation.js).


- **Extra Algorithm**  
    Has described on our User's Guide, our game consists on opening a path of empty tiles from on side to the opposite 
    side. Although the prolog program can determinate if the game as reached its end, it cannot find a winning path, 
    this was not very user-friendly because we were alerting the users of the game over event but that couldn't be 
    seen. To "fix" this, we have developed a maze-solver algorithm, very much alike algorithms we've learned on
    Algorithms Design and Analysis last Semester. The algorithm is not as smart as it could potentially be, but it serves
    its purpose, and it's relatively fast.  
    The result was a green path of the solution found by the algorithm.