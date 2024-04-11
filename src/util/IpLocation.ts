/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable unicorn/no-empty-file */
import maxmind from 'maxmind';

const mmdb_file_path = './assets/database/loc-db.mmdb';

export interface IPDetailsResponse {
  pincode: string;
  ip_address: string;
  city: string;
  continent: {
    continent_code: string;
    continent_name: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  country: {
    country_iso_code: string;
    country_name: string;
    time_zone: string;
  };
  state: {
    state_code: string;
    state_name: string;
  };
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const getIpLocation = async (client_ip: string): Promise<IPDetailsResponse> => {
  const lookup = await maxmind.open(mmdb_file_path);

  const ip_data = lookup.get(client_ip || '');

  if (!ip_data) {
    return {
      pincode: 'Unknown',
      ip_address: client_ip,
      city: 'Unknown',
      continent: {
        continent_code: 'Unknown',
        continent_name: 'Unknown',
      },
      location: {
        latitude: 0,
        longitude: 0,
      },
      country: {
        country_iso_code: 'Unknown',
        country_name: 'Unknown',
        time_zone: 'Unknown',
      },
      state: {
        state_code: 'Unknown',
        state_name: 'Unknown',
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { city, continent, country, location, postal, registered_country, subdivisions }: any = ip_data;

  const city_name = city && city.names && city.names.en ? city.names.en : 'Unknown';
  const continent_code = continent && continent.code ? continent.code : 'Unknown';
  const continent_name = continent && continent.name && continent.names.en ? continent.names.en : 'Unknown';
  const country_iso_code = country && country.iso_code ? country.iso_code : 'Unknown';
  const latitude = location && location.latitude ? location.latitude : 'Unknown';
  const longitude = location && location.longitude ? location.longitude : 'Unknown';
  const time_zone = location && location.time_zone ? location.time_zone : 'Unknown';
  const pincode = postal && postal.code ? postal.code : 'Unknown';
  const country_name = registered_country && registered_country.names ? registered_country.names.en : 'Unknown';
  let state_code;
  let state_name;

  if (subdivisions && subdivisions.length > 0) {
    state_code = subdivisions[0].iso_code || 'Unknown';
    state_name = subdivisions[0].names.en || 'Unknown';
  }

  return {
    pincode,
    ip_address: client_ip,
    city: city_name,
    continent: {
      continent_code,
      continent_name,
    },
    location: {
      latitude,
      longitude,
    },
    country: {
      country_iso_code,
      country_name,
      time_zone,
    },
    state: {
      state_code,
      state_name,
    },
  };
};
