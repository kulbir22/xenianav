import React, { Component } from 'react';
import { 
    SafeAreaView, View, Text, Animated, FlatList, StyleSheet, ImageBackground,
    TouchableHighlight, TouchableOpacity, Platform, Alert, Image 
} from 'react-native';
import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import LevelSelection from './LevelSelection';
import { reloadDrawer } from '../store/redux/reducer';
import { 
    GradientIcon, getWidthnHeight, getMarginBottom, fontSizeH2, fontSizeH3, MaskedGradientText,
    getMarginTop, getMarginVertical, getMarginHorizontal, fontSizeH4, getMarginRight, getMarginLeft
} from '../KulbirComponents/common';
const AnimateTouch = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * SELECT PLAYER: 'X' or 'O'
 *  @type {*} 
 */
const availableOptions = [
    {
        id: 1,
        icon: (
            <GradientIcon
                start={{x: 0.3, y: 0}}
                end={{x: 0.7, y: 0}}
                containerStyle={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(13)]}
                icon={<FontAwesome name={'close'} style={{backgroundColor: 'transparent'}} size={getWidthnHeight(13).width}/>}
                colors={["#292C6D", "#6E3CBC"]}
            />
        )
    },
    {
        id: 2,
        icon: (
            <GradientIcon
                start={{x: 0.3, y: 0}}
                end={{x: 0.7, y: 0}}
                containerStyle={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(13)]}
                icon={<FontAwesome name={'circle-o'} style={{backgroundColor: 'transparent'}} size={getWidthnHeight(13).width}/>}
                colors={["#E02401", "#FF5C58"]}
            />
        )
    }
]

/**
 * TIC TAC TOE game LOGIC
 *
 * @class TicTacToe
 * @extends {Component}
 */
