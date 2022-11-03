import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import Card from "../Components/Card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomModal from "../Components/CustomModal";
import uuid from "react-native-uuid";
import ProfileButton from "../Components/ProfileButton";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";

const { height, width } = Dimensions.get("window");
export default function HomeScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [modalSelector, setModalSelector] = useState(true);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [dateSelector, setDateSelector] = useState(false);
  const [date, setDate] = useState(new Date(Date.now()));
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [currnetItem, setCurrentItem] = useState({});
  const [editMode, setEditMode] = useState(false);
  // const [currentMode, setCurrentMode] = useState(true);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <ProfileButton />,
    });
  }, []);

  // const getLocalValues = async () => {
  //   const localData = await AsyncStorage.getItem("data");
  //   localData !== null ? setData(JSON.parse(localData).reverse()) : null;
  //   const localincome = await AsyncStorage.getItem("income");
  //   localincome !== null ? setIncome(JSON.parse(localincome)) : null;
  //   const localExpense = await AsyncStorage.getItem("expense");
  //   localExpense !== null ? setExpense(JSON.parse(localExpense)) : null;
  // };
  useEffect(() => {
    const getLocalValues = async () => {
      const localData = await AsyncStorage.getItem("data");
      localData !== null ? setData(JSON.parse(localData).reverse()) : null;
      const localincome = await AsyncStorage.getItem("income");
      localincome !== null ? setIncome(JSON.parse(localincome)) : null;
      const localExpense = await AsyncStorage.getItem("expense");
      localExpense !== null ? setExpense(JSON.parse(localExpense)) : null;
    };

    getLocalValues();
  }, []);
  const handleDelete = async (item) => {
    const newData = data.filter((data) => data.id !== item.id);
    await AsyncStorage.setItem("data", JSON.stringify(newData));
    if (item.type === "income") {
      const newIncome = income - item.price;
      await AsyncStorage.setItem("income", JSON.stringify(newIncome));
      setIncome(newIncome);
    } else {
      const newExpense = expense - item.price;
      await AsyncStorage.setItem("expense", JSON.stringify(newExpense));
      setExpense(newExpense);
    }
    setData(newData);
    setDetailsModalVisible(false);
  };
  const OnSave = async () => {
    const dateinstring = date.toDateString();
    if (!editMode) {
      if (amount == "" || description == "") {
        ToastAndroid.show("Please fill all the fields", ToastAndroid.SHORT);
      } else {
        await AsyncStorage.setItem(
          "data",
          JSON.stringify([
            ...data,
            {
              id: uuid.v4(),
              name: description,
              price: amount,
              type: modalSelector ? "income" : "expense",
              date: dateinstring,
            },
          ])
        );
        setData([
          ...data,
          {
            id: uuid.v4(),
            name: description,
            price: amount,
            type: modalSelector ? "income" : "expense",
            date: dateinstring,
          },
        ]);
        if (modalSelector) {
          await AsyncStorage.setItem(
            "income",
            JSON.stringify(income + parseInt(amount))
          );
          setIncome(income + parseInt(amount));
        } else {
          await AsyncStorage.setItem(
            "expense",
            JSON.stringify(expense + parseInt(amount))
          );
          setExpense(expense + parseInt(amount));
        }
        setAmount("");
        setDescription("");
        setModalVisible(false);
      }
    } else {
      if (amount == "" || description == "") {
        ToastAndroid.show("Please fill all the fields", ToastAndroid.SHORT);
      } else {
        const editedData = data.map((data) => {
          if (data.id === currnetItem.id) {
            return {
              id: data.id,
              name: description,
              price: amount,
              type: modalSelector ? "income" : "expense",
              date: dateinstring,
            };
          } else return data;
        });
        await AsyncStorage.setItem("data", JSON.stringify(editedData));
        setData(editedData);
        setAmount("");
        setDescription("");
        if (modalSelector) {
          if (currnetItem.type === "income") {
            const newIncome = income - currnetItem.price + parseInt(amount);
            await AsyncStorage.setItem("income", JSON.stringify(newIncome));
            setIncome(newIncome);
          } else {
            const newIncome = income + parseInt(amount);
            const newExpense = expense - currnetItem.price;
            await AsyncStorage.setItem("income", JSON.stringify(newIncome));
            await AsyncStorage.setItem("expense", JSON.stringify(newExpense));
            setIncome(newIncome);
            setExpense(newExpense);
          }
        } else {
          if (currnetItem.type === "expense") {
            const newExpense = expense - currnetItem.price + parseInt(amount);
            await AsyncStorage.setItem("expense", JSON.stringify(newExpense));
            setExpense(newExpense);
          } else {
            const newExpense = expense + parseInt(amount);
            const newIncome = income - currnetItem.price;
            await AsyncStorage.setItem("expense", JSON.stringify(newExpense));
            await AsyncStorage.setItem("income", JSON.stringify(newIncome));
            setExpense(newExpense);
            setIncome(newIncome);
          }
        }
      }
    }
    setModalVisible(false);
  };

  const onChange = async (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    setDateSelector(true);
  };
  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: false,
    });
  };

  const handleEdit = async (item) => {
    setDetailsModalVisible(false);
    const currMode = item.type === "income" ? true : false;
    if (!currMode) {
      setModalSelector(false);
    }
    setAmount(item.price);
    setDescription(item.name);
    setDate(new Date(item.date));
    setEditMode(true);
    setModalVisible(true);
  };

  return (
    <View
      style={{
        alignItems: "center",
      }}
    >
      <StatusBar backgroundColor="#F9C201" />
      {/* top box balance income expense */}
      <View
        style={{
          borderRadius: 5,
          borderWidth: 1,
          borderColor: "#D3D3D3",
          flexDirection: "row",
          alignItems: "center",
          width: width * 0.9,
          justifyContent: "space-between",
          padding: width * 0.05,
          marginTop: height * 0.03,
        }}
      >
        <View
          style={{
            marginLeft: width * 0.05,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#626058",
            }}
          >
            Balance
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: height * 0.03,
              color: "#02BEE8",
            }}
          >
            ${income - expense}
          </Text>
        </View>
        <View
          style={{
            borderLeftWidth: 1,
            borderColor: "#D3D3D3",
            height: height * 0.15,
          }}
        ></View>
        <View
          style={{
            marginRight: width * 0.1,
          }}
        >
          <View
            style={{
              marginBottom: height * 0.02,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#626058",
              }}
            >
              Income
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: height * 0.03,
                color: "#00B152",
              }}
            >
              ${income}
            </Text>
          </View>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: height * 0.03,
                color: "#D10000",
              }}
            >
              ${expense}
            </Text>
            <Text
              style={{
                color: "#626058",
              }}
            >
              Expense
            </Text>
          </View>
        </View>
      </View>
      {/* today */}
      <View
        style={{
          marginTop: height * 0.03,
          alignItems: "center",
          flexDirection: "column",
          height: height * 0.5,
        }}
      >
        <FlatList
          data={data}
          style={{ flex: 1 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setCurrentItem(item);
                setDetailsModalVisible(true);
              }}
            >
              <Card {...item} />
            </TouchableOpacity>
          )}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <BlurView intensity={60} tint="dark" style={styles.contentWrap}>
          <View
            style={{
              marginTop: height * 0.06,
              backgroundColor: "white",
              flex: 1,
              borderRadius: 20,
              width: width,
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: height * 0.02,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: height * 0.02,
                  width: width * 0.9,
                  marginLeft: width * 0.45,
                }}
              >
                <Text
                  style={{
                    fontSize: height * 0.02,
                    color: "#626058",
                  }}
                >
                  {editMode ? "Edit" : null} Add Income/Expense
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <View
                    style={{
                      marginLeft: width * 0.2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: height * 0.025,
                        color: "#626058",
                      }}
                    >
                      X
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              {/* income/expense buttons */}

              <View
                style={{
                  flexDirection: "row",
                  width: width * 0.4,
                  justifyContent: "space-between",
                  height: height * 0.06,
                }}
              >
                <View
                  style={{
                    padding: width * 0.032,
                    backgroundColor: modalSelector ? "#F9C201" : "#D3D3D3",
                    justifyContent: "center",
                    borderBottomLeftRadius: 10,
                    borderTopLeftRadius: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      modalSelector ? null : setModalSelector(true);
                    }}
                  >
                    <Text
                      style={{
                        color: modalSelector ? "white" : "black",
                      }}
                    >
                      Income
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    padding: width * 0.032,
                    backgroundColor: !modalSelector ? "#F9C201" : "#D3D3D3",
                    justifyContent: "center",
                    borderBottomRightRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      !modalSelector ? null : setModalSelector(false);
                    }}
                  >
                    <Text
                      style={{
                        color: !modalSelector ? "white" : "black",
                      }}
                    >
                      Expense
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  marginTop: height * 0.02,
                  height: height * 0.3,
                  width: width * 0.9,
                  justifyContent: "space-between",
                }}
              >
                <TextInput
                  value={amount}
                  style={{
                    borderWidth: 1,
                    borderColor: "#D3D3D3",
                    height: height * 0.08,
                    borderRadius: 10,
                    padding: width * 0.05,
                  }}
                  onChangeText={(text) => setAmount(text)}
                  keyboardType="number-pad"
                  placeholder="Amount"
                />
                <TextInput
                  value={description}
                  onChangeText={(text) => setDescription(text)}
                  placeholder="Description"
                  style={{
                    borderWidth: 1,
                    padding: width * 0.05,
                    borderColor: "#D3D3D3",
                    height: height * 0.08,
                    borderRadius: 10,
                  }}
                />
                {/* <TextInput
                value={date}
                onChangeText={(text) => setDate(text)}
                placeholder="Date"
                style={{
                  borderWidth: 1,
                  borderColor: "#D3D3D3",
                  height: height * 0.08,
                  borderRadius: 10,
                }}
              /> */}
                <TouchableOpacity onPress={() => showMode("date")}>
                  <Text
                    style={{
                      borderWidth: 1,
                      borderColor: "#D3D3D3",
                      height: height * 0.08,
                      borderRadius: 10,
                      color: "#D3D3D3",
                      padding: width * 0.05,
                    }}
                  >
                    {dateSelector ? date.toDateString() : "Date"}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  OnSave();
                }}
              >
                <Text
                  style={{
                    color: "#F9C201",
                    fontSize: height * 0.03,
                    marginTop: height * 0.02,
                  }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsModalVisible}
        onRequestClose={() => {
          setDetailsModalVisible(!detailsModalVisible);
        }}
      >
        <BlurView intensity={60} tint="dark" style={styles.contentWrap}>
          <View
            style={{
              marginTop: height * 0.06,
              backgroundColor: "white",
              flex: 1,
              borderRadius: 20,
              width: width,
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: height * 0.02,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: height * 0.02,
                  width: width * 0.9,
                  marginLeft: width * 0.75,
                }}
              >
                <Text
                  style={{
                    fontSize: height * 0.02,
                    color: "#626058",
                  }}
                >
                  {currnetItem.type}
                </Text>
                <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                  <View
                    style={{
                      marginLeft: width * 0.3,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: height * 0.025,
                        color: "#626058",
                      }}
                    >
                      X
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  fontSize: height * 0.05,
                  color: currnetItem.type === "income" ? "#00B152" : "#D10000",
                  marginVertical: height * 0.04,
                }}
              >
                ${currnetItem.price}
              </Text>
              <Text
                style={{
                  fontSize: height * 0.02,
                  color: "#626058",
                }}
              >
                {currnetItem.name}
              </Text>
              <Text
                style={{
                  color: "#626058",
                }}
              >
                {currnetItem.date}
              </Text>
              <TouchableOpacity onPress={() => handleEdit(currnetItem)}>
                <Text
                  style={{
                    color: "#F9C201",
                    fontSize: height * 0.02,
                    marginTop: height * 0.05,
                    fontWeight: "bold",
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleDelete(currnetItem);
                }}
              >
                <Text
                  style={{
                    marginTop: height * 0.02,
                    color: "#626058",
                  }}
                >
                  delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

      <TouchableOpacity
        onPress={() => {
          setEditMode(false);
          setModalVisible(!modalVisible);
          setAmount("");
          setDescription("");
        }}
      >
        <View
          style={{
            backgroundColor: "#F9C201",
            height: height * 0.1,
            width: height * 0.1,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            marginTop: height * 0.01,
          }}
        >
          <Text
            style={{
              fontSize: 50,
              color: "white",
            }}
          >
            +
          </Text>
        </View>
      </TouchableOpacity>
      {/* <View></View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  contentWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
