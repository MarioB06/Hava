export type RootStackParamList = {
    Landing: undefined;
    CreateHousehold: undefined;
    Home: undefined;
};

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