class TicTacToe extends Component {
    constructor(props){
        super(props)
        this.state = {
            selection: null,    //Player Selection
            showSelection: true,    //Shows options to choose player
            animateSelection: new Animated.Value(0),    //Enlarges selection made by user
            hideSelection: new Animated.Value(1),       //Hides choose player options
            enableGame: new Animated.Value(0),          //Shows Game board
            finish: false,                              //Disables functionality when game is finished
            gameBoard: new Array(9).fill(null),         //Initializes Game board dimensions to  3 x 3
            winningCombination: [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],                              //Winnning combinations for 3 x 3 Game Board     
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ],
            difficultyLevel: 1,                         //Difficulty Level: 1 or 2
            enableFoxMode: false,                         //Max Difficulty Level
            showLevelSelector: false,
            levelDetails: null,
            winnerDetails: 'tie',
            timerCount: 0,
            timeLeft: 0,
            animateColor: new Animated.Value(0),
            timeOut: false,
            animateBlurRadius: new Animated.Value(0)
        }
        this.myTimer = null;
    }

    /*
        DIFFICULTY LEVEL EXPLAINED

        Level 1 (SID): {
            difficultyLevel ---> 1,
            enableFoxMode ---> FALSE,
            gameBoard ---> 3 x 3
        }

        Level 2 (SCRAT): {
            difficultyLevel ---> 2,
            enableFoxMode ---> FALSE,
            gameBoard ---> 3 x 3
        }

        Level 3 (MANNY): {
            difficultyLevel ---> 1,
            enableFoxMode ---> TRUE,
            gameBoard ---> 3 x 3
        }

        Level 4 (DIEGO): {
            difficultyLevel ---> 2,
            enableFoxMode ---> TRUE,
            gameBoard ---> 3 x 3
        }

        Level 5 (MOMMA DINO): {
            difficultyLevel ---> 2,
            enableFoxMode ---> TRUE,
            gameBoard ---> 4 x 4
        }
    */

    //By default 3 x 3 gameboard is initialized
    componentDidMount(){
        this.initializeGameBoard();
    }

    /**
     * initializeGameBoard(launchGame = false)
     *
     * @param {boolean} [launchGame=false]
     * Reinitializes Game Board after opponent is selected
     * 
     * If (launchGame === true) calls showGame function, this hides
     the selection process and shows the ^^^GAME BOARD^^^
    * @memberof TicTacToe
    */
    initializeGameBoard(launchGame = false){
        const { gameBoard } = this.state;
        const updateGameBoard = gameBoard.map((value, index) => {
            return { id: index, iconID: value, icon: value }
        })
        this.setState({gameBoard: updateGameBoard}, () => {
            //console.log("GAME BOARD: ", this.state.gameBoard)
            if(launchGame){
                this.showGame();
            }
        })
    }

    /**
     * enlargeSelection()
     * 
     * This enlarges the current user selection
     * @memberof TicTacToe
     */
    enlargeSelection(){
        const { animateSelection } = this.state;
        Animated.spring(animateSelection, {
            toValue: 1,
            friction: 4,
            tension: 100
        }).start();
    }

    /**
     * normaliseSelection(id)
     * 
     * This function restores the enlarged selection --> (id), to its normal size if
       another option is selected
     * @param {*} id
     * @memberof TicTacToe
     */
    normaliseSelection(id){
        const { animateSelection } = this.state;
        Animated.timing(animateSelection, {
            toValue: 0,
            duration: 100
        }).start(({ finished }) => {
            if(finished){
                this.setState({selection: id}, () => this.enlargeSelection())
            }
        });
    }


    /**
     * renderItem({ item })
     * 
     * Displays the icon selection 'X' and 'O'
     * @param {*} { item }
     * @memberof TicTacToe
     */
    renderItem = ({ item }) => {
        const { selection, animateSelection } = this.state;
        const  { iconBG } = styles;
        const enlargeStyle = {
            transform: [
                {
                    scale: animateSelection.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.2]
                    })
                }
            ],
            // borderColor: '#EA9215',
            // backgroundColor: animateSelection.interpolate({
            //     inputRange: [0, 1],
            //     outputRange: ["#F0ECE3", "#B4846C"]
            // })
        };
        return (
            <View 
                style={[{
                    borderColor: 'black', borderWidth: 0, alignItems: 'center', justifyContent: 'center', overflow: 'visible'
                    }, getWidthnHeight(100, 15)
                ]} 
            >
                {(selection !== item.id)?
                    <TouchableOpacity 
                        style={[iconBG]}
                        activeOpacity={0.7}
                        onPress={() => {
                            console.log("TOUCHED")
                            if(selection){
                                this.normaliseSelection(item.id);
                                return;
                            }
                            // animateSelection.setValue(0);
                            this.setState({selection: item.id}, () => this.enlargeSelection())
                        }}
                    >
                        {item.icon}
                    </TouchableOpacity>
                :
                    <AnimateTouch activeOpacity={0.7} onPress={() => this.setState({selection: item.id})} style={[iconBG, enlargeStyle]}>
                        {item.icon}
                    </AnimateTouch>
                }
            </View>
        );
    }

    /**
     * showGame()
     *
     * This function hides the selection process and shows the ^^^GAME BOARD^^^
     * @memberof TicTacToe
     */
    showGame(){
        const { hideSelection } = this.state;
        Animated.timing(hideSelection, {
            toValue: 0,
            duration: 400
        }).start(({ finished }) => {
            if(finished){
                this.setState({showSelection: false}, () => {
                    const { enableGame } = this.state;
                    Animated.timing(enableGame, {
                        toValue: 1,
                        duration: 400
                    }).start()
                })
            }
        });
    }

    /**
     * renderGameBoard({item, index})
     *
     * This function renders the ^^^GAME BOARD^^^
     * @param {*} {item, index}
     * item ---> displays the item in ^^^GAME BOARD^^^ at specific ---> index
     * @memberof TicTacToe
     */
    renderGameBoard = ({item, index}) => {
        const { selection, gameBoard } = this.state;
        const { boxSize } = styles;
        const iconIndex = availableOptions.findIndex((item) => {
            return (item.id === selection)
        })
        return (
            <TouchableHighlight 
                disabled={gameBoard[index]['iconID']}
                onPress={() => {
                    this.userSelection(index, iconIndex);
                }}
                underlayColor={(selection === 1)? "rgba(41, 44, 109, 0.4)" : "rgba(223, 113, 27, 0.4)"} 
                activeOpacity={0.7}  
                style={boxSize}
            >
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    {/* <View style={{position: 'absolute'}}>
                        <Text>{item.id}</Text>
                    </View> */}
                    {item.icon}
                </View>
            </TouchableHighlight>
        );
    }

    /**
     * startTimer(seconds)
     *
     * This function is called for Level 3 and 4. The purpose of this timer is to
     * end the Game if the timer expires and the player gets defeated by the BOT.
     * @param {*} seconds
     * seconds ---> Represent the timer duration
     * @memberof TicTacToe
     */
    startTimer = (seconds) => {
        this.myTimer = setInterval(() => {
            const { timerCount, timeLeft, levelDetails, showLevelSelector } = this.state;
            if(timerCount <= 0){
                if(!showLevelSelector){
                    this.setState({showLevelSelector: true})
                }
                clearInterval(this.myTimer)
                this.setState({
                    finish: true, winnerDetails: levelDetails.id, 
                    timeOut: true
                }, () => {});
                return;
            }else{
                const remainingTime = Math.floor(100/seconds);
                this.animateColorFunction();
                this.setState({timerCount: timerCount - 1, timeLeft: timeLeft - remainingTime})
            }
        }, 1000);
    }
    
    /**
     * animateColorFunction()
     * 
     * This function animates the color in the timer ring from 
     * 'GREEN' to 'YELLOW' to 'RED' as the count transition towards 0 (Number).
     * @memberof TicTacToe
     */
    animateColorFunction(){
        const { animateColor, timerCount } = this.state;
        Animated.timing(animateColor, {
            toValue: timerCount,
            duration: 500
        }).start();
    }

    /**
     * userSelection(index, iconIndex)
     * 
     * This function marks the user selection on the ^^^GAME BOARD^^^ when clicked.
     * @param {*} index
     * index ---> specifices the location to be marked on ^^^GAME BOARD^^^
     * @param {*} iconIndex
     * iconIndex ---> The unique ID of the player
     * @return {*} 
     * @memberof TicTacToe
     */
    userSelection(index, iconIndex){
        const { gameBoard, finish, selection, levelDetails } = this.state;
        if(finish){
            return;
        }
        clearInterval(this.myTimer);
        //console.log("ADD ICON")
        const iconInfo = availableOptions[iconIndex];
        gameBoard[index]['iconID'] = iconInfo.id;
        gameBoard[index]['icon'] = iconInfo.icon;
        this.setState({gameBoard}, async () => {
            //this.generateRandomNumber();
            let getUserIndex = [];
            this.state.gameBoard.forEach((item) => {
                if(item.iconID === selection){
                    getUserIndex.push(item.id)
                }
            })
            console.log("USER LENGTH: ", getUserIndex)
            if(getUserIndex.length === 1){
                if(levelDetails.id === '3' || levelDetails.id === '4' ){
                    this.reloadTimer();
                }
                this.opponentNextMove();
            }else if(getUserIndex.length > 1){
                this.evaluateUserMove(async(won) => {
                    const { finish } = this.state;
                    if(won){
                        clearInterval(this.myTimer);
                        this.setState({finish: true, winnerDetails: '999', showLevelSelector: true}, () => {
                            //alert("You won!!!");
                        });
                        return;
                    }else if(!won && !finish){
                        const { gameBoard } = this.state;
                        let allFilled = [];
                        allFilled = gameBoard.filter((item) => {
                            return (item.iconID === null)
                        })
                        if(allFilled.length === 0){
                            clearInterval(this.myTimer);
                        }else{
                            if(levelDetails.id === '3' || levelDetails.id === '4' ){
                                this.reloadTimer();
                            }
                        }
                        this.opponentNextMove();
                    }
                })
            }
        });
    }


    /**
     * reloadTimer()
     *
     * This function reloads the timer if the player has made his next move
     * before the timer has expired.
     * @memberof TicTacToe
     */
    reloadTimer(){
        const { levelDetails } = this.state;
        let seconds = null;
        if(levelDetails.id === '3'){
            seconds = 5;
            this.state.animateColor.setValue(seconds);
        }else if(levelDetails.id === '4'){
            seconds = 3;
            this.state.animateColor.setValue(seconds);
        }
        this.setState({timerCount: seconds, timeLeft: 100}, () => this.startTimer(seconds));
    }
    
    /**
     * This function is used to check if the user has won the GAME
     *
     * @param {*} callBack
     * callBack ---> This is a callBack function which returns true if the user has won
     * or false if the user has not yet won.
     * @return {*} 
     * @memberof TicTacToe
     */
    evaluateUserMove(callBack){
        const { selection, gameBoard, winningCombination } = this.state;
        for(let i = 0; i < winningCombination.length; i++){
            let count = 0;
            const item = winningCombination[i];
            for(let j = 0; j < item.length; j++){
                if(gameBoard[item[j]]['iconID'] === selection){
                    count++;
                }
                if(count === item.length){
                    callBack(true);
                    return;
                }
            }
            if((count < item.length) && (i === (winningCombination.length - 1))){
                callBack(false);
                return;
            }
        }
    }

    /**
     * foxMode(bot, defaultIndex, blankBoxes = [])
     * 
     * This function is called when 'enableFoxMode: TRUE', the purpose of this function is to prevent
     * the player from winning.
     * @param {*} bot
     * bot ---> This parameter contains the count of moves made by BOT in a specific combination, which
     * is then compared with the moves made by player in other combinations. So, if the BOT count is less
     * than the player's count, the BOT then makes its next move in the combination which has the maximum
     * winning chances of the player. Thus, preventing the player from winning. 
     * @param {*} defaultIndex
     * defaultIndex ---> This contains the specific combination e.g. [3, 4, 5], in which the BOT has made 
     * its recent move.
     * @param {*} [blankBoxes=[]]
     * blankBoxes ---> This is only used if there are no winning combinations left. This is an array which
     * contains the index values of remaining empty boxes in ^^^GAME BOARD^^^.
     * @return {*} 
     * If blankBoxes is used, then it is certain that the game would be a 'TIE'.
     * So, the function will return an index value which is empty in ^^^GAME BOARD^^^ and ensures its a 'TIE'.
     * 
     * If bot parameter is used:
     *      1. If bot count is GREATER than the players count then the function returns 'defaultIndex', in which
     *         the BOT will make its next move.
     *      2. If bot count is LESS than the players count then the function returns, the specific combination
     *         which has maximum winning chances of the player and to spoil the game the BOT then looks for the 
     *         empty index value in that combination and makes its next move in that empty index.  
     * @memberof TicTacToe
     */
    foxMode(bot, defaultIndex, blankBoxes = []){
        const { selection, gameBoard, winningCombination, difficultyLevel } = this.state;
        let getCombinations = [];
        let maxMove = [];
        let finalIndex = Math.floor(Math.random() * blankBoxes.length);
        winningCombination.forEach((item, index) => {
            let count = 0;
            let fillCount = 0;
            item.forEach((num, subIndex) => {
                if(gameBoard[num]['iconID']){
                    fillCount++;
                }
                if(gameBoard[num]['iconID'] === selection){
                    count++;
                }
                if((fillCount !== item.length) && (subIndex === (item.length - 1))){
                    if((count > bot) && (bot !== null)){
                        maxMove.push(count);
                        getCombinations.push(item);
                    }else if(bot === null){
                        maxMove.push(count);
                        getCombinations.push(item);
                    }
                }
            })
        })
        if(maxMove.length > 0){
            const max = Math.max(...maxMove);
            const index = maxMove.findIndex((num) => {
                return (max === num)
            })
            if(bot === null){
                const maxWinChance = getCombinations[index];
                //console.log("@@@ GET FOX COMBINATION: ", index, getCombinations, maxMove, maxWinChance, getCombinations.length, maxMove.length, max)
                let emptyIndex = maxWinChance.findIndex((num) => {
                    return (gameBoard[num]['iconID'] === null)
                })
                //console.log("^^^ FOX FUNCTION: ", emptyIndex, gameBoard[emptyIndex]['iconID'], maxWinChance[emptyIndex])
                return maxWinChance[emptyIndex];
            }else{
                //console.log("BOT FOX FUNCTION: ", getCombinations[index])
                return getCombinations[index];
            }
            
        }else{
            return (bot === null)? blankBoxes[finalIndex] : defaultIndex;
        }
    }

    /**
     * opponentNextMove()
     * 
     * This function is used by BOT to make its next move.
     *      If (difficultyLevel === 1)
     *          ---> The BOT makes its next move in a specific combination which has the LEAST number of its own marking.
     * 
     *      If (difficultyLevel === 2)
     *          ---> The BOT makes its next move in a specific combination which has the MAXIMUM number of its own marking.
     * @return {*} 
     * Nothing is being returned in this function. The return statement is used to terminate the loop if the BOT has won.
     * @memberof TicTacToe
     */
    opponentNextMove(){
        const { selection, gameBoard, winningCombination, difficultyLevel, enableFoxMode, levelDetails } = this.state;
        let getUserIndex = [];
        const getAllUser = gameBoard.filter((item) => {
            if(item.iconID === selection){
                getUserIndex.push(item.id)
            }
            return (item.iconID === selection)
        })
        let getCombinations = [];
        let userDetails = null
        let opponentDetails = null;
        availableOptions.forEach((item) => {
            if(item.id !== selection){
                opponentDetails = item
            }else{
                userDetails = item
            }
        })
        if(getUserIndex.length === 1){
            const randomNumber = Math.floor(Math.random() * 9)
            if(randomNumber === getUserIndex[0]){
                this.opponentNextMove();
            }else{
                gameBoard[randomNumber]['iconID'] = opponentDetails['id'];
                gameBoard[randomNumber]['icon'] = opponentDetails['icon'];
                this.setState({gameBoard}, () => {})
            }
        }else{
            winningCombination.forEach((item, index) => {
                let count = 0;
                item.forEach((num) => {
                    if(gameBoard[num]['iconID'] !== selection){
                        count++;
                        if(count === item.length){
                            getCombinations.push(item)
                        }
                    }
                })
            })
            //console.log("^^^^ COMBINATIONS: ", getCombinations)
            let maxWinChance = [];
            let maxMove = [];
            getCombinations.forEach((item, mainIndex) => {
                let count = 0;
                item.forEach((num, subIndex) => {
                    if(gameBoard[num]['iconID'] === opponentDetails['id']){
                        count++;
                    }
                    if(subIndex === (item.length - 1)){
                        maxMove.push(count)
                    }
                })
            })
            if(maxMove.length > 0){
                if(difficultyLevel === 1){
                    const min = Math.min(...maxMove)
                    const index = maxMove.findIndex((num) => {
                        return (min === num)
                    })
                    if(enableFoxMode){
                        maxWinChance = this.foxMode(min, getCombinations[index]);
                    }else{
                        maxWinChance = getCombinations[index]
                    }
                }else if(difficultyLevel === 2){
                    const max = Math.max(...maxMove)
                    const index = maxMove.findIndex((num) => {
                        return (max === num)
                    })
                    if(enableFoxMode){
                        maxWinChance = this.foxMode(max, getCombinations[index]);
                    }else{
                        maxWinChance = getCombinations[index]
                    }
                }
                //console.log("^^^^ MAX WIN CHANCE: ", maxMove, maxWinChance)
            }
            if(maxWinChance.length === 0){
                const mainIndex = Math.floor(Math.random() * getCombinations.length);
                if(getCombinations.length === 0){
                    const blankBoxes = [];
                    gameBoard.forEach((item, index) => {
                        if(!item.iconID){
                            blankBoxes.push(index);
                        }
                    })
                    if(blankBoxes.length === 0){
                        this.tieFunction();
                        return;
                    }
                    let randomIndex = null;
                    if(enableFoxMode){
                        randomIndex = this.foxMode(null, null, blankBoxes);
                        //console.log("### FOXMODE BLANK BOXES: ", blankBoxes, randomIndex)
                        gameBoard[randomIndex]['iconID'] = opponentDetails['id'];
                        gameBoard[randomIndex]['icon'] = opponentDetails['icon'];
                        this.setState({gameBoard}, () => {
                            const { gameBoard } = this.state;
                            const blankBoxes2 = [];
                            gameBoard.forEach((item, index) => {
                                if(!item.iconID){
                                    blankBoxes2.push(index);
                                }
                            })
                            if(blankBoxes2.length === 0){
                                this.tieFunction();
                                return;
                            }
                        });
                    }else{
                        randomIndex = Math.floor(Math.random() * blankBoxes.length)
                        //console.log("@@@ NORMAL BLANK BOXES: ", blankBoxes, randomIndex)
                        gameBoard[blankBoxes[randomIndex]]['iconID'] = opponentDetails['id'];
                        gameBoard[blankBoxes[randomIndex]]['icon'] = opponentDetails['icon'];
                        this.setState({gameBoard}, () => {
                            const { gameBoard } = this.state;
                            const blankBoxes2 = [];
                            gameBoard.forEach((item, index) => {
                                if(!item.iconID){
                                    blankBoxes2.push(index);
                                }
                            })
                            if(blankBoxes2.length === 0){
                                this.tieFunction();
                                return;
                            }
                        });
                    }
                }else{
                    const finalArray = getCombinations[mainIndex];
                    const subIndex = Math.floor(Math.random() * finalArray.length);
                    if(gameBoard[finalArray[subIndex]]['iconID']){
                        this.opponentNextMove();
                        return;
                    }
                    gameBoard[finalArray[subIndex]]['iconID'] = opponentDetails['id'];
                    gameBoard[finalArray[subIndex]]['icon'] = opponentDetails['icon'];
                    this.setState({gameBoard}, () => {
                        const { gameBoard } = this.state;
                        const blankBoxes = [];
                            gameBoard.forEach((item, index) => {
                                if(!item.iconID){
                                    blankBoxes.push(index);
                                }
                            })
                            if(blankBoxes.length === 0){
                                this.tieFunction();
                                return;
                            }
                    });
                }
            }else{
                //console.log("@@@ SCAN MAX WIN CHANCE: ", maxWinChance)
                const index = Math.floor(Math.random() * maxWinChance.length);
                let count = 0;
                maxWinChance.forEach((num, i) => {
                    if(gameBoard[maxWinChance[i]]['iconID']){
                        count++;
                    }    
                })
                if(gameBoard[maxWinChance[index]]['iconID'] && count < maxWinChance.length){
                    this.opponentNextMove();
                    return;    
                }
                gameBoard[maxWinChance[index]]['iconID'] = opponentDetails['id'];
                gameBoard[maxWinChance[index]]['icon'] = opponentDetails['icon'];
                this.setState({gameBoard}, () => {
                    const { winningCombination, gameBoard } = this.state;
                    for(let i = 0; i < winningCombination.length; i++){
                        const item = winningCombination[i];
                        let value = 0;
                        for(let j = 0; j < item.length; j++){
                            //console.log("SCAN GAME BOARD: ", i, j)
                            if(gameBoard[item[j]]['iconID'] === opponentDetails['id']){
                                value++;
                            }  
                            if(value === item.length){
                                //console.log("BEFORE TIMER CLEAR ", this.myTimer)
                                clearInterval(this.myTimer);
                                //console.log("AFTER TIMER CLEAR ", this.myTimer)
                                this.setState({
                                    finish: true, showLevelSelector: true, winnerDetails: this.state.levelDetails.id
                                }, () => {
                                    //console.log("SETSTATE CALLBACK ", this.myTimer)
                                    //alert("Computer Won");
                                });
                                return;
                            }
                        }
                    }
                    // maxWinChance.forEach((num, i) => {
                    //     if(gameBoard[maxWinChance[i]]['iconID'] === opponentDetails['id']){
                    //         value++;
                    //     }    
                    // })
                });
            }
        }
    }

    
    /**
     * tieFunction()
     * 
     * This function is called when the match is a TIE and clears timer if the GAME is in Level 3 or 4.
     * @memberof TicTacToe
     */
    tieFunction = () => {
        const { levelDetails } = this.state;
        if(levelDetails.id === '3' || levelDetails.id === '4' ){
            clearInterval(this.myTimer);
        }
        this.setState({winnerDetails: `tie-${levelDetails.id}`}, () => {
            this.setState({
                finish: true, showLevelSelector: true
            }, () => {
                //alert("Its a tie!")
            })
        })
    }

    render(){
        const { 
            selection, hideSelection, enableGame, showSelection, finish, gameBoard, animateBlurRadius,
            showLevelSelector, levelDetails, winnerDetails, timeLeft, animateColor, timeOut
        } = this.state;
        const { playButton, boldFont, boxSize } = styles;
        const hiddenStyle = {
            transform: [
                {
                    scale: hideSelection.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1]
                    })
                }
            ]
        }
        const showGameBoard = {
            transform: [
                {
                    scale: enableGame.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1]
                    })
                }
            ]
        }
        let timerStyle = 'transparent';
        if(levelDetails){
            if(levelDetails.id === '3'){
                timerStyle = animateColor.interpolate({
                    inputRange: [1, 3, 5],
                    outputRange: ['#CD113B', '#FFBE0F', '#66DE93'],
                    extrapolateLeft: 'clamp'
                })
            }else if(levelDetails.id === '4'){
                timerStyle = animateColor.interpolate({
                    inputRange: [1, 2, 3],
                    outputRange: ['#CD113B', '#FFBE0F', '#66DE93'],
                    extrapolateLeft: 'clamp'
                })
            }
        }
        const animateBG = animateBlurRadius.interpolate({
            inputRange: [0, 1],
            outputRange: [5, 0]
        })
        return (
            <SafeAreaView style={{flex: 1, justifyContent: 'center', backgroundColor: 'transparent'}}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                    {(showSelection) && (
                        <View style={[{borderColor: 'red', borderWidth: 0, justifyContent: 'center'}, getWidthnHeight(100, 100)]}>
                            <Animated.View 
                                style={[{
                                    alignItems: 'center', justifyContent: 'center', borderColor: 'red', 
                                    borderWidth: 0, backgroundColor: 'transparent'
                                }, hiddenStyle]}
                            >
                                <View 
                                    style={[{
                                        alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)'
                                    }, getWidthnHeight(100, 10), getMarginTop(-6), getMarginBottom(3)
                                ]}>
                                    <Text style={[{color: '#FFF5EB', fontWeight: 'normal'}, styles.boldFont, fontSizeH3()]}>Make a Selection</Text>
                                </View>
                                <FlatList 
                                    data={availableOptions}
                                    keyExtractor={(item) => `${item.id}`}
                                    renderItem={this.renderItem.bind(this)}
                                />
                                <TouchableOpacity 
                                    style={[playButton, {backgroundColor: (selection)? "#2FC4B2" : "#C4C4C4"}, getMarginTop(5)]}
                                    activeOpacity={(selection)? 0.7 : 1}
                                    onPress={() => {
                                        if(!selection){
                                            return;
                                        }
                                        this.setState({showLevelSelector: true})
                                    }}
                                >
                                    <Text style={[{color: '#FFFFFF', fontWeight: 'bold', letterSpacing: 2}, boldFont]}>PLAY</Text>
                                </TouchableOpacity>
                            </Animated.View>
                            <Animated.View style={[]}>
                                <View style={{position: 'absolute', alignSelf: 'flex-end'}}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.reloadDrawer(true);
                                            this.props.navigation.navigate('MainDrawer', {screen: 'Home'});
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <View style={[{
                                            backgroundColor: '#FDB44B', width: getWidthnHeight(20).width, height: getWidthnHeight(20).width,
                                            borderRadius: getWidthnHeight(10).width, alignItems: 'center', justifyContent: 'center'
                                        }, getMarginTop(13), getMarginRight(2)]}>
                                            <Text style={[{color: 'black', fontSize: (fontSizeH4().fontSize + 4)}]}>EXIT</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        </View>
                    )}
                    {(!showSelection) && (
                        <Animated.View style={[{justifyContent: 'center', alignItems: 'center'}, showGameBoard]}>
                            <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}, getWidthnHeight(80), getMarginBottom(5)]}>
                                <View style={{alignItems: 'center'}}>
                                    <View 
                                        style={[{
                                            width: getWidthnHeight(20).width, height: getWidthnHeight(20).width, borderRadius: getWidthnHeight(10).width,
                                            backgroundColor: '#F9D5A7', alignItems: 'center', justifyContent: 'center'
                                    }]}>
                                        <FontAwesome name='user-circle' size={getWidthnHeight(18).width}/>
                                    </View>
                                    <Text style={[{fontWeight: 'bold'}, fontSizeH4(), styles.boldFont]}>YOU</Text>
                                    {(selection) && (
                                        <View>
                                            {availableOptions.map((item) => {
                                                if(item.id === selection){
                                                    return item.icon
                                                }
                                            })}
                                        </View>
                                    )}
                                </View>
                                <Image source={require('../Image/versus.png')} resizeMode="contain" style={{
                                    width: getWidthnHeight(10).width, height: getWidthnHeight(10).width
                                }} />
                                <View style={{alignItems: 'center'}}>
                                    <View 
                                        style={[{
                                            width: getWidthnHeight(20).width, height: getWidthnHeight(20).width, borderRadius: getWidthnHeight(10).width,
                                            backgroundColor: '#F9D5A7', alignItems: 'center', justifyContent: 'center'
                                    }]}>
                                        <Image 
                                            style={{
                                                width: getWidthnHeight(18).width, height: getWidthnHeight(18).width,
                                                transform: [{scale: (levelDetails.id === '2')? 0.8 : 1}]
                                            }}
                                            source={(levelDetails.image)}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <Text style={[{fontWeight: 'bold'}, fontSizeH4(), styles.boldFont]}>{levelDetails.name}</Text>
                                    {(selection) && (
                                        <View>
                                            {availableOptions.map((item) => {
                                                if(item.id !== selection){
                                                    return item.icon
                                                }
                                            })}
                                        </View>
                                    )}
                                </View>
                            </View>
                            <FlatList 
                                keyExtractor={(item) => `${item.id}`}
                                data={gameBoard}
                                renderItem={this.renderGameBoard}
                                numColumns={levelDetails.rowCol}
                            />
                            <View style={[{alignItems: 'center'}, getWidthnHeight(60, 12), getMarginTop(5)]}>
                                
                                    <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}, getWidthnHeight(60)]}>
                                        <TouchableOpacity 
                                            style={[{
                                                backgroundColor: "#F39233", alignItems: 'center', justifyContent: 'center',
                                                width: getWidthnHeight(10).width, height: getWidthnHeight(10).width, borderRadius: getWidthnHeight(5).width
                                            }]}
                                            activeOpacity={(selection)? 0.7 : 1}
                                            onPress={() => {
                                                this.state.animateColor.setValue(0);
                                                clearInterval(this.myTimer);
                                                this.setState({
                                                    showSelection: true, finish: false, gameBoard: new Array(9).fill(null),
                                                    timeLeft: 0, timeOut: false, winningCombination: [
                                                        [0, 1, 2],
                                                        [3, 4, 5],
                                                        [6, 7, 8],
                                                        [0, 3, 6],                              //Winnning combinations for 3 x 3 Game Board     
                                                        [1, 4, 7],
                                                        [2, 5, 8],
                                                        [0, 4, 8],
                                                        [2, 4, 6]
                                                    ]
                                                }, () => {
                                                    this.initializeGameBoard();
                                                    this.enlargeSelection();
                                                })
                                                this.state.hideSelection.setValue(1);
                                                this.state.enableGame.setValue(0);
                                            }}
                                        >
                                            <IonIcons name={'arrow-back'} color="#FFFFFF" size={getWidthnHeight(6).width}/>
                                        </TouchableOpacity>
                                        {(finish)&& (
                                            <TouchableOpacity 
                                                style={[playButton, {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: "#F39233"}, getWidthnHeight(33)]}
                                                activeOpacity={(selection)? 0.7 : 1}
                                                onPress={() => {
                                                    const { levelDetails } = this.state;
                                                    if(levelDetails){
                                                        if(levelDetails.id === '3'){
                                                            this.setState({timerCount: 5})
                                                        }else if(levelDetails.id === '4'){
                                                            this.setState({timerCount: 3})
                                                        }
                                                    }
                                                    let rowCol = (levelDetails.rowCol === 3)? 9 : 16;
                                                    let combinations = (rowCol === 9)? [
                                                            [0, 1, 2],
                                                            [3, 4, 5],
                                                            [6, 7, 8],
                                                            [0, 3, 6],                              //Winnning combinations for 3 x 3 Game Board     
                                                            [1, 4, 7],
                                                            [2, 5, 8],
                                                            [0, 4, 8],
                                                            [2, 4, 6]
                                                        ]
                                                    :
                                                        [
                                                            [0, 1, 2, 3],
                                                            [4, 5, 6, 7],
                                                            [8, 9, 10, 11],
                                                            [12, 13, 14, 15],                       //Winnning combinations for 4 x 4 Game Board     
                                                            [0, 4, 8, 12],
                                                            [1, 5, 9, 13],
                                                            [2, 6, 10, 14],
                                                            [3, 7, 11, 15],
                                                            [0, 5, 10, 15],
                                                            [3, 6, 9, 12]
                                                        ]
                                                    this.setState({
                                                        finish: false, gameBoard: new Array(rowCol).fill(null),
                                                        winningCombination: combinations, timeOut: false, timeLeft: 0
                                                    }, () => this.initializeGameBoard());
                                                }}
                                            >
                                                <IonIcons name={'reload-circle-sharp'} color="#FFFFFF" size={getWidthnHeight(8).width}/>
                                                <Text style={[{color: '#FFFFFF', fontWeight: 'bold', letterSpacing: 1}, boldFont]}>RESTART</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    {(!finish && (levelDetails.id === '3' || levelDetails.id === '4' )) && (
                                        <View style={[getMarginTop(3)]}>
                                            <AnimatedCircularProgress
                                                size={Math.floor(getWidthnHeight(20).width)}
                                                width={getWidthnHeight(2).width}
                                                fill={timeLeft}
                                                tintColor={timerStyle}
                                                backgroundColor="#D1D2D4"
                                            >
                                                {(fill) => (
                                                    <View>
                                                        <Text style={[fontSizeH3()]}>{this.state.timerCount}</Text>
                                                    </View>
                                                )}
                                            </AnimatedCircularProgress>
                                        </View>
                                    )}
                            </View>
                        </Animated.View>
                    )}
                    {(showLevelSelector) && (
                        <LevelSelection 
                            isVisible={showLevelSelector}
                            toggle={() => this.setState({showLevelSelector: false, timeOut: false})}
                            timeOut={timeOut}
                            startGame={(item) => {
                                this.setState({
                                    difficultyLevel: item.difficultyLevel, enableFoxMode: item.enableFoxMode, 
                                    showLevelSelector: false, levelDetails: item, timeOut: false
                                    }, () => {
                                        const { levelDetails } = this.state;
                                        if(levelDetails){
                                            if(levelDetails.id === '3'){
                                                this.setState({timerCount: 5})
                                            }else if(levelDetails.id === '4'){
                                                this.setState({timerCount: 3})
                                            }
                                        }
                                        if(item.rowCol === 4){
                                            this.setState({
                                                gameBoard: new Array(16).fill(null),
                                                winningCombination: [
                                                    [0, 1, 2, 3],
                                                    [4, 5, 6, 7],
                                                    [8, 9, 10, 11],
                                                    [12, 13, 14, 15],                              //Winnning combinations for 4 x 4 Game Board     
                                                    [0, 4, 8, 12],
                                                    [1, 5, 9, 13],
                                                    [2, 6, 10, 14],
                                                    [3, 7, 11, 15],
                                                    [0, 5, 10, 15],
                                                    [3, 6, 9, 12]
                                                ],
                                            }, () => {
                                                this.initializeGameBoard(true);
                                            })
                                        }else{
                                            this.setState({
                                                gameBoard: new Array(9).fill(null),
                                                winningCombination: [
                                                    [0, 1, 2],
                                                    [3, 4, 5],
                                                    [6, 7, 8],
                                                    [0, 3, 6],                              //Winnning combinations for 3 x 3 Game Board     
                                                    [1, 4, 7],
                                                    [2, 5, 8],
                                                    [0, 4, 8],
                                                    [2, 4, 6]
                                                ],
                                            }, () => this.initializeGameBoard(true));
                                        }
                                })
                            }}
                            finish={finish}
                            winnerDetails={winnerDetails}
                        />
                    )}
                </View>
                <View 
                    style={[{
                        zIndex: -10, backgroundColor: 'rgba(22, 24, 83, 0.3)', alignItems: 'center',
                        overflow: 'hidden'
                    }, StyleSheet.absoluteFill]} 
                    pointerEvents="none"
                >
                    <Image 
                        style={[{flex: 1, opacity: 0.3}, getMarginLeft(50)]} 
                        blurRadius={5}
                        resizeMethod="resize" 
                        resizeMode="contain" 
                        source={require('../Image/iceAge.jpg')}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    iconBG: {
        width: getWidthnHeight(50).width,
        height: getWidthnHeight(undefined, 10).height,
        backgroundColor: '#FBF8F1',
        shadowColor: '#000000',
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.2,
        elevation: 4,
        borderColor: 'red',
        borderWidth: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: getWidthnHeight(2).width
        //marginBottom: getMarginBottom(3).marginBottom
    },
    playButton: {
        width: getWidthnHeight(25).width,
        height: getWidthnHeight(undefined, 6).height,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: getWidthnHeight(2).width
    },
    boldFont: {
        ...Platform.select({
            android: {
                fontFamily: ''
            }
        })
    },
    boxSize: {
        width: getWidthnHeight(20).width,
        height: getWidthnHeight(20).width,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FBF8F1',
        marginRight: 1,
        marginBottom: 1
    }
})

export default connect(null, { reloadDrawer })(TicTacToe);