import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const SectionButton = ({
    icon,
    label,
    color,
    onPress,
}: {
    icon: any;
    label: string;
    color: string;
    onPress?: () => void;
}) => {
    const { theme } = useTheme();
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: theme.card,
                borderRadius: 10,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
            }}
        >
            <View
                style={{
                    backgroundColor: color,
                    borderRadius: 999, // damit es immer rund ist, egal wie groß
                    width: 40,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 16,
                }}
            >
                <FontAwesome5
                    name={icon}
                    size={18}
                    color="#fff"
                />
            </View>


            <Text style={{ color: theme.text, fontSize: 16 }}>{label}</Text>
        </TouchableOpacity>
    );
};

export default function UserModuleScreen() {
    const { theme } = useTheme();
    const navigation = useNavigation();

    const userColor = theme.moduleColors.users;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background, padding: 20 }}>
            <ScrollView>
                <SectionButton
                    icon="users"
                    label="Mitgliederübersicht"
                    color={userColor}
                    onPress={() => navigation.navigate('MemberList')}
                />
                <SectionButton
                    icon="user-plus"
                    label="Mitglieder einladen"
                    color={userColor}
                    onPress={() => navigation.navigate('InviteMember')}
                />
                <SectionButton
                    icon="user-cog"
                    label="Rollen verwalten"
                    color={userColor}
                    onPress={() => navigation.navigate('ManageRoles')}
                />
                <SectionButton
                    icon="shield-alt"
                    label="Meine Rechte"
                    color={userColor}
                    onPress={() => navigation.navigate('ViewPermissions')}
                />
            </ScrollView>
        </SafeAreaView>
    );
}
