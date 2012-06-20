/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function getImage(url) {
    var tmp = new Image();
    tmp.src = url;
    
    return tmp;
}

function Point(x, y, v) {
    this.x = x;
    this.y = y;
    this.v = v;
    this.w = 80;
    this.h = 25;
}

function Player(player, n, x, y) {
    this.ellipse = new Ellipse(x, y, 20);
    this.player = player;
    this.isLife = false;
    this.entry = false;
    this.r = 5;
    this.c = -1;
    this.n = n;
    this.x = x;
    this.y = y;
    
    this.paint = function(g) {
        g.drawImage(colors[this.player], this.x-7, this.y-7);
    }
}

function Ellipse (x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    
    this.intersectPoint = function(x, y) {
        return (Math.sqrt(Math.pow(this.x-x, 2) + Math.pow(this.y-y, 2)) <= this.w/2);
    }
}

function lanzarDados() {
    dado1 = Math.floor(Math.random()*6);
    dado2 = Math.floor(Math.random()*6);
}

function moverJugador (i, c) {
    if(!players[i].entry) {
        c = (c%68);
    }
    players[i].c = c;
    if(points[c].v) {
        players[i].x = points[c].x;
        players[i].y = points[c].y - points[c].w/2+10 + (points[c].w-20)*(players[i].n/3);
    } else {
        players[i].x = points[c].x - points[c].w/2+10 + (points[c].w-20)*(players[i].n/3);
        players[i].y = points[c].y;
    }
    
    for(var j=0; j<players.length; j++) 
    {
        if(players[j].player != players[i].player && players[j].c == players[i].c) 
        {
            alert(players[j].player+" ¡¡ A la Carcel!!")
            players[j].x = initZone[4*players[j].player+players[j].n][0];
            players[j].y = initZone[4*players[j].player+players[j].n][1];
            players[j].ellipse = new Ellipse(players[j].x, players[j].y, 20);
            players[j].c = -1;
            players[j].isLife = false;
        }
    }
    
    players[i].ellipse = new Ellipse(players[i].x, players[i].y, 20);
}

