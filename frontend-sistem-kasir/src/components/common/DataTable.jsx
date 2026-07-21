import "../../styles/components.css";

function DataTable({
    columns = [],
    data = [],
    renderActions
}) {

    return (

        <table className="data-table">

            <thead>

                <tr>

                    {columns.map((column) => (

                        <th key={column.key}>
                            {column.label}
                        </th>

                    ))}

                    {renderActions && <th>Aksi</th>}

                </tr>

            </thead>

            <tbody>

                {data.length === 0 && (

                    <tr>

                        <td
                            colSpan={
                                renderActions
                                    ? columns.length + 1
                                    : columns.length
                            }
                            className="empty-cell"
                        >

                            Tidak ada data

                        </td>

                    </tr>

                )}

                {data.map((row, index) => (

                    <tr key={index}>

                        {columns.map((column) => (

                            <td key={column.key}>
                                {row[column.key]}
                            </td>

                        ))}

                        {renderActions && (

                            <td>

                                {renderActions(row)}

                            </td>

                        )}

                    </tr>

                ))}

            </tbody>

        </table>

    );

}

export default DataTable;