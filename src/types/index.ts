import type { ComponentType } from "react";

export type { ILogin, ISendOtp, IVerifyOtp } from "./auth.type";

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
