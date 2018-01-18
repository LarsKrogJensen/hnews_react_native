import {Store} from "redux";
import {AppStore} from "store/store";
import io from "socket.io-client"
import {AppState, AppStateStatus} from "react-native";
import {API} from "store/API";
import {BetOfferStatusUpdate, PushMessage} from "api/typings";
import {
    BetOfferAddedAction, BetOfferRemovedAction, BetOfferStatusUpdateAction, OddsUpdateAction,
    PushActions
} from "store/push/actions";

const socket: SocketIOClient.Socket = io(`wss://e1-push.aws.kambicdn.com`, {
    transports: ['websocket'],
    upgrade: false,
    autoConnect: false,
    path: "/socket.io"
})

let appState = AppState.currentState
let connected = false
const subscribed: Set<string> = new Set<string>()
const pendingSubscribes: Set<string> = new Set<string>()
const pendingUnsubscribes: Set<string> = new Set<string>()

export function pushInitialize(store: Store<AppStore>) {
    socket.on("connect", (s) => {
        console.log("Socket connected");
        connected = true
        dispatchPending()
    })

    socket.on("disconnect", (reason) => {
        console.log("Socket disconnected: " + reason);
        connected = false
    })

    socket.on('reconnect', (attemptNumber) => {
        console.log("Socket reconnected");
        connected = false
    });

    socket.on('error', (error) => {
        console.log("Socket error: " + error);
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
        console.log("Socket reconnect attempt " + attemptNumber);
    });

    socket.on("message", (data: string) => handleData(data, store))

    socket.connect()

    AppState.addEventListener('change', handleAppStateChange);
}

export function pushSubscribe(topic: string) {
    if (subscribed.has(topic)) {
        return
    }

    if (connected) {
        console.log("Subscribe on topic: " + topic)
        socket.emit("subscribe", {topic: `${API.offering}.${topic}.json`})
        subscribed.add(topic)
    } else {
        pendingSubscribes.add(topic)
        pendingUnsubscribes.delete(topic)
    }
}

export function pushUnsubscribe(topic: string) {
    if (!subscribed.has(topic)) {
        return
    }

    if (connected) {
        console.log("Unsubscribe on topic: " + topic)
        socket.emit("unsubscribe", {topic: `${API.offering}.${topic}.json`})
        subscribed.delete(topic)
    } else {
        pendingUnsubscribes.add(topic)
        pendingSubscribes.delete(topic)
    }
}

function dispatchPending() {
    subscribed.forEach(pushSubscribe)

    pendingSubscribes.forEach(pushSubscribe)
    pendingUnsubscribes.forEach(pushUnsubscribe)
    pendingSubscribes.clear()
    pendingUnsubscribes.clear()
}

function handleAppStateChange(nextAppState: AppStateStatus) {
    console.log("Push next AppState: " + nextAppState + " current state: " + appState)
    if (nextAppState !== appState) {
        if (nextAppState === 'active') {
            console.log('Connecting to push..')
            socket.connect()
        } else {
            console.log('Disconnecting to push..')
            socket.disconnect()
        }
        appState = nextAppState
    }
}

function handleData(data: string, store: Store<AppStore>) {
    const msgs: PushMessage[] = JSON.parse(data)

    for (let msg of msgs) {
        switch (msg.mt) {
            case 11:
                console.log("Odds update: " + msg.boou)
                store.dispatch({type: PushActions.ODDS_UPDATE, data: msg.boou} as OddsUpdateAction)
                break
            case 6:
                console.log("BO added: " + msg.boa)
                store.dispatch({type: PushActions.BETOFFER_ADDED, data: msg.boa} as BetOfferAddedAction)
                break
            case 7:
                console.log("BO removed: " + msg.bor)
                store.dispatch({type: PushActions.BETOFFER_REMOVED, data: msg.bor} as BetOfferRemovedAction)
                break
            case 8:
                console.log("BO status update: " + msg.bosu)
                store.dispatch({type: PushActions.BETOFFER_STATUS_UPDATE, data: msg.bosu} as BetOfferStatusUpdateAction)
                break
            default:
                // console.log("Message: " + msg && msg.mt)
                break
        }
    }
}