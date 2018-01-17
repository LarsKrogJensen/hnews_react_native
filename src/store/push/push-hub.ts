import {Store} from "redux";
import {AppStore} from "store/store";
import io from "socket.io-client"
import {AppState, AppStateStatus} from "react-native";

const socket: SocketIOClient.Socket = io(`wss://e1-push.aws.kambicdn.com`, {
    transports: ['websocket'],
    upgrade: false,
    autoConnect: false,
    path: "/socket.io"
})

let appState = AppState.currentState

export function pushInitialize(store: Store<AppStore>) {
    socket.on("connect", (s) => {
        console.log("Socket connected");
        socket.emit("subscribe", {topic: "kambiplay.ev.json"})
    })

    socket.on("disconnect", (reason) => {
        console.log("Socket disconnected: " + reason);
    })

    socket.on('reconnect', (attemptNumber) => {
        console.log("Socket reconnected");
    });

    socket.on('error', (error) => {
        console.log("Socket error: " + error);
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
        console.log("Socket reconnect attempt " + attemptNumber);
    });

    socket.on("message", handleData)

    socket.connect()

    AppState.addEventListener('change', handleAppStateChange);
}

function handleAppStateChange(nextAppState: AppStateStatus) {
    console.log("Push next AppState: " + nextAppState + " current state: " + appState)
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!')
        socket.connect()
    } else if (appState === 'active' && nextAppState !== 'active') {
        console.log('App has come to the background!')
        socket.disconnect()
    }
}

function handleData(data: string) {
    const msgs: any[] = JSON.parse(data)

    for (let msg of msgs) {
        console.log("Message: " + msg && msg.mt)
    }
}