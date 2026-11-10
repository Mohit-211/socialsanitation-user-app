
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GradientButton = ({ title, onPress }) => (
  <TouchableOpacity style={{flex:1}} onPress={onPress} activeOpacity={0.8}>
    <LinearGradient
      colors={['#243352', '#08F624']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        paddingVertical: 12,
        borderRadius: 50,
        alignItems: 'center',

      }}>
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

export default GradientButton;
