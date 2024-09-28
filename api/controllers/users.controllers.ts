import { Request, RequestHandler, Response } from "express";
import User from "../models/user.model";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

export const getSingleUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};
