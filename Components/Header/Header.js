import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";

const { height, width } = Dimensions.get("window");

export default function Header() {
  return (
    <View
      style={{
        backgroundColor: "#F9C201",
        height: height * 0.07,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: width * 0.05,
        }}
      >
        Trackit
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
