import { baseApi } from "@/redux/baseApi";

export const divisionApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		addDivision: builder.mutation({
			query: (divisionData: FormData) => ({
				url: "/division/create", // 👈 check your backend route
				method: "POST",
				data: divisionData,
				// ❌ don't set Content-Type manually — axios adds multipart boundary itself
			}),
			invalidatesTags: ["DIVISION"],
		}),
		getDivisions: builder.query({
			query: () => ({
				url: "/division",
				method: "GET",
			}),
			providesTags: ["DIVISION"],
			transformResponse: (response) => response.data,
		}),
	}),
});

export const { useAddDivisionMutation, useGetDivisionsQuery } = divisionApi;
