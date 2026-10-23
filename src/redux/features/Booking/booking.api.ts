import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";

type TCreateBookingPayload = { tour: string; guestCount: number };
type TCreateBookingResponse = { paymentUrl: string; booking: unknown };

export const bookingApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		createBooking: builder.mutation<TCreateBookingResponse, TCreateBookingPayload>({
			query: (payload) => ({
				url: "/booking",
				method: "POST",
				data: payload,
			}),
			transformResponse: (response: IResponse<TCreateBookingResponse>) => response.data,
			invalidatesTags: ["BOOKING"],
		}),
	}),
});

export const { useCreateBookingMutation } = bookingApi;
