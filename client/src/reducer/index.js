import { combineReducers } from 'redux';
import { itemReducer } from './itrmReducer';

export default combineReducers({
    item : itemReducer
})
