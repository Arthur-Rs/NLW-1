import React, { useState, useEffect, createContext } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  SafeAreaView,
} from "react-native";
import {
  getCurrentPositionAsync,
  requestPermissionsAsync,
} from "expo-location";

import MapView, { Marker } from "react-native-maps";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SvgUri } from "react-native-svg";
import { Feather as Icon } from "@expo/vector-icons";

import styles from "./styles";
import Api from "../../services/api";
import { Iitem, Icoords, Ipoints, Idata } from "./interface";

export let idDetails = createContext(0);

const Points: React.FC = () => {
  const Navigator = useNavigation();

  const [items, setItems] = useState<Iitem[]>([]);
  const [points, setPoints] = useState<Ipoints[]>([]);
  const [coords, setCoords] = useState<Icoords>({} as Icoords);
  const [selectedItems, setSelectedItems] = useState<Number[]>([]);
  const [data, setData] = useState<Idata>({} as Idata);
  const routeData = useRoute();

  useEffect(() => {
    const params = routeData.params as Idata;

    setData({ uf: params.uf, city: params.city });
  }, []);

  useEffect(() => {
    Api.get("/items").then((res) => setItems(res.data));
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Ops...",
          "Precisamos da sua localização para continuarmos!"
        );
        Navigator.goBack();
      }

      const CorrentCoords = await getCurrentPositionAsync({});

      setCoords({
        lat: CorrentCoords.coords.latitude,
        log: CorrentCoords.coords.longitude,
      });
    };

    getLocation();
  }, []);

  useEffect(() => {
    Api.get("/points", {
      params: {
        uf: data.uf,
        city: data.city,
        items: selectedItems,
      },
    }).then((res) => setPoints(res.data.points));
  }, [selectedItems]);

  const HandleSelectItem = (id: number) => {
    const alreadySelected = selectedItems.findIndex((item) => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const HandleGoBack = () => {
    Navigator.goBack();
  };

  const HandlePressMark = (id: number) => {
    idDetails = createContext(id);
    Navigator.navigate("Details");
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={HandleGoBack}>
          <Icon name="arrow-left" size={25} color="#34CB79" />
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo!</Text>
        <Text style={styles.description}>
          Encontre um local de coleta mais próximo a você
        </Text>

        <View style={styles.mapContainer}>
          {coords.lat !== 0 && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: coords.lat,
                longitude: coords.log,
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
              {points.map((point) => (
                <Marker
                  style={styles.mapMarker}
                  onPress={() => {
                    HandlePressMark(point.id);
                  }}
                  key={String(point.id)}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                >
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={{ uri: point.image }}
                    />
                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </SafeAreaView>

      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}
        >
          {items.map((item) => (
            <TouchableOpacity
              key={String(item.id)}
              onPress={() => HandleSelectItem(item.id)}
              style={[
                styles.item,
                selectedItems.includes(item.id) ? styles.selectedItem : {},
              ]}
              activeOpacity={0.6}
            >
              <SvgUri width={42} height={42} uri={item.image_url} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default Points;
