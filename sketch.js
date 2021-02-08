//Declaring the variables.
var drinkSound,moneySound,errorSound,money,user,pet,foodS;
var dogImg,dogHappy,milkBottleImg,cloudImg,database;
var sprite1,dog,milkBottle,cloud,foodStock,moneyLeft;
var feed,addFood,earnMoney,userName,petName,milk,fedTime;
var lastFed = 0;

//Function for preloading.
function preload(){
  //Loading images and sounds to different variables.
  dogImg = loadImage("Dog.png");
  dogHappy = loadImage("happy_dog.png");
  milkBottleImg = loadImage("Milk.png");
  cloudImg = loadImage("cloud.png");
  drinkSound = loadSound("drinkSound.wav");
  moneySound = loadSound("Money.wav");
  errorSound = loadSound("error.mp3");
}

//Function for setting up.
function setup() {
  //Setting database's value as the realtime firebase database's value.
  database = firebase.database();
  //Creating the canvas area.
  createCanvas(900,500);

  //Adjusting the volumes for different sound variables.
  drinkSound.setVolume(0.07);
  moneySound.setVolume(0.2);
  errorSound.setVolume(0.1);
  //Setting money's value as 0.
  money = 0;

  //Creating different sprites for different uses and assigning different properties for them.
  sprite1 = createSprite(230,375,450,150);
  sprite1.shapeColor = color(46,139,87);
  sprite1.visible = false;

  dog = createSprite(750,400,150,150);
  dog.addImage(dogImg);
  dog.scale = 0.25;

  milkBottle = createSprite(440,390,10,10);
  milkBottle.addImage(milkBottleImg);
  milkBottle.visible = false;
  milkBottle.scale = 0.13;

  cloud = createSprite(600,205,10,10);
  cloud.addImage(cloudImg);
  cloud.scale = 0.64;
  cloud.visible = false;

  //Assigning foodStock's value as Food's value from database and calling the readStock function.
  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  //Assigning moneyLeft's value as Money's value from database and calling the readAccount function.
  moneyLeft = database.ref('Money');
  moneyLeft.on("value",readAccount);

  //Creating different html buttons, giving them different positions and calling different functions when they are clicked.
  feed = createButton("Feed");
  feed.position(420,70);
  feed.mousePressed(feedDog);

  addFood = createButton("Buy milk bottles");
  addFood.position(530,70);
  addFood.mousePressed(addFoods);

  earnMoney = createButton("Earn Money");
  earnMoney.position(660,70);
  earnMoney.mousePressed(getMoney);

  //Creating different html input boxes and giving them positions.
  userName = createInput("Fill Your Name here");
  userName.position(20,70);

  petName = createInput("Fill Your Pet's Name here");
  petName.position(210,70);

  //Giving the milk variable properties of the 'Food' class.
  milk = new Food();
}

