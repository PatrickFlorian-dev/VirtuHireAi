import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef, GridApi, GridOptions, ICellRendererParams } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { CsvExportModule } from '@ag-grid-community/csv-export';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

type DynamicAgGridWithFetchProps = {
  tableName: string;
  username: string;
  query: object;
  columnDefs?: ColDef[];
  gridOptions?: GridOptions;
  title?: string;
  height?: string;
  enableExport?: boolean;
  hiddenColumns?: string[];
  onRowClick?: (row: Record<string, unknown>) => void;
};

// ✅ Fix: Define `ICellRendererParams` properly instead of `any`
const EditCellRenderer: React.FC<ICellRendererParams> = (props) => {
  return (
    <span
      onClick={() => console.log("Edit clicked for:", props.data)}
      style={{ cursor: "pointer", color: "#007bff" }}
    >
      <FontAwesomeIcon icon={faPencilAlt} />
    </span>
  );
};

export default function DynamicAgGridWithFetch({
  tableName,
  username,
  query,
  columnDefs,
  gridOptions,
  title,
  height = "500px",
  enableExport = false,
  hiddenColumns = [],
  onRowClick,
}: DynamicAgGridWithFetchProps) {

  ModuleRegistry.registerModules([CsvExportModule]);
  const [rowData, setRowData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  // Auto-generate column definitions
  const autoGeneratedCols: ColDef[] = useMemo(() => {
    if (!rowData || rowData.length === 0) return [];

    // Edit Icon Column (First Column)
    const editColumn: ColDef = {
      headerName: "Edit",
      field: "edit",
      cellRenderer: EditCellRenderer,
      width: 50,
      pinned: "left", // Keeps it fixed on the left
      sortable: false,
      filter: false,
      resizable: false,
    };

    // Generate remaining columns dynamically
    const generatedCols = Object.keys(rowData[0])
      .filter((key) => !hiddenColumns.includes(key)) // Exclude hidden columns
      .map<ColDef>((key) => ({ // ✅ Fix: Explicitly type map function
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        field: key,
        sortable: true,
        filter: true,
        resizable: true,
      }));

    return [editColumn, ...generatedCols]; // Prepend edit column
  }, [rowData, columnDefs, hiddenColumns]);

  const defaultColDef: ColDef = {
    minWidth: 100,
    filter: true,
    sortable: true,
    resizable: true,
  };

  // ✅ Fix: Properly auto-size columns
  const autoSizeColumns = () => {
    if (!gridApi) return;
    const allColumnIds: string[] = gridApi.getColumns()?.map((col) => col.getId()) || [];
    if (allColumnIds.length) {
      gridApi.autoSizeColumns(allColumnIds);
    }
  };

  const handleExport = () => {
    if (gridApi) {
      gridApi.exportDataAsCsv();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const payload = { tableName, query, username, recordsLeft: null, lastId: null };

      try {
        const response = await axios.post('http://localhost:5000/api/crud/read', payload);
        const rows = response.data.data.data;
        setRowData(Array.isArray(rows) ? rows : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, username, query]);

  useEffect(() => {
    if (gridApi) {
      setTimeout(autoSizeColumns, 100);
    }
  }, [rowData]);

  return (
    <div className="space-y-4">
      {title && <h2 className="text-xl font-bold">{title}</h2>}
      <div className="flex justify-between items-center mb-2">
        {enableExport && (
          <button
            onClick={handleExport}
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            Export CSV
          </button>
        )}
      </div>
      {loading ? (
        <div style={{ width: '100%', height }} className="flex items-center justify-center">
          <span>Loading...</span>
        </div>
      ) : (
        <div className="ag-theme-alpine" style={{ width: "100%", height }}>
          <AgGridReact
            modules={[ClientSideRowModelModule]}
            rowData={rowData}
            columnDefs={autoGeneratedCols}
            defaultColDef={{ ...defaultColDef, ...gridOptions?.defaultColDef }}
            pagination={true}
            paginationPageSize={gridOptions?.paginationPageSize || 10}
            onGridReady={(params) => {
              setGridApi(params.api);
              autoSizeColumns();
            }}
            onRowClicked={(e) => onRowClick && onRowClick(e.data)}
            {...gridOptions}
          />
        </div>
      )}
      {!loading && rowData.length === 0 && <p>No data found.</p>}
    </div>
  );
}
