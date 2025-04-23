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

export interface HouseholdSettings {
    points_enabled: number;
    points_per_task: number;
    notifications_enabled: number;
    calendar_visible_to_all: number;
    finances_visible_to_all: number;
    task_rotation: number;
    task_skip_allowed: number;
    reminder_minutes_before_event: number;
    default_reminder_time: string;
    chat_enabled: number;
    documents_enabled: number;
    polls_enabled: number;
    feedback_enabled: number;
    invites_enabled: number;
    color: string;
    icon: string;
}


export const getMyHouseholds = async () => {
    const res = await api.get('/householdsAll');
    return res.data;
};


export const createHousehold = async (data: HouseholdData) => {
    const res = await api.post('/households', data);
    return res.data;
};

export const updateHouseholdSettings = async (
    householdId: number,
    settings: HouseholdSettings
) => {
    const res = await api.put(`/households/${householdId}/settings`, settings);
    return res.data;
};
