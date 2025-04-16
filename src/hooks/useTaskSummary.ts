import { useEffect, useState } from 'react';
import api from '../services/api';

interface TaskSummary {
    filter: 'week' | 'today';
    total: number;
    done: number;
    open: number;
}

export const useTaskSummary = (householdId: number, filter: 'week' | 'today' = 'week') => {
    const [summary, setSummary] = useState<TaskSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                // Logge die Anfrage, die du an den API-Server sendest
                const res = await api.get(`/households/${householdId}/tasks/summary?filter=${filter}`);
                setSummary(res.data);
            } catch (e) {
                console.error('Fehler beim Laden der Aufgaben-Zusammenfassung', e);
            } finally {
                setLoading(false);
                console.log('Finished loading task summary');
            }
        };

        if (householdId) {
            console.log(`HouseholdId is valid: ${householdId}, proceeding to fetch task summary.`);
            fetchSummary();
        } else {
            console.log('No householdId provided, skipping task summary fetch');
        }
    }, [householdId, filter]);

    return {
        total: summary?.total ?? 0,
        done: summary?.done ?? 0,
        open: summary?.open ?? 0,
        loading,
    };
};