//Draw loop function.
function draw() {
  //Changing the background color.
  background(46,139,87);

  //Giving user and pet variables userName's and petName's values respectively.
  user = userName.value();
  pet = petName.value();

  //Assigning functions when milkBottle's x position is greater than 640.
  if(milkBottle.x > 640) {
    //Setting its x position as 440.
    milkBottle.x = 440;
    //Changing its x velocity to 0.
    milkBottle.velocityX = 0;
    //Making it invisible.
    milkBottle.visible = false;
    //Changing dog sprite's image.
    dog.addImage(dogImg);
    //Playing drinkSound.
    drinkSound.play();
  }

  //Making sprite1 invisible when milk.getFoodStock() isn't greater than 0.
  if(milk.getFoodStock() > 0) {
    sprite1.visible = true;
  }
  else {
    sprite1.visible = false;
  }

  //Assigning fedTime's value as FeedTime's value from database and calling a function.
  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data) {
    lastFed = data.val();
  });

  //Displaying info text.
  fill("white");
  textAlign(NORMAL);
  textFont("cursive");
  textSize(15);
  if(lastFed > 12) {
    text("Last Fed : "+ lastFed % 12 + " PM",700,30);
  }
  else if(lastFed === 0) {
    text("Last Fed : 12 AM",700,30);
  }
  else if(lastFed === 12) {
    text("Last Fed : 12 PM",700,30);
  }
  else {
    text("Last Fed : "+ lastFed + " AM",700,30);
  }
  text("Money Left : " + money,550,30);
  text("Max. amount of Money : 1200",300,30);
  text("Max. bottles of milk : 20",90,30);

  //Assigning functions when following conditions are true.
  if(user != "Fill Your Name here" && pet != "Fill Your Pet's Name here") {
    //Making cloud sprite visible.
    cloud.visible = true;

    //Displaying different 'Messages' according to different conditions.
    if(milk.getFoodStock() === 0) {
      if(money === 0) {
        fill("yellow");
        textAlign(CENTER);
        textSize(20);
        text("Messages : Your money account is",180,170);
        text("empty. You can no longer buy milk",180,195);
        text("bottles. 😢😢",180,220);
        text("(Press 'Earn money'",180,245);
        text("to get more money in your account.",180,270);
      }
      else if(money > 0) {
        fill("yellow");
        textAlign(CENTER);
        textSize(20);
        text("Messages : Food Stock is empty.",180,170);
        text("You can no longer feed your pet. 😢😢",180,195);
        text("(Press 'Buy Milk Bottles' to get more",180,220);
        text("bottles of milk for your virtual pet)",180,245);
      }
    }
    else {
      if(money === 0) {
        fill("yellow");
        textAlign(CENTER);
        textSize(20);
        text("(Your money account is empty.",180,220);
        text("(Press 'Earn money' to get more",180,245);
        text("money in your account.",180,270);
      }
      fill("yellow");
      textAlign(CENTER);
      textSize(20);
      text("Messages : Press 'Feed' to feed your",180,170);
      text("virtual pet " + pet + ". 🦴",180,195);
    }
  }

  else {
    fill("yellow");
    textAlign(CENTER);
    textSize(20);
    text("Messages : Please fill your and your",180,170);
    text("virtual pet's name in the boxes",180,195);
    text("provided above.",180,220);
  }  

  //Displaying the sprites.
  drawSprites();

  //Calling the display function for the milk variable.
  milk.display();

  //Displaying text when the following condition is true.
  if(user != "Fill Your Name here" && pet != "Fill Your Pet's Name here") {
    fill("black");
    textFont("segoe script");
    textSize(15);
    text("Hello " + user + ", I am your",610,165);
    text("virtual pet " + pet + ". I am a",610,190);
    text("bit hungry. Can you please feed",610,215);
    text("me some food ? 🐶🐶",610,240);
  }
}

//Function to read the Food's value in realtime database.
function readStock(data) {
  foodS = data.val();
  milk.updateFoodStock(foodS);
}

//Function to read the Money's value in realtime database.
function readAccount(data) {
  money = data.val();
}

//getMoney function to increase money's value in database as well as in the application.
function getMoney() {
  if(money < 1200 && money >= 0 && user != "Fill Your Name here" && pet != "Fill Your Pet's Name here") {
    money = money + 120;
    moneySound.play();

    database.ref('/').update({
      Money:money
    })
  }
  else {
    errorSound.play();
  }
}

//feedDog function to feed the dog in different conditions.
function feedDog() {
  if(milkBottle.velocityX === 0 &&  milk.getFoodStock() > 0 && user != "Fill Your Name here" && pet != "Fill Your Pet's Name here") {
    dog.addImage(dogHappy);
    
    milkBottle.visible = true;
    milkBottle.velocityX = 4;
    
    if(milk.getFoodStock() <= 0) {
      milk.updateFoodStock(milk.getFoodStock()*0);
    }
    else {
      milk.updateFoodStock(milk.getFoodStock()-1);
    }
    
    database.ref('/').update({
      Food:milk.getFoodStock(),
      FeedTime:hour()
    })
  }
  else if(milkBottle.velocityX > 0) {
    dog.addImage(dogHappy);
  }
  else {
    dog.addImage(dogImg);
    errorSound.play();
  }
}

//Function to add food in stock and deduct the money.
function addFoods() {
  if(foodS < 20 && money <= 1200 && money > 0 && user != "Fill Your Name here" && pet != "Fill Your Pet's Name here") {
    foodS++;
    database.ref('/').update({
      Food:foodS
    })
    money = money - 120;
    database.ref('/').update({
      Money:money
    })
    moneySound.play();
  }
  else {
    errorSound.play();
  }
}