import React from "react";
import { Helmet } from "react-helmet";

const Head = () => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme_color" content="#34CB79" />

      <link
        href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap"
        rel="stylesheet"
      />
      <title>Ecoleta</title>
    </Helmet>
  );
};

export default Head;
