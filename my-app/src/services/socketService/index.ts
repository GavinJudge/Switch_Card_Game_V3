import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from '@socket.io/component-emitter';

class SocketService {
  public socket: Socket | null = null;

  public connect(
    url: string,
    token?: string | null
  ): Promise<Socket<DefaultEventsMap, DefaultEventsMap>> {
    return new Promise((rs, rj) => {
      
      // Include the token in the connection request, if one was provided
      this.socket = io(url, { auth: { token } });

      if (!this.socket) return rj();

      this.socket.on("connect", () => {
        rs(this.socket as Socket);
      });

      this.socket.on("connect_error", (err) => {
        console.log("Connection error: ", err);
        rj(err);
      });
    });
  }
}

const socketService = new SocketService();
export default socketService;