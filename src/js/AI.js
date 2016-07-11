/**
 * Created by saurabhk on 12/07/16.
 */
/*
 * Constructs an action that the ai player could make
 * @param pos [Number]: the cell position the ai would make its action in
 * made that action
 */
var AIAction = function(pos) {

    // public : the position on the board that the action would put the letter on
    this.movePosition = pos;

    //public : the minimax value of the state that the action leads to when applied
    this.minimaxVal = 0;

    /*
     * public : applies the action to a state to get the next state
     * @param state [State]: the state to apply the action to
     * @return [State]: the next state
     */
    this.applyTo = function(state) {
        var next = new State(state);

        //put the letter on the board
        next.boardState[this.movePosition[0]][this.movePosition[1]]  = state.turn ? "X" : "O";
        next.lastMove.x = this.movePosition[1];
        next.lastMove.y = this.movePosition[0];

        if(!state.turn){
            next.oMovesCount++;
        }
        next.turn  = !next.turn;

        //next.advanceTurn();

        return next;
    }
};

/*
 * public static function that defines a rule for sorting AIActions in ascending manner
 * @param firstAction [AIAction] : the first action in a pairwise sort
 * @param secondAction [AIAction]: the second action in a pairwise sort
 * @return [Number]: -1, 1, or 0
 */
AIAction.ASCENDING = function(firstAction, secondAction) {
    if(firstAction.minimaxVal < secondAction.minimaxVal)
        return -1; //indicates that firstAction goes before secondAction
    else if(firstAction.minimaxVal > secondAction.minimaxVal)
        return 1; //indicates that secondAction goes before firstAction
    else
        return 0; //indicates a tie
}

/*
 * public static function that defines a rule for sorting AIActions in descending manner
 * @param firstAction [AIAction] : the first action in a pairwise sort
 * @param secondAction [AIAction]: the second action in a pairwise sort
 * @return [Number]: -1, 1, or 0
 */
AIAction.DESCENDING = function(firstAction, secondAction) {
    if(firstAction.minimaxVal > secondAction.minimaxVal)
        return -1; //indicates that firstAction goes before secondAction
    else if(firstAction.minimaxVal < secondAction.minimaxVal)
        return 1; //indicates that secondAction goes before firstAction
    else
        return 0; //indicates a tie
}


/*
 * Constructs an AI player with a specific level of intelligence
 * @param level [String]: the desired level of intelligence
 */
var AI = function(level) {

    //private attribute: level of intelligence the player has
    var levelOfIntelligence = level;

    //private attribute: the game the player is playing
    var game = {};

    /*
     * private recursive function that computes the minimax value of a game state
     * @param state [State] : the state to calculate its minimax value
     * @returns [Number]: the minimax value of the state
     */
    function minimaxValue(state) {
        if(state.isStateTerminal()) {
            //a terminal game state is the base case
            return game.score(state);
        }
        else {
            var stateScore; // this stores the minimax value we'll compute

            if(state.turn)
            // X wants to maximize --> initialize to a value smaller than any possible score
                stateScore = -1000;
            else
            // O wants to minimize --> initialize to a value larger than any possible score
                stateScore = 1000;

            var availablePositions = state.emptyCells();

            //enumerate next available states using the info form available positions
            var availableNextStates = availablePositions.map(function(pos) {
                var action = new AIAction(pos);

                return action.applyTo(state);
            });
            /* calculate the minimax value for all available next states
             * and evaluate the current state's value */
            availableNextStates.forEach(function(nextState) {
                var nextScore = minimaxValue(nextState);
                if(state.turn) {
                    // X wants to maximize --> update stateScore iff nextScore is larger
                    if(nextScore > stateScore)
                        stateScore = nextScore;
                }
                else {
                    // O wants to minimize --> update stateScore iff nextScore is smaller
                    if(nextScore < stateScore)
                        stateScore = nextScore;
                }
            });

            return stateScore;
        }
    }

    /*
     * private function: make the ai player take a blind move
     * that is: choose the cell to place its symbol randomly
     * @param turn [String]: the player to play, either X or O
     */
    function takeABlindMove() {
        var available = game.currentState.emptyCells();
        var randomCell = available[Math.floor(Math.random() * available.length)];
        var action = new AIAction(randomCell);

        var next = action.applyTo(game.currentState);

        game.advanceToState(next);
    }

    /*
     * private function: make the ai player take a novice move,
     * that is: mix between choosing the optimal and suboptimal minimax decisions
     * @param turn [String]: the player to play, either X or O
     */
    function takeANoviceMove() {
        var available = game.currentState.emptyCells();

        //enumerate and calculate the score for each available actions to the ai player
        var availableActions = available.map(function(pos) {
            var action =  new AIAction(pos); //create the action object
            var nextState = action.applyTo(game.currentState); //get next state by applying the action

            action.minimaxVal = minimaxValue(nextState); //calculate and set the action's minimax value

            return action;
        });

        //sort the enumerated actions list by score
        if(turn === "X")
        //X maximizes --> sort the actions in a descending manner to have the action with maximum minimax at first
            availableActions.sort(AIAction.DESCENDING);
        else
        //O minimizes --> sort the actions in an ascending manner to have the action with minimum minimax at first
            availableActions.sort(AIAction.ASCENDING);

        /*
         * take the optimal action 40% of the time, and take the 1st suboptimal action 60% of the time
         */
        var chosenAction;
        if(Math.random()*100 <= 40) {
            chosenAction = availableActions[0];
        }
        else {
            if(availableActions.length >= 2) {
                //if there is two or more available actions, choose the 1st suboptimal
                chosenAction = availableActions[1];
            }
            else {
                //choose the only available actions
                chosenAction = availableActions[0];
            }
        }
        var next = chosenAction.applyTo(game.currentState);

        game.advanceToState(next);
    };

    /*
     * private function: make the ai player take a master move,
     * that is: choose the optimal minimax decision
     * @param turn [String]: the player to play, either X or O
     */
    function takeAMasterMove() {
        var available = game.currentState.emptyCells();

        //enumerate and calculate the score for each avaialable actions to the ai player
        var availableActions = available.map(function(pos) {
            var action =  new AIAction(pos); //create the action object
            var next = action.applyTo(game.currentState); //get next state by applying the action
            action.minimaxVal = minimaxValue(next); //calculate and set the action's minmax value
            return action;
        });
        console.log(availableActions);
        //sort the enumerated actions list by score
        //if(turn === "X")
        ////X maximizes --> sort the actions in a descending manner to have the action with maximum minimax at first
        //    availableActions.sort(AIAction.DESCENDING);
        //else
        //O minimizes --> sort the actions in an ascending manner to have the action with minimum minimax at first
        availableActions.sort(AIAction.ASCENDING);


        //take the first action as it's the optimal
        var chosenAction = availableActions[0];
        var next = chosenAction.applyTo(game.currentState);

        game.advanceToState(next);
    }


    /*
     * public method to specify the game the ai player will play
     * @param _game [Game] : the game the ai will play
     */
    this.plays = function(_game){
        game = _game;
    };

    /*
     * public function: notify the ai player that it's its turn
     * @param turn [String]: the player to play, either X or O
     */
    this.makeMove = function() {
        switch(levelOfIntelligence) {
            //invoke the desired behavior based on the level chosen
            case "blind": takeABlindMove(); break;
            case "novice": takeANoviceMove(); break;
            case "master": takeAMasterMove(); break;
        }
    };
};

module.exports = AI;