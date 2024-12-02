function start() 
{
    $("#inicio").hide();
    
	$("#fundoGame").append("<div id='jogador' class='anima1'></div>");
	$("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");
    
    var posicaoY = parseInt(Math.random() * 334)

    // Score
    var pontos = 0


    // Energia
    var energiaAtual = 3

    var jogo = {}
    var fimDeJogo = false

    // Helicóptero
    var velocidade = 5
    var podeAtirar = true
    
    // Som
    var somDisparo=document.getElementById("somDisparo");
    var somExplosao=document.getElementById("somExplosao");
    var musica=document.getElementById("musica");
    var somGameover=document.getElementById("somGameover");
    var somPerdido=document.getElementById("somPerdido");
    var somResgate=document.getElementById("somResgate");

    // Música de Fundo em Loop
    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
    musica.play();

    // Teclas
    var TECLA = 
    {
        W: 87,
        S: 83,
        D: 68
    }
    
    jogo.pressionou = [];

    // Verifica se o usuário pressionou alguma tecla.	
    $(document).keydown(function(e)
    {
        jogo.pressionou[e.which] = true;
    });
    
    $(document).keyup(function(e)
    {
        jogo.pressionou[e.which] = false;
    });
	
	// Game Loop
	jogo.timer = setInterval(loop, 30);

    function loop() 
    {
        moveFundo();
        moveJogador();
        moveInimigo1();
        colisao();
        placar();
        energia();
	} // Fim da Função Loop

    // Função que movimenta o fundo do jogo
    function moveFundo() 
    {
	    let esquerda = parseInt($("#fundoGame").css("background-position")); // parseInt - Converte uma String em um Inteiro.
	    $("#fundoGame").css("background-position", esquerda - 0.5);
    } // Fim da Função moveFundo
    
    function moveJogador() 
    {
        if (jogo.pressionou[TECLA.W]) 
        {
            let topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo - 10);
                if (topo<=0) 
                {
                    $("#jogador").css("top", topo + 10);
                }
        }
        
        if (jogo.pressionou[TECLA.S]) 
        {
            let topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top",topo + 10);
            
            if (topo >= 434) {	
                $("#jogador").css("top",topo-10);
            }
        }
        
        if (jogo.pressionou[TECLA.D]) 
        {    
            disparo()	
        }
    } // Fim da Função moveJogador

    function moveInimigo1() 
    {
        let posicaoX = parseInt($("#inimigo1").css("left"));
        
        $("#inimigo1").css("left", posicaoX - velocidade);
        $("#inimigo1").css("top", posicaoY);
        
        if (posicaoX<=0) 
        {
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);        
        }
    } // Fim da Função moveInimigo1

    function disparo() 
    {
	
        if (podeAtirar == true) 
        {
            somDisparo.play();
            podeAtirar = false;
        
            let topo = parseInt($("#jogador").css("top"))
            let posicaoX= parseInt($("#jogador").css("left"))
            let tiroX = posicaoX + 100;
            let topoTiro= topo + 15;
        
            $("#fundoGame").append("<div id='disparo'></div");
            $("#disparo").css("top", topoTiro);
            $("#disparo").css("left", tiroX);
            
            // Tempo para atirar
            var tempoDisparo = window.setInterval(executaDisparo, 10);
        } 
     
        function executaDisparo() {
            let posicaoX = parseInt($("#disparo").css("left"));
            
            $("#disparo").css("left", posicaoX + 17); //Velocidade do disparo
            
            if (posicaoX > 900) 
            { 
                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar=true;
            }
        }
    }
    
    function colisao() 
    {
        var colisao1 = ($("#jogador").collision($("#inimigo1")));;
        var colisao3 = ($("#disparo").collision($("#inimigo1")));

        
        // Jogador com o inimigo 1
        if (colisao1.length > 0) 
        { 
            
            energiaAtual--;   
            
            let inimigo1X = parseInt($("#inimigo1").css("left"));
            let inimigo1Y = parseInt($("#inimigo1").css("top"));
            
            explosao1(inimigo1X,inimigo1Y);
        
            posicaoY = parseInt(Math.random() * 334);
    
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }

        // Disparo com o Inimigo 1
        if (colisao3.length>0) 
        {	
            pontos += 100;
            velocidade += +0.3;

            let inimigo1X = parseInt($("#inimigo1").css("left"));
            let inimigo1Y = parseInt($("#inimigo1").css("top"));
                
            explosao1(inimigo1X,inimigo1Y);
            $("#disparo").css("left", 950);
                
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }

    } // Fim da Colisão.

    function explosao1(inimigo1X, inimigo1Y) 
    {
        
        somExplosao.play();

        $("#fundoGame").append("<div id='explosao1'></div");
        $("#explosao1").css("background-image", "url(img/explosao.png)");
        
        var div = $("#explosao1");
        
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({width:200, opacity:0}, "slow");
        
        // Removendo a explosão.
        var tempoExplosao = window.setInterval(removeExplosao, 1000);
        
        function removeExplosao() 
        {
            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;
        }
    } // Fim explosao1

    // Explosão2
    function explosao2(inimigo2X, inimigo2Y)
    {
        somExplosao.play();
        
        $("#fundoGame").append("<div id='explosao2'></div");
        $("#explosao2").css("background-image", "url(img/explosao.png)");
    
        var div2=$("#explosao2");
    
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({width:200, opacity:0}, "slow");
    
        var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);
    
        function removeExplosao2() 
        {
            div2.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2 = null;
        }
    } // fim explosao2
    
    function placar() 
    {
        $("#placar").html("<h2> Pontos: " + pontos);
    } // Fim da Função placar

    // Energia
    function energia() 
    {
        if (energiaAtual == 3) 
        {
            $("#energia").css("background-image", "url(img/Vidas-3.png)");
        }

        if (energiaAtual == 2) 
        {
            $("#energia").css("background-image", "url(img/Vidas-2.png)");
        }

        if (energiaAtual == 1) 
        {    
            $("#energia").css("background-image", "url(img/Vidas-1.png)");
        }

        if (energiaAtual == 0) 
        {    
            $("#energia").css("background-image", "url(img/Vidas-0.png)");   
            
            // Game Over
            gameOver()
        }
    } // Fim energia

    // Game Over
    function gameOver() 
    {
        fimDeJogo = true;
        musica.pause();
        somGameover.play();
        
        window.clearInterval(jogo.timer);
        jogo.timer = null;
        
        $("#jogador").remove();
        $("#inimigo1").remove();;
        $("#fundoGame").append("<div id='fim'></div>");
        
        $("#fim").html("<h1> Game Over </h1><p><h4>Pontuação: " + pontos + "</h4></p>" + 
        "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
    } // Fim gameOver
} // Fim start

// Reiniciar o Jogo
function reiniciaJogo() 
{
    somGameover.pause();
    $("#fim").remove();
    start();
} // Fim reiniciaJogo