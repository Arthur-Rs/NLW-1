import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";

import { FiArrowLeft } from "react-icons/fi";

import { Map, TileLayer, Marker } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import Logo from "../../assets/logo.svg";
import { Container } from "./styles";

import api from "../../services/api";
import apiIbge from "../../services/ibge";

interface Item {
  id: number;
  title: string;
  image_url: string;
  selected: boolean;
}

interface ICoords {
  latitude: number;
  longitude: number;
}

interface InputData {
  name: string;
  email: string;
  whatsapp: string;
  uf: string;
  city: string;
}

interface IUf {
  id: number;
  nome: string;
  sigla: string;
  regiao: {
    id: number;
    nome: string;
    sigla: string;
  };
}

interface ICity {
  id: number;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: {
      id: number;
      nome: string;
      UF: {
        id: number;
        nome: string;
        sigla: string;
        regiao: {
          id: number;
          nome: string;
          sigla: string;
        };
      };
    };
  };
}

const CreatePoint: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<IUf[]>([]);
  const [citys, setCitys] = useState<ICity[]>([]);
  const [coords, setCoords] = useState<ICoords>({ latitude: 0, longitude: 0 });
  const [inputData, setInputData] = useState<InputData>({
    name: "",
    email: "",
    whatsapp: "",
    uf: "",
    city: "",
  });

  const history = useHistory();

  useEffect(() => {
    api.get("/items").then((res) => setItems(res.data));
    apiIbge.get("/estados").then((res) => setUfs(res.data));

    navigator.geolocation.getCurrentPosition((position) => {
      const _coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setCoords(_coords);
    });
  }, []);

  const HandleSelectUf = (uf: string) => {
    apiIbge.get(`/estados/${uf}/municipios`).then((res) => setCitys(res.data));
    setInputData({ ...inputData, uf });
  };

  const HandleSelectCity = (city: string) => {
    setInputData({ ...inputData, city });
  };

  const HandleSelectItem = (id: number) => {
    const select = items.map((item) => {
      if (item.id === id) {
        if (item.selected === true) {
          return { ...item, selected: false };
        } else {
          return { ...item, selected: true };
        }
      } else {
        return item;
      }
    });

    setItems(select);
  };

  const HandleSelectCoords = (e: LeafletMouseEvent) => {
    const _coords = { latitude: e.latlng.lat, longitude: e.latlng.lng };
    setCoords(_coords);
  };

  const HandleGetInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    switch (e.target.name) {
      case "name":
        setInputData({ ...inputData, name: value });
        break;
      case "email":
        setInputData({ ...inputData, email: value });
        break;
      case "whatsapp":
        setInputData({ ...inputData, whatsapp: value });
        break;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const { name, email, whatsapp, uf, city } = inputData;
    const _items = items.filter((item) => item.selected === true);
    const itemsID = _items.map((item) => item.id);
    const data = {
      name,
      email,
      whatsapp,
      latitude: coords.latitude,
      longitude: coords.longitude,
      uf,
      city,
      items: itemsID,
    };

    await api
      .post("/points", data)
      .then(() => {
        alert("Ponto de coleta cadastrado com sucesso!");
      })
      .catch(() => {
        alert("Houve um erro ao cadastrar o ponto de coleta :(");
      });

    history.push("/");
  };

  return (
    <Container>
      <header>
        <img src={Logo} alt="ecoleta-logo" />
        <Link to="/">
          <span>
            <FiArrowLeft />
          </span>
          Voltar para Home
        </Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do <br />
          ponto de coleta
        </h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={HandleGetInput}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={HandleGetInput}
              />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={HandleGetInput}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione um edereço de coleta</span>
          </legend>

          <Map
            center={[coords.latitude, coords.longitude]}
            zoom={16}
            onClick={HandleSelectCoords}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[coords.latitude, coords.longitude]} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                onChange={(e) => HandleSelectUf(e.target.value)}
              >
                {ufs.map((uf) => (
                  <option key={uf.id} value={uf.sigla}>
                    {uf.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                onChange={(e) => HandleSelectCity(e.target.value)}
              >
                {citys.length > 0 ? (
                  citys.map((city) => (
                    <option key={city.id} value={city.nome}>
                      {city.nome}
                    </option>
                  ))
                ) : (
                  <option>Selecione um estado</option>
                )}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítem de coleta</h2>
            <span>Selecione um ou mais ítems abixo</span>
          </legend>

          <ul className="items-grid">
            {items.map((item) => (
              <li
                className={item.selected === true ? "selected" : ""}
                key={item.id}
                onClick={() => {
                  HandleSelectItem(item.id);
                  console.log("o");
                }}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </Container>
  );
};

export default CreatePoint;
