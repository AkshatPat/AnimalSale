import { Request, Response } from "express";
import { connection } from "../config/database";
import validSchema from "./validate_schema";
import multer from "multer";


const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});


const fileFilterConfig = function (
  req: any,
  file: { mimetype: string },
  cb: (arg0: null, arg1: boolean) => void
) {
  if (file.mimetype.includes("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({
  storage: storageConfig,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilterConfig,
});


const createAnimal = (req: Request, res: Response) => {
  upload.single('animalImg')(req, res, (err) => {
    if (err) return res.status(400).json({ error: 'File upload failed!', details: err });

    const { error } = validSchema.createAnimalSchema.validate(req.body);
    
    if (error) {
        return res.status(400).json({
        code: 400,
        status: false,
        message: error.details[0].message,
        });
    }

    const { type, breed, milk, child, age, price, description } = req.body;

    if (!req.file) return res.status(400).json({ error: 'Image is required' });

    const imagePath = req.file.path.replace(/\\/g, '/');

    const sql = `
      INSERT INTO animal (animalImg, type, breed, milk, child, age, price, description)
      VALUES ("${imagePath}", "${type}", "${breed}", "${milk}", "${child}", "${age}", "${price}", "${description}")
    `;

    connection.query(sql, (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err });

      res.status(200).json({
        message: 'Animal created successfully',
        data: result,
      });
    });
  });
};


const getAnimal = async (req: Request, res: Response) => {
    try {
        var sql = 'select * from animal';
        connection.query(sql, function (err, result) {
            if (err)
              return res.status(400).json({
                code: 400,
                status: false,
                message: "Database error",
              });
            else {
              
        
              return res.status(200).json({
                code: 200,
                status: true,
                message: "Animals Fetched successfully",
                data: result
              });
            }
          });
    } catch (error) {
        res.status(400).json({
            code: 400,
            status: false,
            message: "Database error"
        })
    }
}


const searchAnimal = async (req: Request, res: Response) => {
  try {
    const { type } = req.body;

    if (!type) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Type is required",
      });
    }

    const sql = `SELECT * FROM animal WHERE type = ?`;
    connection.query(sql, [type], (err, result) => {
      if (err) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: err.message,
        });
      }

      return res.status(200).json({
        code: 200,
        status: true,
        message: "Animals fetched successfully",
        data: result,
      });
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: false,
      message: "Internal Server Error",
    });
  }
};


export default {
    createAnimal,
    getAnimal,
    searchAnimal
}