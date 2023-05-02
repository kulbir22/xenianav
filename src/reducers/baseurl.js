import { SERVER_LINK } from "../actions/types";

export default (state = null, action) => {
    switch(action.type){
        case SERVER_LINK:
            return action.payload;
        default:
            return state;
    }
}