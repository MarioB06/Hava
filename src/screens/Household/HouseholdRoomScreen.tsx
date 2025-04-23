import React, { useEffect, useState } from 'react';
import {
    View, Text, ScrollView, ActivityIndicator, TextInput,
    TouchableOpacity, Modal, KeyboardAvoidingView, Platform,
    TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import api from '../../services/api';

export default function HouseholdRoomScreen() {
    const { theme } = useTheme();

    const [loading, setLoading] = useState(true);
    const [householdId, setHouseholdId] = useState<number | null>(null);
    const [rooms, setRooms] = useState<any[]>([]);
    const [roomTypes, setRoomTypes] = useState<any[]>([]);

    const [newRoomName, setNewRoomName] = useState('');
    const [selectedRoomType, setSelectedRoomType] = useState<number | null>(null);
    const [pickerVisible, setPickerVisible] = useState(false);

    useEffect(() => {
        const load = async () => {
            const id = await AsyncStorage.getItem('householdID');
            if (id) {
                setHouseholdId(parseInt(id));
                await fetchRoomTypes();
                await fetchRooms(parseInt(id));
            }else{
                // await AsyncStorage.clear();

            }
            setLoading(false);
        };
        load();
    }, []);

    const fetchRoomTypes = async () => {        
        const res = await api.get('/room-types');
        setRoomTypes(res.data);
    };

    const fetchRooms = async (id: number) => {
        const res = await api.get(`/households/${id}/rooms`);
        setRooms(res.data);
    };

    const createRoom = async () => {
        if (!newRoomName || !selectedRoomType || !householdId) return;

        await api.post(`/households/${householdId}/rooms`, {
            name: newRoomName,
            room_type_id: selectedRoomType,
        });

        setNewRoomName('');
        setSelectedRoomType(null);
        await fetchRooms(householdId);
    };

    const deleteRoom = async (roomId: number) => {
        if (!householdId) return;
        await api.delete(`/households/${householdId}/rooms/${roomId}`);
        await fetchRooms(householdId);
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.text} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} keyboardVerticalOffset={10}>
                    <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
                        <Text style={{ color: theme.text, fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Räume verwalten</Text>

                        {/* Eingabefeld */}
                        <View style={{ backgroundColor: theme.card, borderRadius: 12, padding: 16, marginBottom: 12 }}>
                            <Text style={{ color: theme.text + '99', fontSize: 13, marginBottom: 4 }}>Raumname</Text>
                            <TextInput
                                value={newRoomName}
                                onChangeText={setNewRoomName}
                                placeholder="z. B. Bad OG"
                                placeholderTextColor={theme.text + '66'}
                                style={{
                                    color: theme.text,
                                    fontSize: 16,
                                    paddingVertical: 4,
                                    borderBottomWidth: 1,
                                    borderBottomColor: theme.text + '33',
                                }}
                            />
                        </View>

                        {/* Raumtyp-Auswahl */}
                        <TouchableOpacity onPress={() => setPickerVisible(true)} style={{ backgroundColor: theme.card, borderRadius: 12, padding: 16, marginBottom: 12 }}>
                            <Text style={{ color: theme.text + '99', fontSize: 13, marginBottom: 4 }}>Raumtyp</Text>
                            <Text style={{ color: theme.text, fontSize: 16 }}>
                                {roomTypes.find(rt => rt.id === selectedRoomType)?.name || 'Auswählen'}
                            </Text>
                        </TouchableOpacity>

                        {/* Raum hinzufügen */}
                        <TouchableOpacity
                            onPress={createRoom}
                            style={{ backgroundColor: theme.accent, padding: 14, borderRadius: 10, marginBottom: 20 }}
                        >
                            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
                                Raum hinzufügen
                            </Text>
                        </TouchableOpacity>

                        {/* Raumliste */}
                        {rooms.map((room) => (
                            <View key={room.id} style={{ backgroundColor: theme.card, borderRadius: 10, padding: 14, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View>
                                    <Text style={{ color: theme.text, fontSize: 16 }}>{room.name}</Text>
                                    <Text style={{ color: theme.text + '88', fontSize: 13 }}>{room.room_type?.name}</Text>
                                </View>
                                <TouchableOpacity onPress={() => deleteRoom(room.id)}>
                                    <Text style={{ color: 'red', fontWeight: 'bold' }}>Löschen</Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                        {/* Raumtyp Picker */}
                        <Modal transparent visible={pickerVisible} animationType="slide">
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                <View style={{ backgroundColor: theme.card, borderRadius: 10, width: '80%', padding: 20 }}>
                                    <Text style={{ color: theme.text, marginBottom: 10 }}>Wähle den Raumtyp</Text>
                                    <Picker
                                        selectedValue={selectedRoomType}
                                        onValueChange={(value) => setSelectedRoomType(parseInt(value))}
                                        style={{ color: theme.text, height: 150 }}
                                        itemStyle={{ color: theme.text }}
                                    >
                                        {roomTypes.map((rt) => (
                                            <Picker.Item label={rt.name} value={rt.id} key={rt.id} />
                                        ))}
                                    </Picker>
                                    <TouchableOpacity onPress={() => setPickerVisible(false)} style={{ backgroundColor: theme.accent, padding: 12, borderRadius: 10 }}>
                                        <Text style={{ color: '#fff', textAlign: 'center' }}>Fertig</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}
