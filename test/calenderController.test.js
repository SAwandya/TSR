let chai;
let expect;
let sinon;
let sinonChai;
const axios = require("axios");
const { User } = require("../models/user");
const calendarController = require("../controllers/calendarController");

before(async () => {
  chai = await import("chai");
  expect = chai.expect;

  sinon = await import("sinon");

  // Dynamically import and use sinon-chai
  sinonChai = await import("sinon-chai");
  chai.use(sinonChai.default); // Use the default export of sinon-chai

});

describe("Calendar Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        userId: "userId",
        bookingDate: "2024-10-10",
        bookingTime: "18:00",
      },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
  });

  afterEach(() => {
    sinon.restore(); // Restore all stubs and mocks after each test
  });

  it("should create a calendar event successfully", async () => {
    const userStub = sinon
      .stub(User, "findById")
      .resolves({ accessToken: "validAccessToken" });

    const axiosPostStub = sinon
      .stub(axios, "post")
      .resolves({ data: { id: "eventId" } });

    await calendarController.createCallendarEvent(req, res);

    expect(userStub).to.have.been.calledOnceWith("userId");
    expect(axiosPostStub).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledOnceWith(200);
    expect(res.json).to.have.been.calledOnceWith({
      message: "Event created",
      event: { id: "eventId" },
    });
  });

  it("should return 401 if user is not found", async () => {
    const userStub = sinon.stub(User, "findById").resolves(null);

    await calendarController.createCallendarEvent(req, res);

    expect(userStub).to.have.been.calledOnceWith("userId");
    expect(res.status).to.have.been.calledOnceWith(401);
    expect(res.json).to.have.been.calledOnceWith({
      error: "User not authenticated or token missing",
    });
  });

  it("should return 401 if access token is missing", async () => {
    const userStub = sinon.stub(User, "findById").resolves({}); // No access token

    await calendarController.createCallendarEvent(req, res);

    expect(userStub).to.have.been.calledOnceWith("userId");
    expect(res.status).to.have.been.calledOnceWith(401);
    expect(res.json).to.have.been.calledOnceWith({
      error: "User not authenticated or token missing",
    });
  });

  it("should handle errors during calendar event creation", async () => {
    const userStub = sinon
      .stub(User, "findById")
      .resolves({ accessToken: "validAccessToken" });
    const axiosPostStub = sinon
      .stub(axios, "post")
      .rejects(new Error("API error"));

    await calendarController.createCallendarEvent(req, res);

    expect(userStub).to.have.been.calledOnceWith("userId");
    expect(axiosPostStub).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledOnceWith(500);
    expect(res.json).to.have.been.calledOnceWith({
      error: "Failed to create calendar event",
    });
  });
});
