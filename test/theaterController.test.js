let chai;
let expect;
let sinon;
let sinonChai;
const theaterController = require("../controllers/theaterController");
const { Theater } = require("../models/theater");

before(async () => {
  chai = await import("chai");
  expect = chai.expect;

  sinon = await import("sinon");

  // Dynamically import and use sinon-chai
  sinonChai = await import("sinon-chai");
  chai.use(sinonChai.default); // Use the default export of sinon-chai

});

describe("Theater Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createTheaterEvent", () => {
    it("should create a new theater", async () => {
      req.body = {
        name: "New Theater",
        location: "City Center",
      };

      const saveStub = sinon.stub(Theater.prototype, "save").resolves(req.body);

      await theaterController.createTheaterEvent(req, res);

      expect(saveStub).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledOnceWith(201);
      expect(res.json).to.have.been.calledOnceWith(req.body);
    });

    it("should return a 400 error if validation fails", async () => {
      req.body = {}; // Invalid body

      await theaterController.createTheaterEvent(req, res);

      expect(res.status).to.have.been.calledOnceWith(400);
      expect(res.json).to.have.been.calledOnceWith(
        sinon.match({ error: sinon.match.string })
      );
    });
  });

  describe("getAllTheatersEvent", () => {
    it("should fetch all theaters", async () => {
      const theaters = [{ name: "Theater 1" }, { name: "Theater 2" }];
      const findStub = sinon.stub(Theater, "find").resolves(theaters);

      await theaterController.getAllTheatersEvent(req, res);

      expect(findStub).to.have.been.calledOnce;
      expect(res.json).to.have.been.calledOnceWith(theaters);
    });

    it("should return a 500 error if fetching fails", async () => {
      const findStub = sinon
        .stub(Theater, "find")
        .throws(new Error("Database error"));

      await theaterController.getAllTheatersEvent(req, res);

      expect(findStub).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledOnceWith(500);
      expect(res.json).to.have.been.calledOnceWith(
        sinon.match({ error: sinon.match.string })
      );
    });
  });

  describe("getTheaterByIdEvent", () => {
    it("should fetch theater by ID", async () => {
      req.params.id = "theaterId";
      const theater = { name: "Theater 1", _id: "theaterId" };
      const findByIdStub = sinon.stub(Theater, "findById").resolves(theater);

      await theaterController.getTheaterByIdEvent(req, res);

      expect(findByIdStub).to.have.been.calledOnceWith(req.params.id);
      expect(res.json).to.have.been.calledOnceWith(theater);
    });

    it("should return 404 if theater not found", async () => {
      req.params.id = "theaterId";
      const findByIdStub = sinon.stub(Theater, "findById").resolves(null);

      await theaterController.getTheaterByIdEvent(req, res);

      expect(findByIdStub).to.have.been.calledOnceWith(req.params.id);
      expect(res.status).to.have.been.calledOnceWith(404);
      expect(res.json).to.have.been.calledOnceWith({
        error: "Theater not found",
      });
    });

    it("should return 500 error if fetching fails", async () => {
      req.params.id = "theaterId";
      const findByIdStub = sinon
        .stub(Theater, "findById")
        .throws(new Error("Database error"));

      await theaterController.getTheaterByIdEvent(req, res);

      expect(findByIdStub).to.have.been.calledOnceWith(req.params.id);
      expect(res.status).to.have.been.calledOnceWith(500);
      expect(res.json).to.have.been.calledOnceWith(
        sinon.match({ error: sinon.match.string })
      );
    });
  });

  describe("updateTheaterByIdEvent", () => {
    it("should update theater by ID", async () => {
      req.params.id = "theaterId";
      req.body = { name: "Updated Theater" };
      const theater = { name: "Updated Theater", _id: "theaterId" };
      const findByIdAndUpdateStub = sinon
        .stub(Theater, "findByIdAndUpdate")
        .resolves(theater);

      await theaterController.updateTheaterByIdEvent(req, res);

      expect(findByIdAndUpdateStub).to.have.been.calledOnceWith(
        req.params.id,
        req.body,
        { new: true }
      );
      expect(res.json).to.have.been.calledOnceWith(theater);
    });

    it("should return 404 if theater not found", async () => {
      req.params.id = "theaterId";
      req.body = { name: "Updated Theater" };
      const findByIdAndUpdateStub = sinon
        .stub(Theater, "findByIdAndUpdate")
        .resolves(null);

      await theaterController.updateTheaterByIdEvent(req, res);

      expect(findByIdAndUpdateStub).to.have.been.calledOnceWith(
        req.params.id,
        req.body,
        { new: true }
      );
      expect(res.status).to.have.been.calledOnceWith(404);
      expect(res.json).to.have.been.calledOnceWith({
        error: "Theater not found",
      });
    });

    it("should return 400 error if validation fails", async () => {
      req.params.id = "theaterId";
      req.body = {}; // Invalid body
      const findByIdAndUpdateStub = sinon
        .stub(Theater, "findByIdAndUpdate")
        .throws(new Error("Validation error"));

      await theaterController.updateTheaterByIdEvent(req, res);

      expect(findByIdAndUpdateStub).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledOnceWith(400);
      expect(res.json).to.have.been.calledOnceWith(
        sinon.match({ error: sinon.match.string })
      );
    });
  });

  describe("deleteTheaterByIdEvent", () => {
    it("should delete theater by ID", async () => {
      req.params.id = "theaterId";
      const theater = { name: "Theater to Delete", _id: "theaterId" };
      const findByIdAndDeleteStub = sinon
        .stub(Theater, "findByIdAndDelete")
        .resolves(theater);

      await theaterController.deleteTheaterByIdEvent(req, res);

      expect(findByIdAndDeleteStub).to.have.been.calledOnceWith(req.params.id);
      expect(res.json).to.have.been.calledOnceWith({
        message: "Theater deleted successfully",
      });
    });

    it("should return 404 if theater not found", async () => {
      req.params.id = "theaterId";
      const findByIdAndDeleteStub = sinon
        .stub(Theater, "findByIdAndDelete")
        .resolves(null);

      await theaterController.deleteTheaterByIdEvent(req, res);

      expect(findByIdAndDeleteStub).to.have.been.calledOnceWith(req.params.id);
      expect(res.status).to.have.been.calledOnceWith(404);
      expect(res.json).to.have.been.calledOnceWith({
        error: "Theater not found",
      });
    });

    it("should return 500 error if deletion fails", async () => {
      req.params.id = "theaterId";
      const findByIdAndDeleteStub = sinon
        .stub(Theater, "findByIdAndDelete")
        .throws(new Error("Database error"));

      await theaterController.deleteTheaterByIdEvent(req, res);

      expect(findByIdAndDeleteStub).to.have.been.calledOnceWith(req.params.id);
      expect(res.status).to.have.been.calledOnceWith(500);
      expect(res.json).to.have.been.calledOnceWith(
        sinon.match({ error: sinon.match.string })
      );
    });
  });
});
