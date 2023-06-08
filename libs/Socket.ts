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
  PING: 9, // Socket is sending a ping command
  HEARTBEAT: 10, // Socket is sending a heartbeat
};

const WS_CLOSURE_CODE = 1000;
const HEARTBEAT_INTERVAL_MS = 5000;
const PING_INTERVAL_MS = 100;
const PING_ATTEMPT_LIMIT = 5;
const MAX_ACCEPTABLE_LATENCY_MS = 300;
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

          currentServer.socket.onmessage = (message: MessageEvent) => {
            const data: SocketData = JSON.parse(message.data);

            switch (data.op) {
              case Opcodes.OPEN: {
                const pingInterval = setInterval(() => {
                  if (currentServer.latencies.length >= PING_ATTEMPT_LIMIT) {
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
                }, PING_INTERVAL_MS);

                break;
              }

              case Opcodes.PING: {
                if (!data.timestamp) return;

                currentServer.latencies.push(Date.now() - data.timestamp);

                currentServer.averageLatency =
                  currentServer.latencies.reduce(
                    (sum: number, value: number) => sum + value,
                    0
                  ) / currentServer.latencies.length;

                break;
              }

              default:
                this.emit("data", data);
            }
          };
        });
      })
    );

    this.emit("progress", { percent: 60 });

    let bestLatency = MAX_ACCEPTABLE_LATENCY_MS;

    resolvedServers.forEach(({ socket, averageLatency }) => {
      if (!socket) return;

      if (averageLatency >= bestLatency) {
        socket.close(WS_CLOSURE_CODE);

        return;
      }

      bestLatency = averageLatency;

      this.socket = socket;
    });

    this.setHeartbeat(HEARTBEAT_INTERVAL_MS);

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

    this.socket.close(WS_CLOSURE_CODE);
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
