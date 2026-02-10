import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { verifyToken, extractTokenFromHeader } from "./auth";
import { Context } from "./types";

async function startServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Apollo GraphQL Server
  const server = new ApolloServer({
    typeDefs,
    resolvers: {
      Query: resolvers.Query,
      Mutation: resolvers.Mutation,
      Transaction: {
        ...(resolvers.Transaction || {}),
        date: (parent: any) => {
          if (parent.date instanceof Date) {
            return parent.date.toISOString();
          }
          return parent.date;
        },
        createdAt: (parent: any) => {
          if (parent.createdAt instanceof Date) {
            return parent.createdAt.toISOString();
          }
          return parent.createdAt;
        },
      },
      Category: {
        ...(resolvers.Category || {}),
        createdAt: (parent: any) => {
          if (parent.createdAt instanceof Date) {
            return parent.createdAt.toISOString();
          }
          return parent.createdAt;
        },
      },
      User: {
        ...(resolvers.User || {}),
        createdAt: (parent: any) => {
          if (parent.createdAt instanceof Date) {
            return parent.createdAt.toISOString();
          }
          return parent.createdAt;
        },
      },
    },
    context: ({ req }): Context => {
      const authHeader = req.headers.authorization;
      const token = extractTokenFromHeader(authHeader);

      if (!token) {
        return {};
      }

      const payload = verifyToken(token);

      if (!payload) {
        return {};
      }

      return {
        userId: payload.userId,
        email: payload.email,
      };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
    console.log(`📊 GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
  process.exit(1);
});
