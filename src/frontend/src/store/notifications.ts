import { createSlice } from "@reduxjs/toolkit";

const initialNotifications = {
    Notifications: null,
};

const NotificationsSlice = createSlice({
    name: "notifications",
    initialState: initialNotifications as { Notifications: any },
    reducers: {
        setNotifications: (state, action) => {
            state.Notifications = action.payload;
        },
    },
});

export { NotificationsSlice };
