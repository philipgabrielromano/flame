import { useState, useEffect } from 'react';
import axios from 'axios';

import { ApiResponse } from '../../../interfaces';

import classes from './PowerBIEmbed.module.css';

interface PowerBIReport {
  id: string;
  name: string;
  embedUrl: string;
}

export const PowerBIEmbed = (): JSX.Element | null => {
  const [reports, setReports] = useState<PowerBIReport[]>([]);

  useEffect(() => {
    axios
      .get<ApiResponse<PowerBIReport[]>>('/api/powerbi')
      .then((res) => setReports(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  if (reports.length === 0) return null;

  return (
    <div className={classes.PowerBISection}>
      {reports.map((report) => (
        <div key={report.id} className={classes.ReportContainer}>
          <h3 className={classes.ReportTitle}>{report.name}</h3>
          <div className={classes.IframeWrapper}>
            <iframe
              title={report.name}
              src={report.embedUrl}
              frameBorder="0"
              allowFullScreen
              className={classes.ReportIframe}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
