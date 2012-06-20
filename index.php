<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <script type="text/javascript" src="CanvasParques.js"></script>
        <script type="text/javascript">
            var dado1 = 0; var dado2 = 0; var turno = 0; var playable = false; stopped = false;
            var d1jug = false; d2jug = false; var verifiedLife = false; var contlanzamientos = 0;
            var seguro = false;
            var history = null;
            
			var pdados = [[10, 40], [10, 605], [540, 605], [540, 40]];
            var colors = [/*Imagenes de los jugadores*/
                          getImage("Resources/Images/player1.png"), getImage("Resources/Images/player2.png"), 
                          getImage("Resources/Images/player3.png"), getImage("Resources/Images/player4.png")
                         ];
                         
            var hColor = [["#f3cd35", "#000"], ["#3096d0", "#fff"], ["#d73232", "#fff"], ["#068f0c", "#fff"]];
                         
            var dado = [/*Imagenes de Dado*/
                        getImage("Resources/Images/dado1.png"), getImage("Resources/Images/dado2.png"), 
                        getImage("Resources/Images/dado3.png"), getImage("Resources/Images/dado4.png"), 
                        getImage("Resources/Images/dado5.png"), getImage("Resources/Images/dado6.png")
                       ];
            
             var points = [/*Primera Parte*/
                          new Point(220, 14, false), new Point(220, 39, false), new Point(220, 64, false), 
                          new Point(220, 91, false), new Point(220, 116, false), new Point(220, 141, false), 
                          new Point(220, 166, false), new Point(220, 192, false), 
                          
                          /*Segunda Parte*/
                          new Point(192, 220, true), new Point(167, 220, true), new Point(140, 220, true),
                          new Point(115, 220, true), new Point(90, 220, true), new Point(65, 220, true),
                          new Point(40, 220, true), new Point(14, 220, true), 
                          
                          /*Entrada en Azul*/
                          new Point(14, 300, true),
                          
                          /*Tercera Parte*/
                          new Point(14, 380, true), new Point(40, 380, true), new Point(65, 380, true),
                          new Point(90, 380, true), new Point(115, 380, true), new Point(140, 380, true),
                          new Point(167, 380, true), new Point(192, 380, true), 
                          
                          /*Cuarta Parte*/
                          new Point(220, 412, false), new Point(220, 437, false), new Point(220, 462, false),
                          new Point(220, 487, false), new Point(220, 514, false), new Point(220, 539, false),
                          new Point(220, 564, false), new Point(220, 589, false),
                          
                          /*Entrada en Rojo*/
                          new Point(300, 589, false),
                          
                          /*Quinta Parte*/
                          new Point(380, 589, false), new Point(380, 564, false), new Point(380, 539, false),
                          new Point(380, 514, false), new Point(380, 487, false), new Point(380, 462, false),
                          new Point(380, 437, false), new Point(380, 412, false),
                          
                          /*Sexta Parte*/
                          new Point(410, 380, true), new Point(437, 380, true), new Point(462, 380, true),
                          new Point(487, 380, true), new Point(514, 380, true), new Point(539, 380, true),
                          new Point(564, 380, true), new Point(589, 380, true),
                          
                          /*Entrada en Verde*/
                          new Point(589, 300, true),
                          
                          /*Septima Parte*/
                          new Point(589, 220, true), new Point(564, 220, true), new Point(539, 220, true),
                          new Point(514, 220, true), new Point(487, 220, true), new Point(462, 220, true),
                          new Point(437, 220, true), new Point(410, 220, true),
                          
                          /*Octava Parte*/
                          new Point(380, 192, false), new Point(380, 166, false), new Point(380, 141, false), 
                          new Point(380, 116, false), new Point(380, 91, false), new Point(380, 64, false), 
                          new Point(380, 39, false), new Point(380, 14, false), 
                          
                          /*Entrada en Amarillo*/
                          new Point(300, 14, false),
                          
                          /*Vuelta Amarillo*/
                          new Point(300, 39, false), new Point(300, 64, false), 
                          new Point(300, 91, false), new Point(300, 116, false), new Point(300, 141, false), 
                          new Point(300, 166, false), new Point(300, 192, false), 
                          
                          /*Vuelta Azul*/
                          new Point(40, 300, true), new Point(65, 300, true),
                          new Point(90, 300, true), new Point(115, 300, true), new Point(140, 300, true),
                          new Point(167, 300, true), new Point(192, 300, true), 
                          
                          /*Vuelta Rojo*/
                          new Point(300, 564, false), new Point(300, 539, false),
                          new Point(300, 514, false), new Point(300, 487, false), new Point(300, 462, false),
                          new Point(300, 437, false), new Point(300, 412, false),
                          
                          /*Vuelta Verde*/
                          new Point(564, 300, true), new Point(539, 300, true),
                          new Point(514, 300, true), new Point(487, 300, true), new Point(462, 300, true),
                          new Point(437, 300, true), new Point(410, 300, true),
                          
                          /*Zona Amarilla*/
                          new Point(90, 90, true), new Point(302, 250),
                          
                          /*Zona Azul*/
                          new Point(90, 514, true), new Point(250, 302),
                          
                          /*Zona Roja*/
                          new Point(514, 514, true), new Point(302, 354),
                          
                          /*Zona Verde*/
                          new Point(514, 90, true), new Point(354, 302),
                          ];
                          
            var players = [/*Jugador Amarillo*/
                           new Player(0, 0, 70, 70), new Player(0, 1, 70, 110), new Player(0, 2, 110, 110), new Player(0, 3, 110, 70),
                           
                           /*Jugador Azul*/
                           new Player(1, 0, 70, 494), new Player(1, 1, 110, 494), new Player(1, 2, 70, 534), new Player(1, 3, 110, 534),
                           
                           /*Jugador Rojo*/
                           new Player(2, 0, 494, 494), new Player(2, 1, 534, 494), new Player(2, 2, 494, 534), new Player(2, 3, 534, 534),
                           
                           /*Jugador Verde*/
                           new Player(3, 0, 494, 70), new Player(3, 1, 534, 70), new Player(3, 2, 494, 110), new Player(3, 3, 534, 110),
                          ];
                          
            var initZone = [[70, 70], [70, 110], [110, 110], [110, 70],
                            [70, 494], [110, 494], [70, 534], [110, 534],
                            [494, 494], [534, 494], [494, 534], [534, 534],
                            [494, 110], [534, 70], [494, 110], [534, 110]
                           ];
                           
            var startZone = [4, 21, 38, 55];
            var strikeZone = [67, 16, 33, 50];
            var entryZone = [68, 75, 82, 89];
            var endZone = [97, 99, 101, 103];
            
            function init() {
                history = document.getElementById("history");
                parques = new CanvasParques("cnv");
                dados = new CanvasDados("dado");
            }
        </script>
        <title>Parques - Matematicas Discretas Avanzadas - Maestria Ingenieria de Sistemas y Computacion - Uninorte</title>
    </head>
    <body onload="javascript: init()" style="margin: 0;">
        <div id="history" style="width: 700px; height: 20px; padding: 5px; margin: 10px; text-align: center;">Inicializando el juego...</div>
        <canvas id="cnv" tabindex="1" style="float: left; margin: 0 5px 0 20px;">Este navegador no es compatible con el estandar HTML5</canvas>
        <canvas id="dado" tabindex="2" style="margin: 10px; cursor: pointer; position:fixed;">Este navegador no es compatible con el estandar HTML5</canvas>
    </body>
</html>
