import React from "react";

import { Link } from "react-router-dom";

import { Container } from "./styles";

import logo from "../../assets/logo.svg";

import { FiLogIn } from "react-icons/fi";
const Home: React.FC = () => {
  return (
    <Container>
      <div className="content">
        <header>
          <img src={logo} alt="logo-ecoleta" />
        </header>
        <main>
          <h1>Seu marketplace de coleta de resíduos.</h1>
          <p>
            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
          </p>
          <Link to="/create-point">
            <span>
              <FiLogIn />
            </span>
            <strong>Cadastre um ponto de coleta</strong>
          </Link>
        </main>
      </div>
    </Container>
  );
};

export default Home;
