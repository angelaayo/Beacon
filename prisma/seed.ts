// prisma/seed.ts
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";

function generateJoinCode() {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

async function main() {
  // clear existing data — order matters, children before parents, due to FK constraints
  await prisma.incidentEvent.deleteMany();
  await prisma.message.deleteMany();
  await prisma.incidentAssignment.deleteMany();
  await prisma.incidentNotes.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  const org = await prisma.organization.create({
    data: { name: "Acme Corp", joinCode: generateJoinCode() },
  });

  console.log(`Organization created — join code: ${org.joinCode}`);

  const [alice, bob, chris, dana] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Alice Chen",
        email: "alice@example.com",
        password,
        role: "ADMIN",
        organizationId: org.id,
      },
    }),
    prisma.user.create({
      data: {
        name: "Bob Martinez",
        email: "bob@example.com",
        password,
        role: "RESPONDER",
        organizationId: org.id,
      },
    }),
    prisma.user.create({
      data: {
        name: "Chris Okafor",
        email: "chris@example.com",
        password,
        role: "RESPONDER",
        organizationId: org.id,
      },
    }),
    prisma.user.create({
      data: {
        name: "Dana Kim",
        email: "dana@example.com",
        password,
        role: "VIEWER",
        organizationId: org.id,
      },
    }),
  ]);

  const [authApi, paymentService, dbCluster, notificationWorker] =
    await Promise.all([
      prisma.service.create({
        data: {
          name: "Auth API",
          description: "Handles login and session management",
          status: "OPERATIONAL",
          organizationId: org.id,
        },
      }),
      prisma.service.create({
        data: {
          name: "Payment Service",
          description: "Processes transactions",
          status: "DEGRADED",
          organizationId: org.id,
        },
      }),
      prisma.service.create({
        data: {
          name: "Database Cluster",
          description: "Primary Postgres cluster",
          status: "DOWN",
          organizationId: org.id,
        },
      }),
      prisma.service.create({
        data: {
          name: "Notification Worker",
          description: "Sends emails and push notifications",
          status: "OPERATIONAL",
          organizationId: org.id,
        },
      }),
    ]);

  const incident1 = await prisma.incident.create({
    data: {
      title: "Database connection pool exhausted",
      description: "Primary DB cluster rejecting new connections under load.",
      severity: "CRITICAL",
      status: "INVESTIGATING",
      serviceId: dbCluster.id,
      createdById: alice.id,
      organizationId: org.id,
    },
  });

  const incident2 = await prisma.incident.create({
    data: {
      title: "Payment webhook delays",
      description:
        "Stripe webhooks arriving 5+ minutes late, causing order status mismatches.",
      severity: "HIGH",
      status: "OPEN",
      serviceId: paymentService.id,
      createdById: bob.id,
      organizationId: org.id,
    },
  });

  const incident3 = await prisma.incident.create({
    data: {
      title: "Password reset emails not sending",
      description: "Intermittent failures in the notification queue.",
      severity: "LOW",
      status: "RESOLVED",
      serviceId: notificationWorker.id,
      createdById: chris.id,
      organizationId: org.id,
      resolvedAt: new Date(),
    },
  });

  const incident4 = await prisma.incident.create({
    data: {
      title: "Elevated API latency on checkout",
      description: "p95 latency up 3x on /api/checkout over the last hour.",
      severity: "MEDIUM",
      status: "OPEN",
      serviceId: authApi.id,
      createdById: dana.id,
      organizationId: org.id,
    },
  });

  await Promise.all([
    prisma.incidentAssignment.create({
      data: {
        incidentId: incident1.id,
        userId: alice.id,
        responsibility: "Investigating connection leaks in the API layer",
      },
    }),
    prisma.incidentAssignment.create({
      data: {
        incidentId: incident1.id,
        userId: bob.id,
        responsibility: "Monitoring replica lag and failover status",
      },
    }),
    prisma.incidentAssignment.create({
      data: {
        incidentId: incident2.id,
        userId: chris.id,
        responsibility: "Checking Stripe dashboard for webhook queue backlog",
      },
    }),
  ]);

  await Promise.all([
    prisma.message.create({
      data: {
        incidentId: incident1.id,
        userId: alice.id,
        content: "Seeing connection count spike around 14:02.",
      },
    }),
    prisma.message.create({
      data: {
        incidentId: incident1.id,
        userId: bob.id,
        content: "Replica 2 lag is climbing, might be related.",
      },
    }),
    prisma.message.create({
      data: {
        incidentId: incident2.id,
        userId: chris.id,
        content:
          "Confirmed — Stripe's status page shows a delay on their end too.",
      },
    }),
  ]);

  await Promise.all([
    prisma.incidentEvent.create({
      data: {
        type: "CREATED",
        description: "Incident created",
        incidentId: incident1.id,
        userId: alice.id,
      },
    }),
    prisma.incidentEvent.create({
      data: {
        type: "USER_JOINED",
        description: "Bob Martinez joined the incident",
        incidentId: incident1.id,
        userId: bob.id,
      },
    }),
    prisma.incidentEvent.create({
      data: {
        type: "STATUS_CHANGED",
        description: "Status changed from OPEN to INVESTIGATING",
        metadata: { from: "OPEN", to: "INVESTIGATING" },
        incidentId: incident1.id,
        userId: alice.id,
      },
    }),
    prisma.incidentEvent.create({
      data: {
        type: "CREATED",
        description: "Incident created",
        incidentId: incident2.id,
        userId: bob.id,
      },
    }),
    prisma.incidentEvent.create({
      data: {
        type: "CREATED",
        description: "Incident created",
        incidentId: incident3.id,
        userId: chris.id,
      },
    }),
    prisma.incidentEvent.create({
      data: {
        type: "RESOLVED",
        description: "Incident resolved",
        incidentId: incident3.id,
        userId: chris.id,
      },
    }),
    prisma.incidentEvent.create({
      data: {
        type: "CREATED",
        description: "Incident created",
        incidentId: incident4.id,
        userId: dana.id,
      },
    }),
    prisma.incidentEvent.create({
      data: {
        type: "ALERT_TRIGGERED",
        description: "Automated latency alert triggered",
        incidentId: incident4.id,
        userId: null,
      },
    }),
  ]);

  console.log("Seed complete.");
  console.log(`Log in with: alice@example.com / password123 (Admin)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
