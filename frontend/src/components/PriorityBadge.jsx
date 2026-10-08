function PriorityBadge({ priority }) {
  const priorityClass = priority?.toLowerCase() || "medium";

  return (
    <span className={`priority-badge ${priorityClass}`}>
      {priority || "MEDIUM"}
    </span>
  );
}

export default PriorityBadge;