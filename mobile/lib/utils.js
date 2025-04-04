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
