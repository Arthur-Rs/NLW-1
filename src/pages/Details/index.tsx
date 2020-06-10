import React, { useContext, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  Linking,
} from "react-native";

import { RectButton } from "react-native-gesture-handler";

import api from "../../services/api";

import { AppLoading } from "expo";
import { composeAsync } from "expo-mail-composer";

import { Feather as Icon, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { idDetails } from "../Points";

import styles from "./styles";
import { Ipoint, Iitem } from "./interfaces";

const Details: React.FC = () => {
  const [pointData, setPointData] = useState<Ipoint>({} as Ipoint);

  const [pointItems, setPointItems] = useState<Iitem>({} as Iitem);

  const navigation = useNavigation();

  const id = useContext(idDetails);

  useEffect(() => {
    api.get(`/points/${id}`).then((res) => setPointData(res.data.point));
  }, []);

  useEffect(() => {
    const getItems = async () => {
      const data = await api.get(`/points/${id}`);
      const items = data.data.items;
      const itemsName: string[] = items.map((item: Iitem) => item.title);
      const seriledItems: Iitem = { title: itemsName.toString() };
      setPointItems(seriledItems);
    };

    getItems();
  }, []);

  const HandleGoBack = () => {
    navigation.goBack();
  };

  const HandleEmail = async () => {
    await composeAsync({
      recipients: [pointData.email],
      subject: "Contato",
    });
  };

  const HandleWhatsapp = async () => {
    const msg = "Óla, tenho interesse em seu ponto de coleta!";
    await Linking.openURL(
      `whatsapp://send?phone=${pointData.whatsapp}&text=${msg}`
    );
  };
  if (pointData.name === "") {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={HandleGoBack}>
          <Icon name="arrow-left" size={25} color="#34CB79" />
        </TouchableOpacity>

        <Image style={styles.pointImage} source={{ uri: pointData.image }} />

        <Text style={styles.pointName}>{pointData.name}</Text>
        <Text style={styles.pointItems}>{pointItems.title}</Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>
            {pointData.city}/ {pointData.uf}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={HandleWhatsapp}>
          <FontAwesome name="whatsapp" size={20} color="#fff"></FontAwesome>
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>

        <RectButton style={styles.button} onPress={HandleEmail}>
          <Icon name="mail" size={20} color="#fff"></Icon>
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  );
};

export default Details;
