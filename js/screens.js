/* Screens, inheritance would be nice */
function LoadingScreen( stage, gameState ){
	var that = this;
	this.lastPercent = -1;
    this.picture = new createjs.Bitmap( "res/screens/LoadingScreen/Loading-Title.png" );
    this.pictureFront = new createjs.Bitmap( "res/screens/LoadingScreen/PanFront.png" );
    this.cooking = new createjs.Bitmap( "res/screens/LoadingScreen/TextCooking.png" );
    this.done = new createjs.Bitmap( "res/screens/LoadingScreen/TextDone.png" );
    this.turkeyState = [ new createjs.Bitmap( "res/screens/LoadingScreen/Turkey0.png" ),
    					 new createjs.Bitmap( "res/screens/LoadingScreen/Turkey25.png" ),
    					 new createjs.Bitmap( "res/screens/LoadingScreen/Turkey50.png" ),
    					 new createjs.Bitmap( "res/screens/LoadingScreen/Turkey75.png" ),
    					 new createjs.Bitmap( "res/screens/LoadingScreen/TurkeyDone.png" ) ];

	this.done.alpha= 0;

	stage.addChild( this.picture );
	stage.addChild( this.cooking );
	stage.addChild( this.done );
	stage.addChild( this.turkeyState[0] );

	var textContent = new createjs.Text( "0 %", "25px Arial", "#ffffffff" );
	textContent.x = 500;
	textContent.y = 20;
	stage.addChild( textContent);

	gameState.pubsub.subscribe( "Load", function(percent){
		textContent.text = (percent * 25).toFixed(2) + " %";
		var wholeNum = percent.toFixed(0);
		if( that.lastPercent != percent){
			that.lastPercent = percent;
			stage.addChild( that.turkeyState[wholeNum] );
			stage.addChild( that.pictureFront );
		}

		//If we're still on image one, don't fade it out, it's the base image!
		if(  wholeNum != 0 )
			that.turkeyState[wholeNum].alpha = percent.toFixed(2) - wholeNum;

		// Done!
		if(  wholeNum == 4 ){
			that.turkeyState[4].alpha = 1;
			that.cooking.alpha=0;
			that.done.alpha = 1;

			that.done.addEventListener( "mouseover", function(){ document.body.style.cursor='pointer'; } );
		 	that.done.addEventListener( "mouseout", function(){ document.body.style.cursor='default'; } );
 			that.done.addEventListener( "click",  function(){ gameState.pubsub.publish("SwitchScreen", "MainScreen"); });

			that.turkeyState[4].addEventListener( "mouseover", function(){ document.body.style.cursor='pointer'; } );
		 	that.turkeyState[4].addEventListener( "mouseout", function(){ document.body.style.cursor='default'; } );
 			that.turkeyState[4].addEventListener( "click",  function(){ gameState.pubsub.publish("SwitchScreen", "MainScreen"); });
		}
	});

	stage.addChild( this.pictureFront );

	return {
		blit : function(){
		}
	}
}

