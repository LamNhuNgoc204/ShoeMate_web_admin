import { combineReducers } from 'redux';

// reducer import
import customizationReducer from './customizationReducer';
import userReducer from '../redux/reducer/userReducer';
import productsReducer from '../redux/reducer/productsReducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  customization: customizationReducer,
  users: userReducer,
  products: productsReducer
});

export default reducer;
