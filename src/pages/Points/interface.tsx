export interface Iitem {
  id: number;
  title: string;
  image_url: string;
}

export interface Ipoints {
  id: number;
  name: string;
  image: string;
  latitude: number;
  longitude: number;
}

export interface Icoords {
  lat: number;
  log: number;
}

export interface Idata {
  city: string;
  uf: string;
}
