let chai;
let expect;
let sinon;
let sinonChai;
const { Seat } = require("../models/seat");
const { Theater } = require("../models/theater");
const seatController = require("../controllers/seatController");

before(async () => {
  chai = await import("chai");
  expect = chai.expect;

  sinon = await import("sinon");

  // Dynamically import and use sinon-chai
  sinonChai = await import("sinon-chai");
  chai.use(sinonChai.default); // Use the default export of sinon-chai
});

describe("Seat Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
      send: sinon.spy(),
    };
  });

  afterEach(() => {
    sinon.restore(); // Restore all stubs and mocks after each test
  });

  describe("getByTheaterIdEvent", () => {
   it("should fetch seats by theater ID", async () => {
     req.params.theaterId = "66ff7b03a22982173b867b83";
     const seats = [
       { section: "A", row: "1", number: 1, isAvailable: true },
       { section: "B", row: "2", number: 2, isAvailable: false },
     ];
     const findStub = sinon.stub(Seat, "find").resolves(seats); // Stub the Seat.find method

     await seatController.getByTheaterIdEvent(req, res);

     expect(findStub).to.have.been.calledOnceWith({
       theater: "66ff7b03a22982173b867b83",
     });
     expect(res.json).to.have.been.calledOnceWith(seats); // Check that it returns the expected seats
     findStub.restore(); // Restore the original method
   });

    it("should handle errors while fetching seats", async () => {
      req.params.theaterId = "theaterId";
      const findStub = sinon.stub(Seat, "find").rejects(new Error("DB error")); // Stub to reject

      await seatController.getByTheaterIdEvent(req, res);

      expect(findStub).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledOnceWith(500); // Expect a 500 status code
      expect(res.json).to.have.been.calledOnceWith({ error: "Server error" }); // Expect the correct error response
      findStub.restore(); // Restore the original method
    });
  });

  describe("createSeatEvent", () => {
    it("should book selected seats successfully", async () => {
      req.body = {
        theaterId: "theaterId",
        selectedSeats: ["A-1-1", "A-1-2"],
      };
      const findOneAndUpdateStub = sinon
        .stub(Seat, "findOneAndUpdate")
        .resolves(true);

      await seatController.createSeatEvent(req, res);

      expect(findOneAndUpdateStub).to.have.been.calledTwice; // Called for each selected seat
      expect(res.send).to.have.been.calledOnceWith("Seats booked successfully");
    });

    it("should handle errors while booking seats", async () => {
      req.body = {
        theaterId: "theaterId",
        selectedSeats: ["A-1-1"],
      };
      const findOneAndUpdateStub = sinon
        .stub(Seat, "findOneAndUpdate")
        .rejects(new Error("DB error"));

      await seatController.createSeatEvent(req, res);

      expect(findOneAndUpdateStub).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledOnceWith(500);
      expect(res.json).to.have.been.calledOnceWith({
        error: "Internal Server Error",
      });
    });
  });

  describe("createMultipleSeatsEvent", () => {
    it("should create multiple seats successfully", async () => {
      req.body = {
        theater: "New Theater",
        sections: [
          {
            name: "A",
            layout: [
              [true, false],
              [true, true],
            ],
          },
          {
            name: "B",
            layout: [
              [true, true],
              [false, false],
            ],
          },
        ],
        location: "Downtown",
      };

      const findOneStub = sinon.stub(Theater, "findOne").resolves(null); // Theater does not exist
      const saveStub = sinon.stub(Theater.prototype, "save").resolves();
      const insertManyStub = sinon.stub(Seat, "insertMany").resolves();

      await seatController.createMultipleSeatsEvent(req, res);

      expect(findOneStub).to.have.been.calledOnceWith({
        name: "New Theater",
        location: "Downtown",
      });
      expect(saveStub).to.have.been.calledOnce;
      expect(insertManyStub).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledOnceWith(201);
      expect(res.json).to.have.been.calledOnceWith({
        message: "Seats created successfully",
      });
    });

    it("should return 404 if theater already exists", async () => {
      req.body = {
        theater: "Existing Theater",
        sections: [],
        location: "Downtown",
      };

      const findOneStub = sinon.stub(Theater, "findOne").resolves({}); // Theater exists

      await seatController.createMultipleSeatsEvent(req, res);

      expect(findOneStub).to.have.been.calledOnceWith({
        name: "Existing Theater",
        location: "Downtown",
      });
      expect(res.status).to.have.been.calledOnceWith(404);
      expect(res.json).to.have.been.calledOnceWith({
        error: "Theater Already exist",
      });
    });

    it("should handle errors while creating multiple seats", async () => {
      req.body = {
        theater: "New Theater",
        sections: [{ name: "A", layout: [[true]] }],
        location: "Downtown",
      };

      const findOneStub = sinon.stub(Theater, "findOne").resolves(null);
      const saveStub = sinon
        .stub(Theater.prototype, "save")
        .rejects(new Error("DB error"));

      await seatController.createMultipleSeatsEvent(req, res);

      expect(findOneStub).to.have.been.calledOnce;
      expect(saveStub).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledOnceWith(500);
      expect(res.json).to.have.been.calledOnceWith({
        error: "Internal server error",
      });
    });
  });

  describe("getSeatByIdEvent", () => {
    it("should fetch a seat by ID", async () => {
      req.params.id = "seatId";
      const seat = { _id: "seatId", section: "A", row: 1, number: 1 };
      const findByIdStub = sinon.stub(Seat, "findById").resolves(seat);

      await seatController.getSeatByIdEvent(req, res);

      expect(findByIdStub).to.have.been.calledOnceWith("seatId");
      expect(res.json).to.have.been.calledOnceWith(seat);
    });

    it("should return 404 if seat is not found", async () => {
      req.params.id = "seatId";
      const findByIdStub = sinon.stub(Seat, "findById").resolves(null);

      await seatController.getSeatByIdEvent(req, res);

      expect(findByIdStub).to.have.been.calledOnceWith("seatId");
      expect(res.status).to.have.been.calledOnceWith(404);
      expect(res.json).to.have.been.calledOnceWith({ error: "Seat not found" });
    });

    it("should handle errors while fetching seat by ID", async () => {
      req.params.id = "seatId";
      const findByIdStub = sinon
        .stub(Seat, "findById")
        .rejects(new Error("DB error"));

      await seatController.getSeatByIdEvent(req, res);

      expect(findByIdStub).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledOnceWith(500);
      expect(res.json).to.have.been.calledOnceWith({ error: "DB error" });
    });
  });

  describe("deleteSeatEvent", () => {
    it("should delete a seat by ID", async () => {
      req.params.id = "seatId";
      const seat = { _id: "seatId" };
      const findByIdAndDeleteStub = sinon
        .stub(Seat, "findByIdAndDelete")
        .resolves(seat);

      await seatController.deleteSeatEvent(req, res);

      expect(findByIdAndDeleteStub).to.have.been.calledOnceWith("seatId");
      expect(res.json).to.have.been.calledOnceWith({
        message: "Seat deleted successfully",
      });
    });

    it("should return 404 if seat is not found for deletion", async () => {
      req.params.id = "seatId";
      const findByIdAndDeleteStub = sinon
        .stub(Seat, "findByIdAndDelete")
        .resolves(null);

      await seatController.deleteSeatEvent(req, res);

      expect(findByIdAndDeleteStub).to.have.been.calledOnceWith("seatId");
      expect(res.status).to.have.been.calledOnceWith(404);
      expect(res.json).to.have.been.calledOnceWith({ error: "Seat not found" });
    });

    it("should handle errors while deleting seat", async () => {
      req.params.id = "seatId";
      const findByIdAndDeleteStub = sinon
        .stub(Seat, "findByIdAndDelete")
        .rejects(new Error("DB error"));

      await seatController.deleteSeatEvent(req, res);

      expect(findByIdAndDeleteStub).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledOnceWith(500);
      expect(res.json).to.have.been.calledOnceWith({ error: "DB error" });
    });
  });
});
