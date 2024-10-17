let chai;
let expect;
let sinon;
let sinonChai;
const { Booking } = require("../models/booking"); // CommonJS modules
const { Theater } = require("../models/theater");
let bookingController;

before(async () => {
  chai = await import("chai");
  expect = chai.expect;

  sinon = await import("sinon");

  // Dynamically import and use sinon-chai
  sinonChai = await import("sinon-chai");
  chai.use(sinonChai.default); // Use the default export of sinon-chai

  bookingController = require("../controllers/bookingController");
});

describe("Booking Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        theater: "theaterId",
        seats: ["A1", "A2"],
        customerName: "John Doe",
        customerEmail: "john@example.com",
        totalAmount: 100,
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

  it("should create a new booking", async () => {
    const theaterStub = sinon
      .stub(Theater, "findById")
      .resolves({ _id: "theaterId", name: "Grand Theater" });
    const saveStub = sinon
      .stub(Booking.prototype, "save")
      .resolves({ _id: "bookingId", ...req.body });

    await bookingController.createBookingEvent(req, res);

    expect(theaterStub).to.have.been.calledOnceWith("theaterId");
    expect(saveStub).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledOnceWith(201);
    expect(res.json).to.have.been.calledOnceWith({
      message: "Booking created successfully",
      savedBooking: { _id: "bookingId", ...req.body },
    });
  });

  it("should return 404 if theater is not found", async () => {
    const theaterStub = sinon.stub(Theater, "findById").resolves(null);

    await bookingController.createBookingEvent(req, res);

    expect(theaterStub).to.have.been.calledOnceWith("theaterId");
    expect(res.status).to.have.been.calledOnceWith(404);
    expect(res.json).to.have.been.calledOnceWith({
      error: "Theater not found",
    });
  });

  it("should handle server errors gracefully", async () => {
    const theaterStub = sinon
      .stub(Theater, "findById")
      .throws(new Error("Server error"));

    await bookingController.createBookingEvent(req, res);

    expect(theaterStub).to.have.been.calledOnce;
    expect(res.status).to.have.been.calledOnceWith(500);
    expect(res.json).to.have.been.calledOnceWith({ message: "Server error" });
  });

  it("should return all bookings", async () => {
    const bookingsStub = sinon
      .stub(Booking, "find")
      .resolves([{ _id: "bookingId" }]);

    await bookingController.getAllBookingsEvent(req, res);

    expect(bookingsStub).to.have.been.calledOnce;
    expect(res.json).to.have.been.calledOnceWith([{ _id: "bookingId" }]);
  });

  it("should return bookings for a customer", async () => {
    req.body.customerEmail = "john@example.com";
    const bookingsStub = sinon
      .stub(Booking, "find")
      .resolves([{ _id: "bookingId", customerEmail: "john@example.com" }]);

    await bookingController.getBookingByCustomerIdEvent(req, res);

    expect(bookingsStub).to.have.been.calledOnceWith({
      customerEmail: "john@example.com",
    });
    expect(res.json).to.have.been.calledOnceWith([
      { _id: "bookingId", customerEmail: "john@example.com" },
    ]);
  });


});
