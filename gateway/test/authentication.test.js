import { PrismaClient } from "@prisma/client";

import {expect } from "chai";
import supertest from "supertest";
import server from "../index.js";

const prisma = new PrismaClient();

// db connection
describe("DB Connection", () => {
  it("it should return a connection", (done) => {
    prisma.$connect();
    done();
  });
});

describe("Register", () => {
  describe("POST /api/v1/auth/register", () => {
    it("it should return a token", async (done) => {
      const user = {
        email: "anna.sak@gmail.com",
        username: "ank2111",
        gender: "Female",
        password: "2ewq1@20",
        firstName: "Anna",
        lastName: "Sak",
        role: "Clerk",
        phone: "+971501234567",
      };

      supertest(server)
        .post("/api/v1/auth/register")
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property("token");
          done();
        });
    });
  });
});

describe("Authentication", () => {
  describe("POST /api/v1/auth/login", () => {
    it("it should return a token", (done) => {
      const user = {
        username: "ank2111",
        password: "2ewq1@20",
      };

      supertest(server)
        .post("/api/v1/auth/login")
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property("token");
          done();
        });
    });
  });
});
