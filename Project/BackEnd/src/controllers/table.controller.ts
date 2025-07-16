import { AppDataSource } from "../config/data.config";
import { Table, UserRoles } from "../models";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { User } from "../models";
import { error } from "console";


export const getAllTables = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tableRepo = AppDataSource.getRepository(Table);

    const tables = await tableRepo.find({
      relations: ["assignedWaiter"],
      order: { id: "ASC" },
    });

    res.status(200).json({
      status: "success",
      message: tables.length === 0 ? "No tables found" : "Tables fetched successfully",
      data: tables,
    });
  } catch (err) {
    console.error("Error fetching tables:", err);
    if (!(err instanceof ApiError)) {
      return next(new ApiError(500, "Unexpected error fetching tables"));
    }
    return next(err);
  }
};


export const addTable = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tableRepo = AppDataSource.getRepository(Table);
    const { name, status } = req.body;

    if (!name) {
      throw new ApiError(400, "Table name is required");
    }

    const newTable = tableRepo.create({
      name,
      status: status !== undefined ? Boolean(status) : true, // default to available (true)
    });

    await tableRepo.save(newTable);

    res.status(201).json({
      status: "success",
      message: "Table added successfully",
      data: newTable,
    });
  } catch (err) {
    console.error("Error adding table:", err);
    if (!(err instanceof ApiError)) {
      return next(new ApiError(500, "Unexpected error adding table"));
    }
    return next(err);
  }
};


export const editTable = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tableRepo = AppDataSource.getRepository(Table);
    const userRepo = AppDataSource.getRepository(User);
    const { id } = req.params;
    const { status, waiterId } = req.body;

    const table = await tableRepo.findOne({
      where: { id: Number(id) },
      relations: ["assignedWaiter"],
    });

    if (!table) {
      throw new ApiError(404, "Table not found");
    }

    if (status !== undefined) {
      if (status === "true" || status === true) {
        table.status = true;
      } else if (status === "false" || status === false) {
        table.status = false;
      } else {
        throw new ApiError(400, "Invalid status value");
      }
    }
    if (waiterId !== undefined) {
      const waiter = await userRepo.findOne({ where: { id: waiterId } });

     
      if (!waiter) {
        throw new ApiError(404, "Waiter not found");
      }
       if(waiter?.role !== UserRoles.WAITER){
        throw new ApiError(404, " User is not waiter")
      }
      
      table.assignedWaiter = waiter;
    }

    await tableRepo.save(table);

    res.status(200).json({
      status: "success",
      message: "Table updated successfully",
       data: {
            id: table.id,
            name: table.name,
            status: table.status,
            assignedWaiter: table.assignedWaiter ? {
            id: table.assignedWaiter.id,
            name: table.assignedWaiter.name,
            email: table.assignedWaiter.email
            } : null
        },
    });
  } catch (err) {
    console.error("Error updating table:", err);
    if (!(err instanceof ApiError)) {
      return next(new ApiError(500, "Unexpected error updating table"));
    }
    return next(err);
  }
};
