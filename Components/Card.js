import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
const { height, width } = Dimensions.get("window");
export default function Card({ name, price, type, date }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: width * 0.9,
        height: height * 0.08,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: height * 0.01,
        padding: 15,
        borderColor: "#D3D3D3",
      }}
    >
      <Text
        style={{
          color: "#626058",
          fontSize: 18,
        }}
      >
        {name}
      </Text>
      <Text
        style={{
          color: type === "income" ? "#00B152" : "#D10000",
          fontSize: 18,
        }}
      >
        ${price}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
