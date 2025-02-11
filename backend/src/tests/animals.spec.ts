import request from "supertest";
import express from "express";
import routes from "../routes/routes"; 
import { connection } from "../config/database";

jest.mock("../config/database", () => ({
  connection: {
    query: jest.fn(), 
  },
}));

describe("Animals Controller", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json()); 
    app.use(routes); 
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /create-animal", () => {
    it("should create an animal successfully", async () => {
      jest.setTimeout(5000); // Increase timeout for debugging

    // Mock database query
    
      (connection.query as jest.Mock).mockImplementation((sql, params, callback) => {
        if (callback === 'function') {
          
          callback(null);
        }
      });

      const response = await request(app)
        .post("/create-animal")
        .field("type", "dog")
        .field("breed", "Labrador")
        .field("milk", "2")
        .field("child", "3")
        .field("age", "5")
        .field("price", "500")
        .field("description", "Friendly dog")
        .attach("animalImg", Buffer.from("fake-image-data"), "cow.jpg");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Animal added successfully");
    });

    it("should return 400 if image is missing", async () => {
      const response = await request(app)
        .post("/create-animal")
        .send({
          type: "dog",
          breed: "Labrador",
          milk: "2",
          child: "3",
          age: "5",
          price: "500",
          description: "Friendly dog",
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Image is required");
    });
  });

  describe("GET /animals-list", () => {
    it("should fetch all animals", async () => {
      
      (connection.query as jest.Mock).mockImplementation((sql, callback) => {
        callback(null, [
          { id: 1, type: "dog", breed: "Labrador" },
          { id: 2, type: "cat", breed: "Siamese" },
        ]);
      });

      const response = await request(app).get("/animals-list");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Animals Fetched successfully");
      expect(response.body.data.length).toBe(2);
    });

    it("should handle database errors", async () => {
      
      (connection.query as jest.Mock).mockImplementation((sql, callback) => {
        callback(new Error("Database error"));
      });

      const response = await request(app).get("/animals-list");

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Database error");
    });
  });

  describe("POST /search-animal", () => {
    it("should fetch animals by type", async () => {
      
      (connection.query as jest.Mock).mockImplementation((sql, params, callback) => {
        callback(null, [{ id: 1, type: "dog", breed: "Labrador" }]);
      });

      const response = await request(app).post("/search-animal").send({ type: "dog" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Animals fetched successfully");
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].type).toBe("dog");
    });

    it("should return 400 if type is not provided", async () => {
      const response = await request(app).post("/search-animal").send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Type is required");
    });

    it("should handle database errors", async () => {
      
      (connection.query as jest.Mock).mockImplementation((sql, params, callback) => {
        callback(new Error("Database error"));
      });

      const response = await request(app).post("/search-animal").send({ type: "dog" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Database error");
    });
  });
});
