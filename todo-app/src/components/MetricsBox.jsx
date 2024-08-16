import React from 'react';
import {Typography} from '@mui/material';

const MetricsBox = ({
    averageTime,
    averageTimeByPriority,
}) => {

    return(
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <div>
          <Typography variant="subtitle1">Average time to complete each task:</Typography>
          <Typography variant="h6">{averageTime}</Typography>
        </div>
        <div>
          <Typography variant="subtitle1">Average time by priority:</Typography>
          <Typography variant="body1">High: {averageTimeByPriority.High}</Typography>
          <Typography variant="body1">Medium: {averageTimeByPriority.Medium}</Typography>
          <Typography variant="body1">Low: {averageTimeByPriority.Low}</Typography>
        </div>
        </div>
    );
};

export default MetricsBox;