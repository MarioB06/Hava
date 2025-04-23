import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Modal,
    SafeAreaView,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
    Alert,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMyHouseholds, updateHouseholdSettings } from '../../services/household';
import { Picker } from '@react-native-picker/picker';

export default function HouseholdSettingsScreen() {
    const { theme } = useTheme();
    const [household, setHousehold] = useState<any>(null);
    const [settings, setSettings] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [timePickerVisible, setTimePickerVisible] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const data = await getMyHouseholds();
            if (data.length > 0) {
                setHousehold(data[0]);
                setSettings({ ...data[0].settings });
            }

            const admin = await AsyncStorage.getItem('isAdmin');
            setIsAdmin(admin === 'true');
        };

        loadData();
    }, []);

    const handleChange = (key: string, value: any) => {
        setSettings((prev: any) => ({ ...prev, [key]: typeof value === 'boolean' ? (value ? 1 : 0) : value }));
    };

    const handleSave = async () => {
        try {
            await updateHouseholdSettings(household.id, settings);
            Alert.alert('Gespeichert', 'Die Einstellungen wurden aktualisiert.');
        } catch (err) {
            Alert.alert('Fehler', 'Speichern fehlgeschlagen.');
            console.log(err);
        }
    };

    if (!settings) return null;

    const SwitchRow = ({ label, value, onChange }) => (
        <TouchableOpacity
            onPress={() => onChange(!value)}
            style={{
                backgroundColor: theme.card,
                padding: 16,
                borderRadius: 12,
                marginBottom: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <Text style={{ color: theme.text }}>{label}</Text>
            <View
                style={{
                    width: 45,
                    height: 25,
                    borderRadius: 15,
                    backgroundColor: value ? theme.accent : '#888',
                    justifyContent: 'center',
                    paddingHorizontal: 3,
                }}
            >
                <View
                    style={{
                        width: 20,
                        height: 20,
                        backgroundColor: '#fff',
                        borderRadius: 10,
                        transform: [{ translateX: value ? 20 : 0 }],
                    }}
                />
            </View>
        </TouchableOpacity>
    );

    const InputRow = ({ label, value, onChange, editable = true }) => (
        <View style={{ backgroundColor: theme.card, borderRadius: 12, padding: 16, marginBottom: 10 }}>
            <Text style={{ color: theme.text + '99', fontSize: 13, marginBottom: 4 }}>{label}</Text>
            {editable ? (
                <TextInput
                    value={value?.toString()}
                    onChangeText={onChange}
                    placeholder="..."
                    placeholderTextColor={theme.text + '66'}
                    style={{
                        color: theme.text,
                        fontSize: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: theme.text + '33',
                        paddingVertical: 4,
                    }}
                />
            ) : (
                <Text style={{ color: theme.text, fontSize: 16 }}>{value}</Text>
            )}
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={10}
                >
                    <ScrollView contentContainerStyle={{ padding: 20 }}>
                        <Text style={{ color: theme.text, fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
                            Haushalt-Einstellungen
                        </Text>

                        {/* Punkte-System */}
                        <SwitchRow label="Punkte aktiviert" value={!!settings.points_enabled} onChange={(val) => handleChange('points_enabled', val)} />
                        <InputRow label="Punkte pro Aufgabe" value={settings.points_per_task} onChange={(val) => handleChange('points_per_task', parseInt(val) || 0)} />

                        {/* Sichtbarkeiten */}
                        <SwitchRow label="Kalender sichtbar für alle" value={!!settings.calendar_visible_to_all} onChange={(val) => handleChange('calendar_visible_to_all', val)} />
                        <SwitchRow label="Finanzen sichtbar für alle" value={!!settings.finances_visible_to_all} onChange={(val) => handleChange('finances_visible_to_all', val)} />

                        {/* Aufgaben */}
                        <SwitchRow label="Aufgaben-Rotation" value={!!settings.task_rotation} onChange={(val) => handleChange('task_rotation', val)} />
                        <SwitchRow label="Überspringen erlaubt" value={!!settings.task_skip_allowed} onChange={(val) => handleChange('task_skip_allowed', val)} />

                        {/* Erinnerungen */}
                        <InputRow
                            label="Minuten vor Event"
                            value={settings.reminder_minutes_before_event}
                            onChange={(val) => handleChange('reminder_minutes_before_event', parseInt(val) || 0)}
                        />
                        <TouchableOpacity onPress={() => setTimePickerVisible(true)}>
                            <InputRow label="Standard-Erinnerungszeit" value={settings.default_reminder_time} onChange={() => { }} editable={false} />
                        </TouchableOpacity>

                        {/* Module */}
                        <SwitchRow label="Chat aktiviert" value={!!settings.chat_enabled} onChange={(val) => handleChange('chat_enabled', val)} />
                        <SwitchRow label="Dokumente aktiviert" value={!!settings.documents_enabled} onChange={(val) => handleChange('documents_enabled', val)} />
                        <SwitchRow label="Umfragen aktiviert" value={!!settings.polls_enabled} onChange={(val) => handleChange('polls_enabled', val)} />
                        <SwitchRow label="Feedback aktiviert" value={!!settings.feedback_enabled} onChange={(val) => handleChange('feedback_enabled', val)} />
                        <SwitchRow label="Einladungen erlaubt" value={!!settings.invites_enabled} onChange={(val) => handleChange('invites_enabled', val)} />

                        {/* Style */}
                        <InputRow label="Farbe (#HEX)" value={settings.color} onChange={(val) => handleChange('color', val)} />
                        <InputRow label="Icon-Name (FontAwesome)" value={settings.icon} onChange={(val) => handleChange('icon', val)} />

                        {isAdmin && (
                            <TouchableOpacity
                                onPress={handleSave}
                                style={{
                                    backgroundColor: theme.accent,
                                    padding: 14,
                                    borderRadius: 10,
                                    marginTop: 20,
                                }}
                            >
                                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
                                    Änderungen speichern
                                </Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>

                    {/* Reminder Time Picker Modal */}
                    <Modal transparent visible={timePickerVisible} animationType="slide">
                        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <View style={{ backgroundColor: theme.card, borderRadius: 10, margin: 40, padding: 20 }}>
                                <Text style={{ color: theme.text, marginBottom: 10 }}>Zeit auswählen</Text>
                                <Picker
                                    selectedValue={settings.default_reminder_time}
                                    onValueChange={(value) => handleChange('default_reminder_time', value)}
                                    style={{ color: theme.text, height: 150 }}
                                    itemStyle={{ color: '#000' }} // ← hier
                                >
                                    {Array.from({ length: 24 }, (_, h) =>
                                        ['00', '15', '30', '45'].map((m) => {
                                            const time = `${h.toString().padStart(2, '0')}:${m}`;
                                            return <Picker.Item key={time} label={time} value={time} />;
                                        })
                                    ).flat()}
                                </Picker>
                                <TouchableOpacity
                                    onPress={() => setTimePickerVisible(false)}
                                    style={{ backgroundColor: theme.accent, padding: 12, borderRadius: 10, marginTop: 10 }}
                                >
                                    <Text style={{ color: '#fff', textAlign: 'center' }}>Fertig</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}
