import { Request, Response } from 'express';
import { userService } from './user.service.js';

export class UserController {

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.findAll();
      res.json({ status: 'success', data: users });
    } catch (err) {
      res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.findById(Number(req.params.id));
      if (!user) {
        res.status(404).json({ status: 'error', message: 'User not found' });
        return;
      }
      res.json({ status: 'success', data: user });
    } catch (err) {
      res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.create(req.body);
      res.status(201).json({ status: 'success', data: user });
    } catch (err: any) {
      res.status(400).json({ status: 'error', message: err.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.update(Number(req.params.id), req.body);
      res.json({ status: 'success', data: user });
    } catch (err) {
      res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await userService.delete(Number(req.params.id));
      res.json({ status: 'success', message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
  }

  async showUsers(req: Request, res: Response): Promise<void> {

    const page = Number(req.query.page) || 1;

    try {
      const { users, total, pages } = await userService.findAll(page, 15);

      res.render('pages/users', {
        title: 'Users',
        layout: 'layouts/app',
        users,
        total,
        pages,
        currentPage: page
      });

    } catch (err: unknown) {
      res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }

  }

}

export const userController = new UserController();