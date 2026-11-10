import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';

const { height, width } = Dimensions.get('window');

const Language = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ padding: '1%', backgroundColor: '#fff', height: height }}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      {}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={{ position: 'absolute', left: 10 }}
          onPress={() => navigation.goBack()}>
          <Entypo name="chevron-small-left" size={35} color="#000" />
        </TouchableOpacity>
        <Text style={styles.HeaderTitleTxt}>Language</Text>
      </View>

      {}
      <TouchableOpacity
        style={styles.fieldCont}
        onPress={() => setSelectedLanguage('English')}>
        <Text style={styles.fieldTxt}>English</Text>
        <View
          style={[
            styles.radioButton,
            selectedLanguage === 'English' && styles.radioButtonSelected,
          ]}
        />
      </TouchableOpacity>

      {}
      <TouchableOpacity
        style={styles.fieldCont}
        onPress={() => setSelectedLanguage('Spanish')}>
        <Text style={styles.fieldTxt}>Spanish</Text>
        <View
          style={[
            styles.radioButton,
            selectedLanguage === 'Spanish' && styles.radioButtonSelected,
          ]}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Language;

const styles = StyleSheet.create({
  fieldCont: {
    marginTop: '5%',
    height: height / 16,
    width: width - 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#c9c9c9',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '5%',
    justifyContent: 'space-between',
    paddingRight: '5%',
  },
  fieldTxt: {
    color: '#000',
    fontSize: width / 22,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D9D9D9', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#243352', 
    backgroundColor: '#5a9c05', 
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: height / 20,
    marginVertical: '4%',
  },
  HeaderTitleTxt: {
    color: '#000',
    fontSize: width / 18,
    fontWeight: '600',
  },
});
