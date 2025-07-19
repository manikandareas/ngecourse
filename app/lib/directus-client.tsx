import { createDirectus, rest, staticToken } from '@directus/sdk';
import axios from 'axios';
import type { CustomDirectusTypes } from '~/types/directus';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const BEARER_TOKEN = import.meta.env.VITE_BACKEND_KEY;

export const directusClient = createDirectus<CustomDirectusTypes>(BACKEND_URL)
  .with(staticToken(BEARER_TOKEN))
  .with(rest());

export const directusClientAxios = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    Authorization: `Bearer ${BEARER_TOKEN}`,
  },
});
