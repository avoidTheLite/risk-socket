import http from 'http'
import { WebSocket } from 'ws';
import createWebSocketServer from './createWebSocketServer';

export function startServer(port) {
    const server = http.createServer();
    createWebSocketServer(server);

    return new Promise((resolve) => {
        server.listen(port, () => resolve(server))
    })
}


export class TestWebSocket extends WebSocket {

    #messages: String[] = [];
    constructor(...args: ConstructorParameters<typeof WebSocket>){
        super(...args);
        
        const addNewMessage = (event) => this.#messages.push(event.data.toString("utf8"));
        this.addEventListener("message", addNewMessage);
        this.addEventListener("close", () => this.removeEventListener("message", addNewMessage), {once: true});

    }

    get messages() {
        return this.#messages.slice()
    }

    clearMessages() {
        this.#messages.splice(0, this.#messages.length);
    }

    waitUntil(state: "open" | "close", timeout: number = 1000) {
        if (this.readyState === this.OPEN && state === "open") return;
        if (this.readyState === this.CLOSED && state === "close") return;

        return new Promise<void>((resolve, reject) => {
            let timerId: NodeJS.Timeout | undefined;
            const handleStateEvent = () => {
                resolve(); 
                clearTimeout(timerId);
            };

            this.addEventListener (state, handleStateEvent, {once: true});

            timerId = setTimeout(() => {
                this.removeEventListener(state, handleStateEvent);
                if (this.readyState === this.OPEN && state === "open") return resolve();
                if (this.readyState === this.CLOSED && state === "close") return resolve();

                reject(new Error(`Websocket did not ${state} in time`));
            }, timeout);
        });

    }
}