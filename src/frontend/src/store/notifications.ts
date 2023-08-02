import { NotificationType } from "@/socket/types";
import { createSlice } from "@reduxjs/toolkit";

const initialNotifications: {
    friend_requests: NotificationType[] | [];
} = {
    friend_requests: [],
};

const NotificationsSlice = createSlice({
    name: "notifications",
    initialState: initialNotifications,
    reducers: {
        setNotifications: (state, action) => {
            state.friend_requests = action.payload;
        },
        addFriendRequest: (state: { friend_requests: NotificationType[] }, action: { payload: NotificationType }) => {
            state.friend_requests.push(action.payload);
        },
        removeFriendRequest: (state: { friend_requests: NotificationType[] }, action: { payload: number }) => {
            state.friend_requests = state.friend_requests.filter((req) => req.id !== action.payload);
        }
    },
});

export { NotificationsSlice };
