import {SIDE_MENU} from '../actions/types';

export default (state = {sideMenu: null}, action) => {
    switch(action.type){
        case SIDE_MENU:
            //console.log("SIDE MENU REDUCER SWITCH*******: ", action.payload)
            return {...state, sideMenu: action.payload};
        default:
            return state;
    }
}