function CanvasParques (canvas) {
    var mx = 0; var my = 0;
    var _this = this;
    
    this.table = new Image();
    this.table.src = 'Resources/Images/Tabla.png';
    
    this.w = 603;
    this.h = 604;
    
    //Asignar el canvas y darle tamaño
    this.cnvs = document.getElementById(canvas);
    this.cnvs.width = this.w;
    this.cnvs.height = this.h;
    
    //Asignarle el evento de mousemove y clic
    this.cnvs.addEventListener("mousemove", function (e)     {
        if (e.pageX || e.pageY) 
        {
            mx = e.pageX - _this.cnvs.offsetLeft;
            my = e.pageY - _this.cnvs.offsetTop;
        } else if (e.clientX || e.clientY) 
        {
            mx = e.clientX - _this.cnvs.offsetLeft;
            my = e.clientY - _this.cnvs.offsetTop;
        }
    }, true);
	
    //asignacion del  clik  al jugador 
    this.cnvs.addEventListener("click", function(e) {
        if(playable && !stopped) {
            for(var i=0; i<players.length; i++) {
                
				if(players[i].player == turno && players[i].ellipse.intersectPoint(mx, my) && players[i].isLife) {
                    if(!d1jug) {
                        moverJugador(i, players[i].c+dado1+1);
                        d1jug = true;
                    } else if(!d2jug) {
                        moverJugador(i, players[i].c+dado2+1);
                        d2jug = true;
                    }
                    
                    if(d1jug && d2jug) {
                        d1jug = false;
                        d2jug = false;
                        playable = false;
                        turno = (turno+1)%4;
                    }
                }
            }
        }
    }, false);
    
    //Obtener el contexto del canvas
    this.context = this.cnvs.getContext("2d");
    
    this.paint = function() {
		var elem = document.getElementById("dado");
		elem.style.top = pdados[turno][1] + "px";
		elem.style.left = pdados[turno][0] + "px";
		
        var g = this.context;
        
        g.drawImage(this.table, 0, 0);
        
        g.textAlign = "center";
        g.textBaseline = "middle";
        
        /*g.fillStyle = "#000000";  // estes es solo para mostrar el numero de la casilla 
        for(var i=0; i<points.length; i++) {
            g.fillText(""+i, points[i].x, points[i].y);
        }*/
        
        _this.cnvs.style.cursor = '';
        for(i=0; i<players.length; i++) {
            if(players[i].ellipse.intersectPoint(mx, my)) 
                _this.cnvs.style.cursor = 'pointer';
            players[i].paint(g);
        }
        
        //Mostrar leyenda de lo que hay que hacer
        history.style.background = hColor[turno][0];
        history.style.color = hColor[turno][1];
        var cont=0; 
        if(!playable && !stopped) {     //Lanzar los dados del jugador en el turno
            history.innerHTML = "Jugador " + (turno + 1) + ": Lance los dados.";
            if(turno == 3) {    //Turno del Bot
                verifiedLife = false;
                stopped = true;
                contlanzamientos++;
            }
        } else if(playable && !stopped) {
            //Verificar si saco doble, y si es asi sacar los jugadores correspondientes
            if(!verifiedLife) {
                if(dado1 == dado2) {
                        var getSacados = 0;
                        
                   if ((dado1==1) || (dado1==2)|| (dado1==3)|| (dado1==4) ){
                        for(i=0; i<players.length && getSacados <= 1; i++) {
                            if(players[i].player == turno && !players[i].isLife) {
                                players[i].isLife = true;
                                moverJugador(i, startZone[turno]);
                                verifiedLife = true;
                                getSacados++;	
                            }//fin si 
                        }//fin for
                   }else{
                       if ((dado1==0) || (dado1==5)){
                           for(i=0; i<players.length && getSacados <= 3; i++) {

                                if(players[i].player == turno && !players[i].isLife) {
                                    players[i].isLife = true;
                                    moverJugador(i, startZone[turno]);
                                    verifiedLife = true;
                                    getSacados++;
                                }//fin si 

                            }//fin for
                        }
                   }
                }//fin si 
           	
                verifiedLife = true;
            }//fin else
            
            //Aqui el bot mueve a su jugador
            if(turno == 3) {
                //Con el dado 1
                for(var i=0; i<players.length && (!d1jug || !d2jug); i++) {
                    if(players[i].player == 3 && players[i].isLife) {
                        if(!d1jug) {
                            moverJugador(i, players[i].c+dado1+1);
                            d1jug = true;
                        } else {
                            moverJugador(i, players[i].c+dado2+1);
                            d2jug = true;
                        }
                    }
                }
                
                //Con el dado 2, si solo hay una ficha viva
                for(i=0; i<players.length && !d2jug; i++) {
                    if(players[i].player == 3 && players[i].isLife) {
                        moverJugador(i, players[i].c+dado2+1);
                        d2jug = true;
                    }
                }
                
                //Si ya movio sus fichas, pasar al siguiente jugador
                if(d1jug && d2jug) {
                    d1jug = false;
                    d2jug = false;
                    playable = false;
                    turno = (turno+1)%4;
                }
            }
            
            //Verificar si tiene fichas en juego, sino pasar al siguiente jugador
            hasLife = false;
            for(i=0; i<players.length; i++) {
                if(players[i].isLife && players[i].player == turno) hasLife = true;
			      }
            if(!hasLife) {
				if(contlanzamientos > 2) {
                	turno = (turno+1)%4;
					contlanzamientos = 0;
				}
                playable = false;
            } else {
                history.innerHTML = "Jugador " + (turno + 1) + ": Mueva sus fichas.";
				contlanzamientos = 0;
			}
        }
    }
    
    //Ejecutar la funcion Paint
    this.timmer = setInterval(function() {
        _this.paint();
    }, 60);
}

function CanvasDados (canvas) {
    var _this = this;
    
    this.w = 75;
    this.h = 35;
    this.t = 0;
    
    //Obtener el canvas y asignarle un tamaño
    this.cnvs = document.getElementById(canvas);
    this.cnvs.width = this.w;
    this.cnvs.height = this.h;
    
    //Agregar el evento de hacer clic sobre los dados
    this.cnvs.addEventListener("click", function(e) {
        if(!playable && !stopped) {
            verifiedLife = false;
            stopped = true;
            contlanzamientos++;
        }
    }, false);
    
    this.context = this.cnvs.getContext("2d");
    
    this.paint = function() {
        var g = this.context;
        
        if(stopped) {
            lanzarDados();
            this.t++;
            
            if(this.t > 10) {
                this.t = 0;
                stopped = false;
                playable = true;
            }
        }
        // preguntar por el color del jugador para trasladar los dados 
        g.drawImage(dado[dado1], 0, 0);
        g.drawImage(dado[dado2], 38, 0);
    }
    
    //Ejecutar la funcion Paint
    this.timmer = setInterval(function() {
        _this.paint();
    }, 30);
}