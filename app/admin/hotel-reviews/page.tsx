"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/app/lib/api";
import DataTable from "@/app/components/ui/Table";
import DeleteModal from "@/app/components/ui/DeleteModal";

type HotelReview = {
  id: number;
  review: string;
  rating: number;
  is_show: boolean;
  user: {
    id: number;
    name: string;
    email: string;
    profile_image: string | null;
  };
};

export default function HotelReviewPage() {
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<HotelReview[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchHotelReviews = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/hotel/admin/reviews");
      console.log(data.data.reviews.data);
      setReviews(data?.data?.reviews.data || []);
    } catch (error) {
      console.error("Failed to fetch hotel reviews", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;

    try {
      await api.delete(`/api/hotel/admin/hotel-reviews/${deleteId}`);
      await fetchHotelReviews();
    } catch (error) {
      console.error("Failed to delete hotel review", error);
    } finally {
      setDeleteModalOpen(false);
      setDeleteId(null);
    }
  }, [deleteId, fetchHotelReviews]);

  useEffect(() => {
    fetchHotelReviews();
  }, [fetchHotelReviews]);

  const handleToggleVisibility = async (id: number, current: boolean) => {
    console.log("button clicked");
    console.log(id);
    console.log(current);
    try {
      // await api.patch(`/api/hotel/admin/hotel-reviews/${id}/toggle`, {
      //   is_show: !current,
      // });
      // fetchHotelReviews();
    } catch (error) {
      console.error("Toggle failed", error);
    }
  };

  return (
    <div>
      <DataTable
        loading={loading}
        name="Hotel Reviews"
        searchPlaceholder="Search reviews..."
        data={reviews}
        hideSearch={true}
        hideAdd={true}
        hideActions={true}
        columns={[
          {
            key: "user",
            label: "User",
            sortable: false,
            render: (row: { user: { name: any } }) =>
              row.user?.name || "Unknown",
          },
          {
            key: "review",
            label: "Review",
            sortable: true,
            render: undefined,
          },
          {
            key: "rating",
            label: "Rating",
            sortable: true,
            render: undefined,
          },
          {
            key: "is_show",
            label: "Visible",
            render: (row: any) => (
              <button
                onClick={() => handleToggleVisibility(row.id, row.is_show)}
                className={`
      px-4 py-1.5 rounded-sm text-white text-sm font-semibold shadow-md
      transition-all duration-200 cursor-pointer select-none
      ${
        row.is_show
          ? "bg-green-500 hover:bg-green-600 active:scale-95"
          : "bg-red-500 hover:bg-red-600 active:scale-95"
      }
    `}
              >
                {row.is_show ? "Show Review" : "Hide Review"}
              </button>
            ),
          },
        ]}
      />
    </div>
  );
}
