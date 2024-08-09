import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import DrawIcon from '@mui/icons-material/Draw';
import { Map } from 'ol';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';


export interface MapButtonsProps {
    map: Map | null,
    onAddDraw: () => void,
    onRemoveFeatures: () => void,
    onUpload?: () => void; 
}

export default function MapButtons(props: MapButtonsProps ) {

  return (


    <ButtonGroup
      sx={{
        position: "absolute",
        bottom: "25px",
        right: "20px",
        backgroundColor: "white",
      }}
      orientation="vertical"
      aria-label="Vertical button group"
      variant="contained"
    >
      <IconButton sx={{ color: "#063B60" }} onClick={props.onAddDraw} >
        <DrawIcon />
      </IconButton>

      <IconButton sx={{ color: "#063B60" }} onClick={props.onUpload}>
        <CloudUploadIcon />
      </IconButton>

      <IconButton sx={{ color: "#063B60" }} onClick={props.onRemoveFeatures} >
        <DeleteIcon />
      </IconButton>
    </ButtonGroup>

  );
}