import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

const url = "https://jsonplaceholder.typicode.com/users";
// const ImageUrl = "https://i.pravatar.cc/300";
const { height, width } = Dimensions.get("window");
export default function ProfileScreen() {
  const [user, setUser] = useState({});
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setUser(data[0]);
        setAddress(
          data[0].address.street +
            ",Suite" +
            data[0].address.suite +
            "," +
            data[0].address.city
        );
      });
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#F9C201" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        marginTop: height * 0.1,
      }}
    >
      <Image
        style={{
          width: width * 0.3,
          height: width * 0.3,
          borderRadius: 100,
        }}
        source={require("../assets/placeholder.jpg")}
      />
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: "black",
        }}
      >
        {user.name}
      </Text>
      <Text>{user.email}</Text>
      <Text>{address}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
