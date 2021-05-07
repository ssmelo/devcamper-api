import nodeGeocoder from 'node-geocoder';

const options: any = {
    provider: process.env.GEOCODER_PROVIDER,
    httpAdapter: 'http',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

const geocoder = nodeGeocoder(options);

export default geocoder;