function InfoHelpScreen( stage, gameState ){
		var that = this;

    this.background = new createjs.Bitmap( "res/Main.png" );
    stage.addChild( this.background );

    this.uiElems = [];
    return {
		blit : function(){

			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}


}

function MainScreen( stage, gameState ){
	var that = this;

    this.background = new createjs.Bitmap( "res/screens/MainScreen/Main-Screen.png" );
    stage.addChild( this.background );

    var turkeyAnimations = { peck:[14,24,"peck"], ruffle:[0,13,"ruffle"], stare:[25,35,"stare"] };
	var data = {
    	images: ["res/TurkeySprite.png"],
     	frames: { width:400, height:350 },
     	animations: turkeyAnimations
 	};

	var spriteSheet = new createjs.SpriteSheet(data);
 	var animation = new createjs.Sprite(spriteSheet, "stare");
 	animation.x = 200;
 	animation.y = 210;

 	animation.addEventListener("tick", handleTick);
 	function handleTick(event) {
 		if ( turkeyAnimations[event.currentTarget.currentAnimation][1] == event.currentTarget.currentFrame ){
 			event.currentTarget.paused = true;
 		}
	    // Click happened.
 	}
 	stage.addChild(animation);

 	this.grassLayer = new createjs.Bitmap( "res/screens/MainScreen/Grass.png" );
 	stage.addChild( this.grassLayer );

	// buttons info/credits/start
 	new ImgButton( stage, gameState, 571,527, "res/screens/MainScreen/ButtonStart.png", "res/screens/MainScreen/ButtonStart.png","SwitchScreen", "DifficultyScreen", "Click"  );
 	new ImgButton( stage, gameState, 17,470, "res/screens/MainScreen/ButtonHelp.png", "res/screens/MainScreen/ButtonHelp.png","SwitchScreen", "InfoScreen", "Click"  );
 	new ImgButton( stage, gameState, 17,527, "res/screens/MainScreen/ButtonCredits.png", "res/screens/MainScreen/ButtonCredits.png","SwitchScreen", "CreditsScreen", "Click"  );

 	gameState.pubsub.publish( "BackgroundLoop", {name:"TitleMusic", pos:5650, volume:1} );
    this.uiElems = [];

    return {
		blit : function(){
			// Randomly do stuff

			if( createjs.Ticker.getTicks() %50 == 0 ){

				animation.gotoAndPlay(["peck", "ruffle", "stare"][UtilityFunctions.randRange(0,2)]);
			}
			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}

//start button

}

function DifficultyScreen( stage, gameState ){
	var that = this;

	this.background = new createjs.Bitmap( "res/Difficulty-Selection.png" );
    stage.addChild( this.background );

 	// Easy/Hard Button
 	stage.addChild( new Button( stage, gameState, 170, 40, 450, 105, "SwitchScreen", "KitchenScreen" ) );
 	stage.addChild( new Button( stage, gameState, 170, 150, 450, 105, "SwitchScreen", "KitchenScreen" ) );

	return {
		blit : function(){

			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}
}

function KitchenScreen( stage, gameState ){
	var that = this;

	// Fade out any other sounds
	gameState.pubsub.publish( "FadeOut", "" );

	this.background = new createjs.Bitmap( "res/kitchen.png" );
    stage.addChild( this.background );

	this.uiElems = [];

	for(var i in gameState.purchasedItems ){
		console.log(gameState.purchasedItems);
		gameState.purchasedItems[i].draw( stage, 403+100*i, 350 );
	}

	this.uiElems.push( gameState.ovenUI ? gameState.ovenUI.render() : ( gameState.ovenUI = new OvenUI( stage, gameState ) ).render() );
	this.uiElems.push( new ClockUI( stage, gameState ) );
	this.uiElems.push( new WindowUI( stage, gameState ) )
	stage.addChild( new Button( stage, gameState, 500, 40, 450, 105, "SwitchScreen", "MarketScreen" ) );

	// If player did not buy a turkey, tell them
	if( !gameState.turkeyBought ){
		gameState.pubsub.publish( "ShowDialog", {seq:"KitchenInitial", autoAdvance:false} );
	}

	return {
		blit : function(){

			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}
}

function MarketScreen( stage, gameState ){
	var that = this;

    this.background = new createjs.Bitmap( "res/screens/MarketScreen/MarketScreen.png" );
    var price = new createjs.Text( "100", "24px Arial", "#00000000" );
    	price.x = 725;
	 	price.y = 500;

	var wallet = new createjs.Text( gameState.wallet, "24px Arial", "#00000000" );
   		wallet.x = 725;
	 	wallet.y = 550;

	// Play soundz
	gameState.pubsub.publish( "Play", {name:"Entrance", volume:0.3} );
	gameState.pubsub.publish( "BackgroundLoop", {name:"MarketMusic", volume:1} );
	gameState.pubsub.publish( "BackgroundLoop", {name:"MarketBackgroundSound", volume:0.4} );

    stage.addChild( this.background );
    stage.addChild(price);
    stage.addChild(wallet);

    this.uiElems = [];
    this.uiElems.push( new ImgButton( stage, gameState, 690,0, "res/items/ExitSign.png", "res/items/ExitGlow.png","SwitchScreen", "KitchenScreen", "Click"  ) );
    var marketItemKeys = Object.keys(gameState.marketItems);
    for (var index in marketItemKeys ) {
    	gameState.marketItems[marketItemKeys[index]].draw( stage );
    }
	this.topground = new createjs.Bitmap( "res/screens/MarketTopShelf.png" );
	stage.addChild( this.topground );

	 this.showPrice = function( cost ){
	 	price.text = cost;
	 }
	 gameState.pubsub.subscribe( "ShowPrice", this.showPrice );
    this.setWalletAmount = function(newAmount){
    	wallet.text=gameState.wallet=newAmount;

    }

    gameState.pubsub.subscribe("WalletAmount", this.setWalletAmount);


    return {
		blit : function(){

			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}


}

function TurkeyOutScreen( stage, gameState ){
		var that = this;

    this.background = new createjs.Bitmap( "res/Main.png" );
    stage.addChild( this.background );

    this.uiElems = [];
    return {
		blit : function(){

			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}


}

function EndingScreen( stage, gameState ){
		var that = this;

    this.background = new createjs.Bitmap( "res/Main.png" );
    stage.addChild( this.background );

    this.uiElems = [];
    return {
		blit : function(){

			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}


}

function ScoreScreen( stage, gameState ){
		var that = this;

    this.background = new createjs.Bitmap( "res/Main.png" );
    stage.addChild( this.background );

    this.uiElems = [];
    return {
		blit : function(){

			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}

	// Retry Button
}

function CreditsScreen( stage, gameState ){
		var that = this;

    this.background = new createjs.Bitmap( "res/Main.png" );
    stage.addChild( this.background );

    this.uiElems = [];
    return {
		blit : function(){

			// Draw all the uiElements
	        for( var index in that.uiElems ){
				that.uiElems[ index ].tick();
			}
		}
	}
	//
}