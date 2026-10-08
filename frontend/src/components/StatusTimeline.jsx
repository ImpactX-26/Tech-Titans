function StatusTimeline({ status }) {
  const steps = ["ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED"];

  const isReopened = status === "REOPENED";

  if (isReopened) {
    return (
      <div className="timeline">
        <div className="timeline-step active">
          <div className="timeline-dot">!</div>
          <span>REOPENED</span>
        </div>

        <p>
          Citizen reported that the issue was not completely resolved.
          The complaint has been sent back for action.
        </p>
      </div>
    );
  }

  const currentIndex = steps.indexOf(status);

  return (
    <div className="timeline">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`timeline-step ${
            index <= currentIndex ? "active" : ""
          }`}
        >
          <div className="timeline-dot">
            {index <= currentIndex ? "✓" : ""}
          </div>

          <span>{step.replace("_", " ")}</span>
        </div>
      ))}
    </div>
  );
}

export default StatusTimeline;