import { Request, Response } from "express";
import { userService } from "../user/user.service.js";
import { profileService } from "./profile.service.js";
import { PublicUser } from "../user/user.model.js";

export class ProfileController {

	async updateAvatar(req: Request, res: Response): Promise<void> {
		const id = Number(req.user.id);
		try {
			if (!req.file) throw { errors: { general: ['No file uploaded.'] } };
			const name = req.session.user?.name?.toLowerCase().replace(/\s+/g, '_');
			const avatar = `/uploads/avatars/${id}_${name}/${req.file.filename}`;
			const user = await userService.update(id, { avatar });
			req.session.user = { ...req.session.user, avatar: user.avatar } as PublicUser;
			res.status(200).json({ status: 'success' });
		} catch (err: unknown) {
			res.status(400).json(err);
		}
	}

	async updateName(req: Request, res: Response): Promise<void> {
		const { name } = req.body;
		const id = Number(req.user.id);

		try {
			const user = await userService.update(id, { name });
			req.session.user = { ...req.session.user, name: user.name } as PublicUser;
			res.status(201).json({ status: 'success' });
		} catch (err: unknown | any) {
			if (err.code === 'P2025') {
				res.status(404).json({ error: 'User not found' });
				return;
			}
			res.status(400).json(err);
		}
	}

	async updateEmail(req: Request, res: Response): Promise<void> {
		const { email } = req.body;
		const id = Number(req.user.id);
		try {
			const user = await userService.update(id, { email });
			req.session.user = { ...req.session.user, email: user.email } as PublicUser;
			res.status(200).json({ status: 'success' });
		} catch (err: unknown) {
			res.status(400).json(err);
		}
	}

	async updatePassword(req: Request, res: Response): Promise<void> {
		const id = Number(req.user.id);
		console.log(id)
		try {

			const user = await userService.findById(id);
			if (!user) throw { general: { error: 'Server error' } }

			await profileService.updatePassword(user.email, req.body);

			res.status(200).json({ status: 'success' });
		} catch (err: unknown) {
			res.status(400).json(err);
		}
	}

	async deleteAccount(req: Request, res: Response): Promise<void> {
		// wait
	}

	showProfile(req: Request, res: Response): void {
		res.render("pages/profile", {
			title: "Profile",
			layout: "layouts/app",
		});
	}
}

export const profileController = new ProfileController();
