/* 

    #############################################################
      
          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

(   By ~Aryan Maurya Mr.perfect https://amsrportfolio.netlify.app  )

          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

    #############################################################

*/
var score=0; 

var windowHeight=window.innerHeight;
var windowWidth=window.innerWidth;

var playerMovingSpeedX=0;


var groundsMovingTimeout=5;

var gameOver=true;

var Player=
{
    mass:3,
    fallingSpeed:1,
}

/**
 * Moving speed of grounds [rectangles]
 */
var groundMovingSpeed=1;

var playerMovingUpSpeed=2;


function ApplyGravity()
{
    if(gameOver)
        return;
    var player=document.getElementById("Player");
    var playerY=parseFloat(player.getAttribute("cy"));
    if(!playerColliding())
        {
            playerY+= Player.mass * Player.fallingSpeed ;
            Player.fallingSpeed=1;
        }
        
    else
        playerY-=playerMovingUpSpeed;

    if(playerY<=-15 || playerY-parseFloat(player.getAttribute("r")) >=windowHeight )
        {
            amsrMsg();
            gameOver=true;
            Restart();
            return;
        }
    player.setAttribute("cy",playerY);
    
}

function amsrMsg(){

    Swal.fire({
        title: "You died!!\n😭😭😭\nScore : "+score,
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      })
}







function changePlayerX()
{
    if(gameOver)
        return;
    var playerX=parseFloat($("#Player").attr("cx"));
    var playerRadius=parseFloat($("#Player").attr("r"))-3;
    if((playerMovingSpeedX==-1 && playerX-playerRadius<=0) || (playerMovingSpeedX==1 && playerX+playerRadius>=windowWidth))
        return;
    playerX+=playerMovingSpeedX;
    $("#Player").attr("cx",playerX);
}


window.onkeydown=function(e)
{
    if(e.keyCode==39)
        playerMovingSpeedX=1;    

    else if(e.keyCode==37)
        playerMovingSpeedX=-1; 

}

window.onkeyup=function()
{
    playerMovingSpeedX=0;
}


function moveGround()
{
    if(gameOver)
        return;
    var ground=document.getElementsByClassName("Surface");
    for(var i=0;i<ground.length;i++)
        {

            var groundY=parseFloat(ground[i].getAttribute("y"));
            groundY-=groundMovingSpeed;
            ground[i].setAttribute("y",groundY);
            if(groundY<=-8)
                {
                    setSurfacePosition(i);
                }

        }
}


function newGame()
{
    $("#PlaygroundParent").show();
    $("button").hide();
    gameOver=false;
    setUp();
}


function setUp()
{
    setInitialPosition();
    if(window.DeviceMotionEvent)
        {
            window.addEventListener("devicemotion",function(e)
            {
                var acceleration=e.accelerationIncludingGravity;
                var x=acceleration.x;
                x*=-1;
                if(x===0)
                    return;

                if(x>0.8)
                    playerMovingSpeedX=1;
                else if(x<-0.8)
                    playerMovingSpeedX=-1;
                else
                    playerMovingSpeedX=0;


                x=Math.floor(x);  
                x=Math.abs(x);
                
                
                if(x>5)
                    x=5;
                else if(x<1)
                    x=1;

                x-=6;



                clearInterval(playerMovementXinterval);
                playerMovementXinterval=setInterval(changePlayerX,Math.abs(x));



                                
                


            })
        }
}

/* 

    #############################################################
      
          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

(   By ~Aryan Maurya Mr.perfect https://amsrportfolio.netlify.app  )

          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

    #############################################################

*/

function setInitialPosition()
{
    var ground=document.getElementsByClassName("Surface");
    $("#Player").attr("cy",0);

    for(var i=0;i<ground.length;i++)
        {
            setSurfacePosition(i);                    
        }
    $("#Player").attr("cx",parseFloat($(ground[0]).attr("x"))+parseFloat($("#Player").attr("r")));
}

