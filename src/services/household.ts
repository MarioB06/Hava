import api from './api';
import axios from 'axios';

export interface HouseholdData {
    name: string;
    description?: string;
    country: string;
    city: string;
    address?: string;
    postcode?: string;
    type: string;
    user_limit?: number | null;
}

export const getMyHouseholds = async () => {
    const res = await api.get('/householdsAll');
    return res.data;
};


export const createHousehold = async (data: HouseholdData) => {
    const res = await api.post('/households', data);
    return res.data;
};