import React, { useState, useEffect } from "react";

import { RectButton } from "react-native-gesture-handler";
import { ImageBackground, View, Image, Text } from "react-native";

import { Roboto_400Regular, Roboto_500Medium } from "@expo-google-fonts/roboto";
import { Ubuntu_700Bold, useFonts } from "@expo-google-fonts/ubuntu";
import { AppLoading } from "expo";

import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";

import { Iuf, IapiIbge, Idata } from "./interfaces";
import styles from "./styles";

import ibge from "../../services/ibge";

const Home: React.FC = () => {
  const navigation = useNavigation();

  const [Ufs, setUfs] = useState<Iuf[]>([]);
  const [citys, setCitys] = useState<Iuf[]>([]);
  const [data, setData] = useState<Idata>({} as Idata);

  useEffect(() => {
    setData({ ...data, complete: false });
  }, []);

  useEffect(() => {
    const getUfs = async () => {
      const data = await ibge.get("/estados");
      const ufs = data.data;
      const seriledUfs = ufs.map((uf: IapiIbge) => ({
        label: uf.nome,
        value: uf.sigla,
      }));
      setUfs(seriledUfs);
    };
    getUfs();
  }, []);

  const HandleNavigatorToPoints = () => {
    navigation.navigate("Points", { uf: data.uf, city: data.city });
  };

  const HandleSelectUf = (uf: string) => {
    setData({
      ...data,
      uf,
    });

    const getCitys = async () => {
      const data = await ibge.get(`/estados/${uf}/municipios`);
      const citys = data.data;
      const seriledCitys = citys.map((uf: IapiIbge) => ({
        label: uf.nome,
        value: uf.nome,
      }));

      setCitys(seriledCitys);
    };
    getCitys();
  };

  const HandleSelectCity = (city: string) => {
    setData({
      ...data,
      city,
      complete: true,
    });
  };

  let [fontsLoaded] = useFonts({
    Roboto_500Medium,
    Roboto_400Regular,
    Ubuntu_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ImageBackground
      source={require("../../assets/home-background.png")}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require("../../assets/logo.png")} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coleta em forma eficiente
        </Text>
      </View>

      <RNPickerSelect onValueChange={HandleSelectUf} items={Ufs} />

      <RNPickerSelect onValueChange={HandleSelectCity} items={citys} />

      <View style={styles.footer}>
        <RectButton
          style={data.complete === true ? styles.button : styles.disableButton}
          onPress={data.complete === true ? HandleNavigatorToPoints : () => {}}
        >
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#fff" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

export default Home;
