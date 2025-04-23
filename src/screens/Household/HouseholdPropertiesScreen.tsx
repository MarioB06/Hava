import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
    Modal,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { getMyHouseholds } from '../../services/household';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import api from '../../services/api';

export default function HouseholdPropertiesScreen() {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [household, setHousehold] = useState<any>(null);
    const [editableHousehold, setEditableHousehold] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const [pickerVisible, setPickerVisible] = useState(false);
    const [adminPickerVisible, setAdminPickerVisible] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const data = await getMyHouseholds();
            if (data.length > 0) {
                setHousehold(data[0]);
                setEditableHousehold({ ...data[0] });
            }

            const admin = await AsyncStorage.getItem('isAdmin');
            setIsAdmin(admin === 'true');

            setLoading(false);
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.text} />
            </SafeAreaView>
        );
    }

    if (!household) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: theme.text }}>Kein Haushalt gefunden.</Text>
            </SafeAreaView>
        );
    }

    const InfoCard = ({
        label,
        keyName,
        editable = true,
        onPressPicker,
    }: {
        label: string;
        keyName: string;
        editable?: boolean;
        onPressPicker?: () => void;
    }) => (
        <View
            style={{
                backgroundColor: theme.card,
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
            }}
        >
            <Text style={{ color: theme.text + '99', fontSize: 13, marginBottom: 4 }}>{label}</Text>
            {isAdmin && editable ? (
                onPressPicker ? (
                    <TouchableOpacity onPress={onPressPicker}>
                        <Text style={{ color: theme.text, fontSize: 16 }}>
                            {editableHousehold[keyName] || 'Auswählen'}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TextInput
                        value={editableHousehold[keyName]}
                        onChangeText={(text) =>
                            setEditableHousehold({ ...editableHousehold, [keyName]: text })
                        }
                        style={{
                            color: theme.text,
                            fontSize: 16,
                            paddingVertical: 4,
                            borderBottomWidth: 1,
                            borderBottomColor: theme.text + '33',
                        }}
                        placeholderTextColor={theme.text + '66'}
                    />
                )
            ) : (
                <Text style={{ color: theme.text, fontSize: 16 }}>
                    {keyName === 'created_at'
                        ? new Date(household[keyName]).toLocaleDateString()
                        : household[keyName]}
                </Text>
            )}
        </View>
    );

    const saveChanges = async () => {
        try {
            const response = await api.put(`/households/${household.id}`, {
                name: editableHousehold.name,
                description: editableHousehold.description,
                country: editableHousehold.country,
                city: editableHousehold.city,
                address: editableHousehold.address,
                postcode: editableHousehold.postcode,
                type: editableHousehold.type,
                admin_id: editableHousehold.admin_id,
            });

            if (response.status === 200) {
                const updated = response.data.household;
                setHousehold(updated);
                setEditableHousehold(updated);
            } else {
                console.log('Fehler beim Speichern:', response.data);
            }
        } catch (e) {
            console.log('Fehler:', e);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={10}
                >
                    <ScrollView
                        contentContainerStyle={{ padding: 20 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={{ color: theme.text, fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
                            Haushalt-Eigenschaften
                        </Text>

                        <InfoCard label="Name" keyName="name" />
                        <InfoCard label="Beschreibung" keyName="description" />
                        <InfoCard label="Typ" keyName="type" onPressPicker={() => setPickerVisible(true)} />
                        <InfoCard label="Land" keyName="country" />
                        <InfoCard label="Stadt" keyName="city" />
                        <InfoCard label="Adresse" keyName="address" />
                        <InfoCard label="PLZ" keyName="postcode" />
                        <InfoCard label="Admin" keyName="admin_id" onPressPicker={() => setAdminPickerVisible(true)} editable={isAdmin} />
                        <InfoCard label="User-Limit" keyName="user_limit" editable={false} />
                        <InfoCard label="Erstellt am" keyName="created_at" editable={false} />

                        {isAdmin && (
                            <TouchableOpacity
                                onPress={saveChanges}
                                style={{
                                    backgroundColor: theme.accent,
                                    padding: 14,
                                    borderRadius: 10,
                                    marginTop: 10,
                                }}
                            >
                                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
                                    Änderungen speichern
                                </Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>

                    {/* Typ Picker */}
                    <Modal transparent visible={pickerVisible} animationType="slide">
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <View style={{ backgroundColor: theme.card, borderRadius: 10, width: '80%', padding: 20 }}>
                                <Text style={{ color: theme.text, marginBottom: 10 }}>Wähle den Haushaltstyp</Text>
                                <Picker
                                    selectedValue={editableHousehold.type}
                                    onValueChange={(value) => setEditableHousehold({ ...editableHousehold, type: value })}
                                    style={{ color: theme.text, height: 150 }}
                                    itemStyle={{ color: theme.text }}
                                >
                                    {[
                                        'wg', 'wohnung', 'studio', 'haus', 'mehrfamilienhaus',
                                        'einzimmerwohnung', 'loft', 'dachwohnung', 'ferienwohnung',
                                        'untermiete', 'tinyhouse'
                                    ].map((t) => (
                                        <Picker.Item label={t} value={t} key={t} />
                                    ))}
                                </Picker>
                                <TouchableOpacity onPress={() => setPickerVisible(false)} style={{ backgroundColor: theme.accent, padding: 12, borderRadius: 10 }}>
                                    <Text style={{ color: '#fff', textAlign: 'center' }}>Fertig</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {/* Admin Picker */}
                    <Modal transparent visible={adminPickerVisible} animationType="slide">
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <View style={{ backgroundColor: theme.card, borderRadius: 10, width: '80%', padding: 20 }}>
                                <Text style={{ color: theme.text, marginBottom: 10 }}>Wähle den Admin</Text>
                                <Picker
                                    selectedValue={editableHousehold.admin_id}
                                    onValueChange={(value) => setEditableHousehold({ ...editableHousehold, admin_id: value })}
                                    style={{ color: theme.text, height: 150 }}
                                    itemStyle={{ color: theme.text }}
                                >
                                    {household.users?.map((user: any) => (
                                        <Picker.Item label={user.name} value={user.id} key={user.id} />
                                    ))}
                                </Picker>
                                <TouchableOpacity onPress={() => setAdminPickerVisible(false)} style={{ backgroundColor: theme.accent, padding: 12, borderRadius: 10 }}>
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
