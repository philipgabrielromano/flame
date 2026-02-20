import { useState, useEffect, FormEvent, ChangeEvent, Fragment } from 'react';
import axios from 'axios';

// Redux
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../../store';

// Typescript
import { ApiResponse } from '../../../interfaces';

// UI
import { Button, SettingsHeadline, InputGroup, Table } from '../../UI';

// Utils
import { applyAuth } from '../../../utility';

interface PowerBIReport {
  id: string;
  name: string;
  embedUrl: string;
}

export const PowerBISettings = (): JSX.Element => {
  const dispatch = useDispatch();
  const { createNotification } = bindActionCreators(actionCreators, dispatch);

  const [reports, setReports] = useState<PowerBIReport[]>([]);
  const [formData, setFormData] = useState({ name: '', embedUrl: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: '', embedUrl: '' });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get<ApiResponse<PowerBIReport[]>>(
        '/api/powerbi'
      );
      setReports(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addReportHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.embedUrl.trim()) {
      createNotification({
        title: 'Error',
        message: 'Please fill in both name and embed URL',
      });
      return;
    }

    try {
      const res = await axios.post<ApiResponse<PowerBIReport[]>>(
        '/api/powerbi',
        formData,
        { headers: applyAuth() }
      );

      setReports(res.data.data);
      setFormData({ name: '', embedUrl: '' });
      createNotification({
        title: 'Success',
        message: 'Power BI report added',
      });
    } catch (err) {
      console.log(err);
      createNotification({
        title: 'Error',
        message: 'Failed to add report',
      });
    }
  };

  const deleteReportHandler = async (id: string) => {
    try {
      const res = await axios.delete<ApiResponse<PowerBIReport[]>>(
        `/api/powerbi/${id}`,
        { headers: applyAuth() }
      );

      setReports(res.data.data);
      createNotification({
        title: 'Success',
        message: 'Power BI report removed',
      });
    } catch (err) {
      console.log(err);
    }
  };

  const startEditHandler = (report: PowerBIReport) => {
    setEditingId(report.id);
    setEditData({ name: report.name, embedUrl: report.embedUrl });
  };

  const cancelEditHandler = () => {
    setEditingId(null);
    setEditData({ name: '', embedUrl: '' });
  };

  const saveEditHandler = async (id: string) => {
    if (!editData.name.trim() || !editData.embedUrl.trim()) {
      createNotification({
        title: 'Error',
        message: 'Please fill in both name and embed URL',
      });
      return;
    }

    try {
      const res = await axios.put<ApiResponse<PowerBIReport[]>>(
        `/api/powerbi/${id}`,
        editData,
        { headers: applyAuth() }
      );

      setReports(res.data.data);
      setEditingId(null);
      setEditData({ name: '', embedUrl: '' });
      createNotification({
        title: 'Success',
        message: 'Power BI report updated',
      });
    } catch (err) {
      console.log(err);
    }
  };

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const editInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  return (
    <Fragment>
      <form onSubmit={addReportHandler} style={{ marginBottom: '30px' }}>
        <SettingsHeadline text="Add Power BI Report" />
        <InputGroup>
          <label htmlFor="name">Report name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="My Dashboard"
            value={formData.name}
            onChange={inputChangeHandler}
          />
        </InputGroup>
        <InputGroup>
          <label htmlFor="embedUrl">Embed URL</label>
          <input
            type="text"
            id="embedUrl"
            name="embedUrl"
            placeholder="https://app.powerbi.com/reportEmbed?reportId=..."
            value={formData.embedUrl}
            onChange={inputChangeHandler}
          />
          <span>
            Use the &quot;Publish to web&quot; embed URL from Power BI, or the
            iframe src URL from the embed code
          </span>
        </InputGroup>
        <Button>Add report</Button>
      </form>

      <SettingsHeadline text="Saved Reports" />
      {reports.length > 0 ? (
        <Table headers={['Name', 'Actions']}>
          {reports.map((report) => (
            <tr key={report.id}>
              <td style={{ width: '100%' }}>
                {editingId === report.id ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={editInputChangeHandler}
                      style={{
                        padding: '4px 8px',
                        background: 'var(--color-background)',
                        color: 'var(--color-primary)',
                        border: '1px solid var(--color-accent)',
                        borderRadius: '4px',
                      }}
                    />
                    <input
                      type="text"
                      name="embedUrl"
                      value={editData.embedUrl}
                      onChange={editInputChangeHandler}
                      style={{
                        padding: '4px 8px',
                        background: 'var(--color-background)',
                        color: 'var(--color-primary)',
                        border: '1px solid var(--color-accent)',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    <strong>{report.name}</strong>
                    <br />
                    <span
                      style={{
                        fontSize: '0.8em',
                        opacity: 0.7,
                        wordBreak: 'break-all',
                      }}
                    >
                      {report.embedUrl}
                    </span>
                  </div>
                )}
              </td>
              <td>
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {editingId === report.id ? (
                    <>
                      <Button click={() => saveEditHandler(report.id)}>
                        Save
                      </Button>
                      <Button click={cancelEditHandler}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button click={() => startEditHandler(report)}>
                        Edit
                      </Button>
                      <Button click={() => deleteReportHandler(report.id)}>
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </Table>
      ) : (
        <p style={{ color: 'var(--color-primary)', opacity: 0.7 }}>
          No Power BI reports added yet
        </p>
      )}
    </Fragment>
  );
};
