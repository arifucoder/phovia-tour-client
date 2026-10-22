import type { ComponentType } from "react";

export type { ILogin, ISendOtp, IVerifyOtp } from "./auth.type";
export type { IDivision } from "./division.type";
export type { IMeta, ITour, ITourType } from "./tour.type";

export interface IResponse<T> {
	statusCode: number;
	success: boolean;
	message: string;
	data: T;
}

export type TApiError = {
	status?: number;
	data?: {
		message?: string;
		errorSources?: { path: string; message: string }[];
	};
};

export interface ISidebarItem {
	title: string;
	items: {
		title: string;
		url: string;
		component: ComponentType;
	}[];
}

export type TRole = "SUPER_ADMIN" | "ADMIN" | "USER";
