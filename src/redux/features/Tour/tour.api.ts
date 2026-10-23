import { baseApi } from "@/redux/baseApi";
import type { IMeta, IResponse, ITour } from "@/types";
type TToursParams = {
	page?: number;
	limit?: number;
	searchTerm?: string; // searches title, description, location
	sort?: string; // "-createdAt" (default) | "costFrom" | "-costFrom"
	division?: string; // division _id
	tourType?: string; // tourType _id
	fields?: string;
};
export const tourApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getTours: builder.query<{ data: ITour[]; meta: IMeta }, TToursParams | void>({
			query: (params) => ({
				url: "/tour",
				method: "GET",
				params: params ?? undefined,
			}),
			providesTags: ["TOUR"],
			transformResponse: (response: IResponse<ITour[]> & { meta: IMeta }) => ({
				data: response.data,
				meta: response.meta,
			}),
		}),
		getSingleTour: builder.query<ITour, string>({
			query: (slug) => ({
				url: `/tour/${slug}`,
				method: "GET",
			}),
			providesTags: ["TOUR"],
			transformResponse: (response: IResponse<ITour>) => response.data,
		}),
		addTour: builder.mutation({
			query: (tourData: FormData) => ({
				url: "/tour/create",
				method: "POST",
				data: tourData,
			}),
			invalidatesTags: ["TOUR"],
		}),
		removeTour: builder.mutation({
			query: (tourId: string) => ({
				url: `/tour/${tourId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["TOUR"],
		}),

		addTourType: builder.mutation({
			query: (tourTypeName) => ({
				url: "/tour/create-tour-type",
				method: "POST",
				data: tourTypeName,
			}),
			invalidatesTags: ["TOUR"],
		}),
		removeTourType: builder.mutation({
			query: (tourTypeId) => ({
				url: `/tour/tour-types/${tourTypeId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["TOUR"],
		}),
		getTourTypes: builder.query({
			query: () => ({
				url: "/tour/tour-types",
				method: "GET",
			}),
			providesTags: ["TOUR"],
			transformResponse: (response) => response.data,
		}),
	}),
});

export const {
	useGetSingleTourQuery,
	useGetToursQuery,
	useRemoveTourMutation,
	useAddTourMutation,
	useGetTourTypesQuery,
	useAddTourTypeMutation,
	useRemoveTourTypeMutation,
} = tourApi;
