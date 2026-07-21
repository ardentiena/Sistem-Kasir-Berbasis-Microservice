import "./StatCard.css";

function StatCard({
    title,
    value,
    icon,
    color = "#2563EB"
}) {
    return (
        <div className="stat-card">

            <div
                className="stat-icon"
                style={{ background: color }}
            >
                {icon}
            </div>

            <div>

                <h4>{title}</h4>

                <h2>{value}</h2>

            </div>

        </div>
    );
}

export default StatCard;