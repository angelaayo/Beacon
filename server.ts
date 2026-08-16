import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

declare global {
  var io: Server;
}

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  global.io = io;
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("joinIncident", (incidentId: string) => {
      socket.join(`incidents:${incidentId}`); // rooms, scoped per incident
      console.log(`Socket ${socket.id} joined incident:${incidentId}`);
    });

    socket.on("leaveIncident", (incidentId: string) => {
      socket.leave(`incidents:${incidentId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });

    socket.on(
      "docUpdate",
      ({ incidentId, update }: { incidentId: string; update: number[] }) => {
        socket.to(`incidents:${incidentId}`).emit("docUpdate", update);
      },
    );

    socket.on(
      "awarenessUpdate",
      ({ incidentId, states }: { incidentId: string; states: unknown[] }) => {
        socket.to(`incidents:${incidentId}`).emit("awarenessUpdate", states);
      },
    );
  });

  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
