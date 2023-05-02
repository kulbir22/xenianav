import {CARD_KEY} from '../actions/types';

export default (state, action) => {
    switch(action.type){
        case CARD_KEY:
            //console.log("LEAD CARD REDUCER SWITCH*******: ", action.payload)
            return {...state, key: action.payload};
        default:
            return {...state, key: null};
    }
}