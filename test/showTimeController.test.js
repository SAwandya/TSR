let chai;
let expect;
let sinon;
let sinonChai;
const { Showtime } = require("../models/showtime");
const showtimeController = require("../controllers/showtimeController");

before(async () => {
  chai = await import("chai");
  expect = chai.expect;

  sinon = await import("sinon");

  // Dynamically import and use sinon-chai
  sinonChai = await import("sinon-chai");
  chai.use(sinonChai.default); // Use the default export of sinon-chai

  bookingController = require("../controllers/bookingController");
});

describe("Showtime Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "showtimeId" },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should fetch all showtimes", async () => {
    const showtimes = [
      { date: "2024-11-18T00:00:00.000Z" },
      { date: "2024-11-10T00:00:00.000Z" },
    ];
    const findStub = sinon.stub(Showtime, "find").resolves(showtimes);

    await showtimeController.getAllShowTimesEvent(req, res);

    expect(findStub).to.have.been.calledOnce;

    expect(res.status).to.have.been.calledOnceWith(200);
    expect(res.status().json).to.have.been.calledOnceWith(showtimes);
    findStub.restore(); // Restore the original method
  });

  it("should handle errors while fetching showtimes", async () => {
    const findStub = sinon
      .stub(Showtime, "find")
      .rejects(new Error("DB error"));

    await showtimeController.getAllShowTimesEvent(req, res);

    expect(findStub).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledOnceWith(500);
    expect(res.status().json).to.have.been.calledOnceWith("Server error");
    findStub.restore(); // Restore the original method
  });
  

  it("should create a new showtime", async () => {
    req.body = {
      theater: "theaterId",
      date: "2024-10-26T00:00:00.000Z",
      times: ["05:10", "11:14"],
    };

    const saveStub = sinon
      .stub(Showtime.prototype, "save")
      .resolves({ _id: "showtimeId", ...req.body });

    await showtimeController.createShowTimeEvent(req, res);

    expect(saveStub).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledOnceWith(201);
    expect(res.json).to.have.been.calledOnceWith({
      _id: "showtimeId",
      ...req.body,
    });
  });

  it("should return 400 if required fields are missing", async () => {
    req.body = { date: "2024-10-15" }; // Missing theater and times

    await showtimeController.createShowTimeEvent(req, res);

    expect(res.status).to.have.been.calledOnceWith(400);
    expect(res.status().json).to.have.been.calledOnceWith({
      message: "Theater, date, and showtimes are required.",
    });
  });

  it("should fetch showtimes by theater and date", async () => {
    req.query = {
      theater: "theaterId",
      date: "2024-10-15",
    };

    const showtimes = [
      {
        theater: "theaterId",
        date: "2024-10-15",
        times: ["10:00 AM", "1:00 PM"],
      },
    ];
    const findStub = sinon.stub(Showtime, "find").resolves(showtimes);

    await showtimeController.getShowTimeByTheaterAndDateEvent(req, res);

    expect(findStub).to.have.been.calledOnceWith({
      theater: req.query.theater,
      date: {
        $gte: new Date(req.query.date).setHours(0, 0, 0, 0),
        $lt: new Date(req.query.date).setHours(23, 59, 59, 999),
      },
    });
    expect(res.status).to.have.been.calledOnceWith(200);
    expect(res.json).to.have.been.calledOnceWith(showtimes);
  });

  it("should return 400 if theater or date is missing", async () => {
    req.query = { theater: "theaterId" }; // Missing date

    await showtimeController.getShowTimeByTheaterAndDateEvent(req, res);

    expect(res.status).to.have.been.calledOnceWith(400);
    expect(res.status().json).to.have.been.calledOnceWith({
      message: "Theater and date are required.",
    });
  });

  it("should fetch showtime by ID", async () => {
    req.params.id = "showtimeId";

    const showtime = {
      _id: "showtimeId",
      theater: "theaterId",
      date: "2024-10-15",
      times: ["10:00 AM", "1:00 PM"],
    };
    const findByIdStub = sinon.stub(Showtime, "findById").resolves(showtime);

    await showtimeController.getShowTimeByIdEvent(req, res);

    expect(findByIdStub).to.have.been.calledOnceWith(req.params.id);
    expect(res.json).to.have.been.calledOnceWith(showtime);
  });

  it("should return 404 if showtime is not found", async () => {
    req.params.id = "showtimeId";

    const findByIdStub = sinon.stub(Showtime, "findById").resolves(null);

    await showtimeController.getShowTimeByIdEvent(req, res);

    expect(findByIdStub).to.have.been.calledOnceWith(req.params.id);
    expect(res.status).to.have.been.calledOnceWith(404);
    expect(res.json).to.have.been.calledOnceWith({
      error: "Showtime not found",
    });
  });

  it("should update a showtime by ID", async () => {
    req.params.id = "showtimeId";
    req.body = { times: ["11:00 AM", "2:00 PM"] };

    const updatedShowtime = {
      _id: "showtimeId",
      theater: "theaterId",
      date: "2024-10-15",
      times: req.body.times,
    };
    const findByIdAndUpdateStub = sinon
      .stub(Showtime, "findByIdAndUpdate")
      .resolves(updatedShowtime);

    await showtimeController.updateShowTimeByIdEvent(req, res);

    expect(findByIdAndUpdateStub).to.have.been.calledOnceWith(
      req.params.id,
      req.body,
      { new: true }
    );
    expect(res.json).to.have.been.calledOnceWith(updatedShowtime);
  });

  it("should return 404 if showtime to update is not found", async () => {
    req.params.id = "showtimeId";
    req.body = { times: ["11:00 AM", "2:00 PM"] };

    const findByIdAndUpdateStub = sinon
      .stub(Showtime, "findByIdAndUpdate")
      .resolves(null);

    await showtimeController.updateShowTimeByIdEvent(req, res);

    expect(findByIdAndUpdateStub).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledOnceWith(404);
    expect(res.json).to.have.been.calledOnceWith({
      error: "Showtime not found",
    });
  });

  it("should delete a showtime by ID", async () => {
    req.params.id = "showtimeId";

    const showtime = { _id: "showtimeId" };
    const findByIdAndDeleteStub = sinon
      .stub(Showtime, "findByIdAndDelete")
      .resolves(showtime);

    await showtimeController.deleteShowTimeByIdEvent(req, res);

    expect(findByIdAndDeleteStub).to.have.been.calledOnceWith(req.params.id);
    expect(res.json).to.have.been.calledOnceWith({
      message: "Showtime deleted successfully",
    });
  });

  it("should return 404 if showtime to delete is not found", async () => {
    req.params.id = "showtimeId";

    const findByIdAndDeleteStub = sinon
      .stub(Showtime, "findByIdAndDelete")
      .resolves(null);

    await showtimeController.deleteShowTimeByIdEvent(req, res);

    expect(findByIdAndDeleteStub).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledOnceWith(404);
    expect(res.json).to.have.been.calledOnceWith({
      error: "Showtime not found",
    });
  });
});
