import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function ProfileButton() {
  const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Profile");
        }}
      >
        <Image source={require("../assets/Iconuser.png")} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
