import { SHOW_GAME } from "../actions/types";

export default (state = false, action) => {
    switch(action.type){
        case SHOW_GAME:
            return action.payload;
        default:
            return state;
    }
}