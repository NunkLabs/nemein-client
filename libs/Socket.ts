import EventEmitter from "stream";

type SocketData = {
  op: number;
  timestamp?: number;
  data?: object | string;
};

type ResolvedServer = {
  socket: WebSocket;
  latencies: number[];
  averageLatency: number;
};

export const Opcodes = {
  OPEN: 0, // Socket is opened
  READY: 1, // Socket is ready
  DATA: 2, // Socket received data
  INPUT: 3, // Socket is sending a game input
  TOGGLE: 4, // Socket is sending a game state toggle command
  RESTART: 5, // Socket is sending a restart command
  PING: 9, // Socket is sending a ping command
  HEARTBEAT: 10, // Socket is sending a heartbeat
};

const DEFAULT_WS_CLOSURE = 1000;
const DEFAULT_HEARTBEAT_INTERVAL_MS = 5000;
const DEFAULT_PING_INTERVAL_MS = 100;
const DEFAULT_PING_ATTEMPT_LIMIT = 5;
const DEFAULT_MAX_ACCEPTABLE_LATENCY_MS = 300;
const AVAILABLE_SERVERS =
  process.env.NEXT_PUBLIC_SERVERS || "ws://localhost:8080";

export class GameSocket extends EventEmitter {
  private socket: WebSocket | null;

  private heartbeat: NodeJS.Timer | null;

  constructor() {
    super();

    this.socket = null;
    this.heartbeat = null;

    this.init();
  }

  /**
   * @brief: init: This function initializes a new Tetris client socket by
   * setting up socket events and forwarding them to the Tetris React component.
   */
  async init() {
    if (this.socket) return;

    const availableServers = AVAILABLE_SERVERS.split(" ");

    const resolvedServers = await Promise.all(
      availableServers.map((server): Promise<ResolvedServer> => {
        return new Promise((resolve) => {
          const currentServer: ResolvedServer = {
            socket: new WebSocket(server),
            latencies: [],
            averageLatency: 0,
          };

          currentServer.socket.onmessage = ({ data }: MessageEvent) => {
            const message = JSON.parse(data);

            switch (message.op) {
              case Opcodes.OPEN: {
                const pingInterval = setInterval(() => {
                  if (
                    currentServer.latencies.length >= DEFAULT_PING_ATTEMPT_LIMIT
                  ) {
                    clearInterval(pingInterval);

                    resolve(currentServer);

                    return;
                  }

                  currentServer.socket.send(
                    JSON.stringify({
                      op: Opcodes.PING,
                      timestamp: Date.now(),
                    })
                  );
                }, DEFAULT_PING_INTERVAL_MS);

                break;
              }

              case Opcodes.HEARTBEAT: {
                console.log(
                  `Latency to ${this.socket?.url} is ${
                    Date.now() - message.timestamp
                  }`
                );

                break;
              }

              case Opcodes.PING: {
                currentServer.latencies.push(Date.now() - message.timestamp);

                currentServer.averageLatency =
                  currentServer.latencies.reduce(
                    (sum: number, value: number) => sum + value,
                    0
                  ) / currentServer.latencies.length;

                break;
              }

              default:
                this.emit("message", message);
            }
          };
        });
      })
    );

    this.emit("progress", { percent: 60 });

    let bestLatency = DEFAULT_MAX_ACCEPTABLE_LATENCY_MS;

    resolvedServers.forEach(({ socket, averageLatency }) => {
      if (!socket) return;

      if (averageLatency >= bestLatency) {
        socket.close(DEFAULT_WS_CLOSURE);

        return;
      }

      bestLatency = averageLatency;

      this.socket = socket;
    });

    this.setHeartbeat(DEFAULT_HEARTBEAT_INTERVAL_MS);

    this.emit("progress", { percent: 100 });
  }

  /**
   * @brief: destroy: This function cleans up the current Tetris client socket
   * by clearing the heartbeat interval timer and closing the connection.
   */
  destroy() {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    if (this.heartbeat) {
      clearInterval(this.heartbeat);
    }

    this.socket.close(DEFAULT_WS_CLOSURE);
  }

  /**
   * @brief: send: This function handles outgoing communications with the server
   * @param:   {SocketData}   data   Data to send to the server
   */
  send(data: SocketData) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    this.socket.send(JSON.stringify(data));
  }

  /**
   * @brief: setHeartbeat: This function sets up an interval to send heartbeats
   * to the server
   * @param:   {number}   duration   Interval between heartbeats in milliseconds
   */
  setHeartbeat(duration?: number) {
    if (duration && !Number.isNaN(duration)) {
      if (this.heartbeat) {
        clearInterval(this.heartbeat);

        this.heartbeat = null;
      }

      if (duration >= 0) {
        this.heartbeat = setInterval(this.setHeartbeat.bind(this), duration);
      }

      return;
    }

    this.send({
      op: Opcodes.HEARTBEAT,
      timestamp: Date.now(),
    });
  }
}
