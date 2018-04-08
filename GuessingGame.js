function generateWinningNumber(){
    return (Math.floor(Math.random() * 100)) + 1;
}

function shuffle(arr){
    let temp, last = arr.length, randIdx;
    while (last !== 0){
        randIdx = Math.floor(Math.random() * last);
        last--;
        temp = arr[last];
        arr[last] = arr[randIdx];
        arr[randIdx] = temp;
    }
    return arr;
}

function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
    return (this.playersGuess < this.winningNumber) ? true : false;
}

Game.prototype.playersGuessSubmission = function(guess) {
    if (isNaN(guess) || guess > 100 || guess < 1){
        throw "That is an invalid guess.";
    }
    this.playersGuess = guess;
    return this.checkGuess();
}

Game.prototype.checkGuess = function(){
    if (this.playersGuess == this.winningNumber){
        this.pastGuesses.push(this.playersGuess)
        return "You Win!";
        // if playersGuess is in pastGuesses
    } else if (this.pastGuesses.indexOf(this.playersGuess) > -1){
        return "You have already guessed that number.";
    }
    this.pastGuesses.push(this.playersGuess);
    if (this.pastGuesses.length >= 5){
        return "You Lose.";
    }
    let diff = this.difference(); 
    if (diff < 10){
        return "You\'re burning up!";
    }
    if (diff < 25){
        return "You\'re lukewarm.";
    } 
    if (diff < 50){
        return "You\'re a bit chilly.";
    }
    return 'You\'re ice cold!';
}

function newGame(){
    return new Game();
}

Game.prototype.provideHint = function(){
    hintArray = [this.winningNumber];
    for (let i = 1; i <= 2; i++){
        hintArray.push(generateWinningNumber());
    }
    return shuffle(hintArray);
}


/////////////////////////////////////////////////////////////


const enterGuess = function(game){
    let val = $("#player-input").val();
        $("#player-input").val('');
        let currAns =  game.playersGuessSubmission(val);
        return currAns;
}

const disableButtons = function(){
    $("#reset").attr("disabled", "disabled");
    $("#hint").attr("disabled", "disabled");
    $('#subtitle').text('');
}

const resetGame = function(){
    $("#title").text('guessing game');
    $("#subtitle").text('guess a number between 1 and 100');
    $("li").text('-');
}

const giveHint = function(hintArr){
    let hint = `the winning number is ${hintArr[0]}, ${hintArr[1]}, or ${hintArr[2]}`;
    $("#title").text(hint);
    $("#subtitle").text('');
}

const fillList = function(game){
    $("#guess-list li:nth-child(" + game.pastGuesses.length + ")").text(game.playersGuess);
}

const changeTitle = function(ans, game){
    $title = $("#title");
    if (ans === "You have already guessed that number."){
        $title.text('guess again!');
        fillList(game);
        disableButtons();
    } else if (ans === "You Win!"){
        $title.text('YOU WIN!');
        fillList(game);
        disableButtons();
    } else if (ans === "You Lose."){
        $title.text('you lose.');
        fillList(game);
        disableButtons();
    } else {
    // If the player's guess isn't a duplicate, add the guess to the 
    // #guesses 'ul' element so the user can see what guesses they have already submitted.
        $title.text(ans);
        fillList(game);
        if (game.isLower()){
            $('#subtitle').text('guess higher');
        } else {
            $('#subtitle').text('guess lower');
        }
    }
}

$(document).ready(function(){
    let currGame = newGame();
    $("#submit").click(function(){
        let ans = enterGuess(currGame);
        changeTitle(ans, currGame);
    });

    $('#player-input').keydown(function (key){
        if(key.keyCode == 13){
            let ans = enterGuess(currGame);
            changeTitle(ans, currGame);
        }
    })

    $("#reset").click(function(){
        currGame = newGame();
        resetGame();
    })

    $("#hint").click(function(){
        let hintArr = currGame.provideHint();
        giveHint(hintArr);
    })

})
