import "./PageTitle.css";

function PageTitle({
    title,
    subtitle
}) {

    return (

        <div className="page-title">

            <h1>{title}</h1>

            <p>{subtitle}</p>

        </div>

    );

}

export default PageTitle;