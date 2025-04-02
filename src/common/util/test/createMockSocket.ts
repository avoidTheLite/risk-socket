import { WebSocket } from "ws";

export default function createMockSocket(): WebSocket {
    return {
        readyState: WebSocket.OPEN,
        send: jest.fn(),
        close: jest.fn(),
        onmessage: jest.fn(),
        onerror: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
    } as unknown as WebSocket
}