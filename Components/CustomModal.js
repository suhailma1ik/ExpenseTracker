import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
const { height, width } = Dimensions.get("window");

export default function CustomModal({ modalVisible, setModalVisible }) {
  // const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View>
          <Text>hy</Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({});
