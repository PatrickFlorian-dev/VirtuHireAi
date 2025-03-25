import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import {
  ColDef,
  GridApi,
  GridOptions,
  ICellRendererParams
} from '@ag-grid-community/core';
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
  searchableColumns?: string[]; 
  onRowClick?: (row: Record<string, unknown>) => void;
  customColumnWidths?: Record<string, number>;
};

// Custom cell renderer for the edit icon
const EditCellRenderer: React.FC<ICellRendererParams> = (props) => {
  return (
    <span
      onClick={() => console.log('Edit clicked for:', props.data)}
      style={{ cursor: 'pointer', color: '#007bff' }}
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
  height = '500px',
  enableExport = false,
  hiddenColumns = [],
  searchableColumns = [],
  onRowClick,
  customColumnWidths = {},
}: DynamicAgGridWithFetchProps) {
  // Register CSV Export module
  ModuleRegistry.registerModules([CsvExportModule]);

  const [rowData, setRowData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  // Auto-generate column definitions if not provided
  const autoGeneratedCols: ColDef[] = useMemo(() => {
    if (!rowData || rowData.length === 0) return [];
  
    // Edit Icon Column (always first)
    const editColumn: ColDef = {
      headerName: 'Edit',
      field: 'edit',
      cellRenderer: EditCellRenderer,
      width: 30,
      pinned: 'left',
      sortable: false,
      filter: false,
      resizable: false,
    };
  
    // Generate columns dynamically
    let generatedCols = Object.keys(rowData[0])
      .filter((key) => !hiddenColumns.includes(key))
      .map<ColDef>((key) => {
        const headerName = key.charAt(0).toUpperCase() + key.slice(1);
  
        return {
          headerName,
          field: key,
          sortable: true,
          filter: searchableColumns.includes(key) ? 'agTextColumnFilter' : false,
          filterParams: searchableColumns.includes(key)
            ? {
                textFormatter: (value: string) =>
                  value ? value.toLowerCase() : null,
              }
            : undefined,
          resizable: true,
          width: customColumnWidths?.[key] || undefined, // Apply override if provided
        };
      });
  
    // Move "active" column (if exists) to first position after "Edit"
    const activeIndex = generatedCols.findIndex((col) => col.field === 'active');
    if (activeIndex !== -1) {
      const [activeColumn] = generatedCols.splice(activeIndex, 1);
      generatedCols = [activeColumn, ...generatedCols];
    }
  
    return [editColumn, ...generatedCols];
  }, [rowData, columnDefs, hiddenColumns, searchableColumns, customColumnWidths]);  

  const defaultColDef: ColDef = {
    minWidth: 100,
    filter: true,
    sortable: true,
    resizable: true,
  };

  // Auto-size columns based on their content
  const autoSizeColumns = () => {
    if (!gridApi) return;
    const allColumnIds: string[] =
      gridApi.getColumns()?.map((col) => col.getId()) || [];
    if (allColumnIds.length) {
      gridApi.autoSizeColumns(allColumnIds);
    }
  };

  // Handler for CSV export
  const handleExport = () => {
    if (gridApi) {
      gridApi.exportDataAsCsv();
    }
  };

  // Recursive function to fetch additional records in the background
  const fetchAdditionalRecords = async (lastId: number | null, recordsLeft: number | null ) => {
    const payload = { tableName, query, username, recordsLeft, lastId };
    try {
      const response = await axios.post(
        'http://localhost:5000/api/crud/read',
        payload
      );
      const newRows = response.data.data.data;
      setRowData((prevRows) => [
        ...prevRows,
        ...(Array.isArray(newRows) ? newRows : []),
      ]);
      autoSizeColumns();
      if (response.data.data.recordsLeft > 0) {
        await fetchAdditionalRecords(response.data.data.lastId, response.data.data.recordsLeft);
      }
    } catch (error) {
      console.error('Error fetching additional records:', error);
    }
  };

  // Initial API call
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      const payload = { tableName, query, username, recordsLeft: null, lastId: null };
      try {
        const response = await axios.post(
          'http://localhost:5000/api/crud/read',
          payload
        );
        const initialRows = response.data.data.data;
        setRowData(Array.isArray(initialRows) ? initialRows : []);
        if (response.data.data.recordsLeft > 0) {
          fetchAdditionalRecords(response.data.data.lastId, response.data.data.recordsLeft);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [tableName, username, query]);

  // Auto-resize columns whenever rowData updates
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
        <div className="ag-theme-alpine" style={{ width: '100%', height }}>
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
