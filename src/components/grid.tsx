'use client'

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core CSS
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Theme
import Image from 'next/image';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { usePresence, assertConfiguration } from "@ably-labs/react-hooks";
import { useSpace, useMembers } from "@ably/spaces/react";
import Participants from './participant';


// Define interface for the row data
interface RowData {
  mission: string;
  company: string;
  location: string;
  date: string;
  price: number;
  successful: boolean;
  rocket: string;
}


interface Participant {
  clientId: string;
}


// Custom Cell Renderer (Display logos based on cell value)
const CompanyLogoRenderer: React.FC<{ value: string }> = ({ value }) =>  (
  <span
    style={{
      display: 'flex',
      height: '100%',
      width: '100%',
      alignItems: 'center',
    }}
  >
    {value && (
      <Image
        alt={`${value} Flag`}
        src={`https://www.ag-grid.com/example-assets/space-company-logos/${value.toLowerCase()}.png`}
        width={100}
        height={50}
        style={{
          display: 'block',
          width: '25px',
          height: 'auto',
          maxHeight: '50%',
          marginRight: '12px',
          filter: 'brightness(1.1)',
        }}
      />
    )}
    {value}

    <p
      style={{
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
    >
      {value}
    </p>
  </span>
);

/* Custom Cell Renderer (Display tick / cross in 'Successful' column) */
const MissionResultRenderer: React.FC<{ value: boolean }> = ({ value }) => (
  <span
    style={{
      display: 'flex',
      justifyContent: 'center',
      height: '100%',
      alignItems: 'center',
    }}
  >
    {
      <Image
        alt={`${value}`}
        width={100}
        height={10}
        src={`https://www.ag-grid.com/example-assets/icons/${
          value ? 'tick-in-circle' : 'cross-in-circle'
        }.png`}
        style={{ width: 'auto', height: 'auto' }}
      />
    }
  </span>
);

/* Format Date Cells */
const dateFormatter = (params:{value:string}) => {
  return new Date(params.value).toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
type ColDefs = (ColDef<RowData, any> | ColGroupDef<RowData>)[];

interface GridExampleProps {
spaces: any
}

// Create new GridExample component
const GridExample:  React.FC<GridExampleProps> =  ({spaces}) =>{
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState<RowData[]>([]);

 

  // Column Definitions: Defines & controls grid columns.
    const colDefs: ColDefs = useMemo(() => [
    {
      field: 'mission',
      width: 150,
      checkboxSelection: true,
    },
    {
      field: 'company',
      width: 130,
      cellRenderer: CompanyLogoRenderer,
    },
    {
      field: 'location',
      width: 225,
    },
    {
      field: 'date',
      valueFormatter: dateFormatter,
    },
    {
      field: 'price',
      width: 130,
      valueFormatter: (params: { value: number }) => {
        return '£' + params.value.toLocaleString();
      },
    },
    {
      field: 'successful',
      width: 120,
      cellRenderer: MissionResultRenderer,
    },
    { field: 'rocket' },
  ], []);

  // Fetch data & update rowData state
  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/space-mission-data.json')
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
    }, []);
 

  // Apply settings across all columns
  const defaultColDef = useMemo(() => ({
    filter: true,
    editable: true,
  }), []);

  const ably = assertConfiguration();
  const [presenceData] = usePresence("headlines");

  const space =  spaces.get('board-presentation', { offlineTimeout: 180_000});

  console.log(space)

//  // Listen to all member changes within the space
// space.members.subscribe('update', (member) => {
//   // Use getOthers() to filter and update the state of all avatars except the member's own
//   const otherMembers =  space.members.getOthers();
//   renderAvatars(otherMembers);
// });

  const presenceList = presenceData.map(
    (member: Participant, index: number) => {
      const isItMe = member.clientId === ably.auth.clientId ? "(me)" : "";

      console.log(member)

      return (
        <li key={index} >
          <span >{member.clientId}</span>
          <span>{isItMe}</span>
        </li>
      );
    }
  );



  // Container: Defines the grid's theme & dimensions.
  return (
    <div
      className={
        "ag-theme-quartz-dark"
      }

      style={{ width: '100%', height: '100%', alignItems:'center' }}
    >
      {presenceList}
      {/* <AgGridReact
        rowData={rowData}
     
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        rowSelection="multiple"
        onSelectionChanged={(event) => console.log('Row Selected!')}
        onCellValueChanged={(event) =>
          console.log(`New Cell Value: ${event.value}`)
        }
      /> */}
    </div>
  );
};

export default GridExample