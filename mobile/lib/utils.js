import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";

export function formatMemberSince(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.toLocaleDateString("default", {
    month: "short",
  });
  return `${month} ${year}`;
}

export function formatPublishDate(dateString) {
  const date = new Date(dateString);
  const month = date.toLocaleDateString("default", {
    month: "short",
  });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day},${year}`;
}

export const renderRatingStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Ionicons
      key={i}
      name={i < Math.floor(rating) ? "star" : "star-outline"}
      size={20}
      color={i < Math.floor(rating) ? "#F4b400" : COLORS.textSecondary}
    />
  ));
};
