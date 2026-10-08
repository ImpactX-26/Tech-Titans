function StatsCard({ title, value, icon, description }) {
  return (
    <div className="stats-card">
      <div className="stats-card-top">
        <div className="stats-card-icon">
          {icon}
        </div>
      </div>

      <div className="stats-card-content">
        <p className="stats-card-title">{title}</p>

        <h2 className="stats-card-value">
          {value}
        </h2>

        {description && (
          <p className="stats-card-description">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default StatsCard;