function setSurfacePosition(index)
{
    var ground=document.getElementsByClassName("Surface");
    do
    {
        ground[index].setAttribute("y",randomNumber(windowHeight,windowHeight+400));    
        ground[index].setAttribute("x",randomNumber(0,windowWidth-ground[index].getAttribute("width")));
    }
    while(groundsColliding(index));
}




function groundsColliding(index)
{
    var grounds=document.getElementsByClassName("Surface");
    for(var i=0;i<grounds.length;i++)
        {
            if(i==index)
                continue;
            
            var currentGround=document.getElementsByClassName("Surface")[i];
            var givenGround=document.getElementsByClassName("Surface")[index];

            var rect1=
            {
                x:parseFloat(currentGround.getAttribute("x")),
                y:parseFloat(currentGround.getAttribute("y")),
                h:parseFloat(currentGround.getAttribute("height"))+30,
                w:parseFloat(currentGround.getAttribute("width"))+30
            }

            var rect2=
            {
                x:parseFloat(givenGround.getAttribute("x")),
                y:parseFloat(givenGround.getAttribute("y")),
                h:parseFloat(givenGround.getAttribute("height"))+30,
                w:parseFloat(givenGround.getAttribute("width"))+30
            }






            if(rect1.x < rect2.x + rect2.w &&
               rect1.x + rect1.w > rect2.x &&
               
               rect1.y < rect2.y + rect2.h &&
               rect1.y + rect1.h > rect2.y)
                  return true;


        }
        
        return false;
}




/**
 * Returns a random number within specified range
 * @param {Number} Min Minimum value
 * @param {Number} Max Maximum value
 */
function randomNumber(Min,Max)
{
    return Math.floor(Math.random()*(Max-Min+1))+Min;
}








function playerColliding()
{
    var playerElement=document.getElementById("Player");
    var player=
    {
        x:parseFloat(playerElement.getAttribute("cx")),
        y:parseFloat(playerElement.getAttribute("cy")),
        radius:parseFloat(playerElement.getAttribute("r"))
    }


    var boxes=document.getElementsByClassName("Surface");
    for(var i=0;i<boxes.length;i++)
        {
            var currentGround=boxes[i];

            var box=
            {
                x:parseFloat(currentGround.getAttribute("x")),
                y:parseFloat(currentGround.getAttribute("y")),
                h:parseFloat(currentGround.getAttribute("height")),
                w:parseFloat(currentGround.getAttribute("width"))
            }




            if(((player.x-player.radius) <box.x + box.w &&

               (player.x + player.radius) > box.x       &&

               (player.y+player.radius) >= box.y   && (player.y + player.radius) <=box.y+5  ))
               {
                   playerElement.setAttribute("cy",box.x);
                   Player.fallingSpeed=0;
                   return true;
               }







        }

    return false;
}


function addScore()
{
    if(gameOver)
        return;
    score++;
    document.getElementById("score").innerHTML="Score : "+score;
    if(score % 200==0 && groundsMovingTimeout>=3)
        {
            clearInterval(moveGrounds);
            moveGrounds=setInterval(moveGround,--groundsMovingTimeout);
            playerMovingUpSpeed=groundMovingSpeed* (10/groundsMovingTimeout);
        }
}



function Restart()
{
    
    if(confirm("Try again ??"))
        {
            score=0;
            $("#score").html="Score : "+score;
            setInitialPosition();
            clearInterval(moveGrounds);
            groundsMovingTimeout=5;
            playerMovingUpSpeed=2;
            playerMovingSpeedX=0;
            moveGrounds=setInterval(moveGround,5);
            gameOver=false;
            

        }
}

var moveGrounds=setInterval(moveGround,5);
setInterval(ApplyGravity,10);
var playerMovementXinterval=setInterval(changePlayerX,2);
setInterval(addScore,100);

/* 

    #############################################################
      
          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

(   By ~Aryan Maurya Mr.perfect https://amsrportfolio.netlify.app  )

          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

    #############################################################

*/