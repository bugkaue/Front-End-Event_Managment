import axios from "axios";

const connector = axios.create({
    baseURL: 'https://localhost:7062/api',
});

export default connector;