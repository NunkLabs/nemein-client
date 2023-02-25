import EventEmitter from "stream";

type SocketData = {
  op: number;
  timestamp?: number;
  data?: object | string;
  heartbeat?: number;
};

type ResolvedServer = {
  url: string;
  pingSocket: WebSocket | null;
  pingInterval: NodeJS.Timer;
  recentPings: number[];
  averagePing: number;
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

const DEFAULT_WS_SERVER = "ws://localhost:8080";
const DEFAULT_WS_CLOSURE = 1000;
const DEFAULT_PING_INTERVAL_MS = 500;
const DEFAULT_PING_LIMIT = 5;
const DEFAULT_MAX_ACCEPTABLE_PING_MS = 300;

export class GameSocket extends EventEmitter {
  public server: string | null;

  private socket: WebSocket | null;

  private heartbeat: NodeJS.Timer | null;

  constructor() {
    super();

    this.server = null;
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

    this.server = await this.getBestServer();

    this.socket = new WebSocket(this.server);

    this.socket.onmessage = ({ data }) => {
      const message = JSON.parse(data);

      switch (message.op) {
        case Opcodes.OPEN: {
          this.setHeartbeat(message.heartbeat);

          break;
        }

        case Opcodes.HEARTBEAT: {
          const heartbeatPing = Date.now() - message.timestamp;

          console.log(
            `Heartbeat ping to ${this.server} is ${heartbeatPing}ms.`
          );

          this.emit("ping", heartbeatPing);

          break;
        }

        default:
          this.emit("message", message);
      }
    };
  }

  /**
   * @brief: destroy: This function cleans up the current Tetris client socket
   * by clearing the heartbeat interval timer and closing the connection.
   */
  destroy() {
    if (this.heartbeat) {
      clearInterval(this.heartbeat);
    }

    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

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

  async getBestServer() {
    let bestServer = DEFAULT_WS_SERVER;

    const allServers = process.env.NEXT_PUBLIC_SERVERS!.split(" ");
    const availableServers = new Map();

    const resolvedServers = await Promise.all(
      allServers.map((server): Promise<ResolvedServer | null> => {
        return new Promise((resolve) => {
          try {
            const socket = new WebSocket(server);

            availableServers.set(server, {
              url: server,
              pingSocket: socket,
              pingInterval: null,
              recentPings: [],
              averagePing: 0,
            });

            socket.onmessage = ({ data }) => {
              const currentHost = availableServers.get(server);

              const message = JSON.parse(data);

              switch (message.op) {
                case Opcodes.OPEN: {
                  let pingAttempted = 0;

                  currentHost.pingInterval = setInterval(() => {
                    if (pingAttempted >= DEFAULT_PING_LIMIT) {
                      clearInterval(currentHost.pingInterval);

                      currentHost.pingInterval = null;

                      resolve(currentHost);

                      return;
                    }

                    this.send({
                      op: Opcodes.PING,
                      timestamp: Date.now(),
                    });

                    pingAttempted += 1;
                  }, DEFAULT_PING_INTERVAL_MS);

                  break;
                }

                default: {
                  currentHost.recentPings.push(Date.now() - message.timestamp);

                  currentHost.averagePing =
                    currentHost.recentPings.reduce(
                      (sum: number, value: number) => sum + value,
                      0
                    ) / currentHost.recentPings.length;
                }
              }
            };
          } catch (error) {
            resolve(null);
          }
        });
      })
    );

    let bestPing = DEFAULT_MAX_ACCEPTABLE_PING_MS;

    resolvedServers.forEach((server) => {
      if (!server || server.averagePing >= bestPing) return;

      bestPing = server.averagePing;

      bestServer = server.url;

      if (server.pingSocket) {
        server.pingSocket.close(DEFAULT_WS_CLOSURE);

        server.pingSocket = null;
      }
    });

    return bestServer;
  }
}
