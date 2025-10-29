import {
  View
} from 'react-native';
import tw from 'twrnc';
import CategoryList from '../modules/CategoryList/CategoryList';

const Category = () => {
  
  return(
    <View style={tw`flex-1`}>
      <CategoryList />
    </View>
  )
}
export default Category