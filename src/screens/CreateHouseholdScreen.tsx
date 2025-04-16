import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import { createHousehold } from '../services/household';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../contexts/ThemeContext';

export default function CreateHouseholdScreen({ onSuccess }: { onSuccess: () => void }) {
    const { theme } = useTheme();

    const [form, setForm] = useState({
        name: '',
        description: '',
        country: '',
        city: '',
        address: '',
        postcode: '',
        type: 'wg',
        user_limit: '',
    });

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [pickerVisible, setPickerVisible] = useState(false);

    const handleChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
    };

    const handleCreate = async () => {
        const { name, country, city, type } = form;
        if (!name.trim() || !country.trim() || !city.trim() || !type.trim()) {
            return Alert.alert('Fehler', 'Bitte fülle alle Pflichtfelder aus.');
        }
        if (!code.trim()) return Alert.alert('Fehler', 'Bitte gib deinen Code ein.');

        setLoading(true);
        try {
            await createHousehold({
                ...form,
                user_limit: form.user_limit ? parseInt(form.user_limit) : null,
            });
            onSuccess();
        } catch (e) {
            Alert.alert('Fehler', 'Haushalt konnte nicht erstellt werden.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        backgroundColor: theme.card,
        color: theme.text,
        padding: 14,
        borderRadius: 10,
        marginBottom: 20,
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24 }}>
                <Text style={{ color: theme.text, fontSize: 26, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
                    Haushaltsstart
                </Text>
                <Text style={{ color: theme.text + 'aa', fontSize: 15, marginBottom: 30, textAlign: 'center' }}>
                    Erstelle deinen ersten Haushalt und gib deinen Zugangscode ein.
                </Text>

                <Text style={{ color: theme.text }}>Haushaltsname*</Text>
                <TextInput placeholder="z. B. Chaos-WG" placeholderTextColor="#777" value={form.name} onChangeText={(v) => handleChange('name', v)} style={inputStyle} />

                <Text style={{ color: theme.text }}>Beschreibung</Text>
                <TextInput placeholder="Optional" placeholderTextColor="#777" value={form.description} onChangeText={(v) => handleChange('description', v)} style={inputStyle} />

                <Text style={{ color: theme.text }}>Land*</Text>
                <TextInput placeholder="z. B. Schweiz" placeholderTextColor="#777" value={form.country} onChangeText={(v) => handleChange('country', v)} style={inputStyle} />

                <Text style={{ color: theme.text }}>Stadt*</Text>
                <TextInput placeholder="z. B. Bern" placeholderTextColor="#777" value={form.city} onChangeText={(v) => handleChange('city', v)} style={inputStyle} />

                <Text style={{ color: theme.text }}>Adresse</Text>
                <TextInput placeholder="Optional" placeholderTextColor="#777" value={form.address} onChangeText={(v) => handleChange('address', v)} style={inputStyle} />

                <Text style={{ color: theme.text }}>Postleitzahl</Text>
                <TextInput placeholder="Optional" placeholderTextColor="#777" value={form.postcode} onChangeText={(v) => handleChange('postcode', v)} style={inputStyle} />

                <Text style={{ color: theme.text }}>Haushaltstyp*</Text>
                <TouchableOpacity onPress={() => setPickerVisible(true)} style={inputStyle}>
                    <Text style={{ color: theme.text }}>{form.type}</Text>
                </TouchableOpacity>

                <Modal transparent={true} visible={pickerVisible} animationType="slide">
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View style={{ backgroundColor: theme.card, borderRadius: 10, width: '80%', padding: 20 }}>
                            <Text style={{ color: theme.text, marginBottom: 10 }}>Wähle den Haushaltstyp</Text>
                            <Picker
                                selectedValue={form.type}
                                onValueChange={(itemValue) => handleChange('type', itemValue)}
                                style={{ color: theme.text, marginBottom: 20, height: 150 }}
                                itemStyle={{ color: theme.text }}
                            >
                                {['wg', 'wohnung', 'studio', 'haus', 'mehrfamilienhaus', 'einzimmerwohnung', 'loft', 'dachwohnung', 'ferienwohnung', 'untermiete', 'tinyhouse'].map((t) => (
                                    <Picker.Item label={t} value={t} key={t} />
                                ))}
                            </Picker>
                            <TouchableOpacity onPress={() => setPickerVisible(false)} style={{ backgroundColor: theme.accent, padding: 12, borderRadius: 10 }}>
                                <Text style={{ color: '#fff', textAlign: 'center' }}>Fertig</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Text style={{ color: theme.text }}>Benutzerlimit</Text>
                <TextInput placeholder="Optional, max 50" placeholderTextColor="#777" keyboardType="numeric" value={form.user_limit} onChangeText={(v) => handleChange('user_limit', v)} style={inputStyle} />

                <Text style={{ color: theme.text }}>Code*</Text>
                <TextInput placeholder="z. B. HAVA123456" placeholderTextColor="#777" value={code} onChangeText={setCode} autoCapitalize="characters" style={inputStyle} />

                <TouchableOpacity
                    onPress={handleCreate}
                    disabled={loading}
                    style={{
                        backgroundColor: loading ? '#3C5DDD' : theme.accent,
                        padding: 16,
                        borderRadius: 12,
                        marginTop: 10,
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>
                        {loading ? 'Erstelle...' : 'Haushalt erstellen'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
